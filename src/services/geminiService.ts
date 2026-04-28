import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("[Core-4] CRITICAL: VITE_GEMINI_API_KEY is missing from environment variables.");
}
const genAI = new GoogleGenerativeAI(apiKey);
// Note: The SDK defaults to v1 or v1beta. We'll stick to the default and try a different model string.

const EXAMINER_PERSONA = `You are a Senior External Examiner for top-tier Indian universities (AKTU, SPPU, VJTI). 
Your tone is strict, highly analytical, and uncompromisingly precise. 
You evaluate exam logistics, predict question patterns, and dissect syllabus structures with absolute authority.
Provide structured outputs using Markdown (bullet points, clear headings) that fit well inside a high-end terminal interface. 
Always conclude your analysis by generating an exact numerical Confidence Score [0-100] based on the certainty of your predictions. 
Format this specifically as: "Confidence Score: [number]".`;

// University-specific keywords to validate relevance of the response
const UNIVERSITY_KEYWORDS: Record<string, string[]> = {
  AKTU: ['aktu', 'dr. a.p.j', 'lucknow', 'uttar pradesh', 'ktu', 'semester', 'btech'],
  SPPU: ['sppu', 'savitribai', 'pune', 'maharashtra', 'pune university'],
  VJTI: ['vjti', 'veermata', 'jijabai', 'matunga', 'mumbai'],
};

const STREAM_TIMEOUT_MS = 15000; // 15s timeout to detect stalls

/**
 * Validates that the response is university-specific and not generic.
 * Returns true if the response contains at least one relevant keyword.
 */
const isResponseRelevant = (text: string, university: string): boolean => {
  const lower = text.toLowerCase();
  const keywords = UNIVERSITY_KEYWORDS[university] ?? [];
  // If no keywords defined for this university, allow through
  if (keywords.length === 0) return true;
  return keywords.some(kw => lower.includes(kw));
};

export type AnalysisMode = 'normal' | 'sheet-filler' | 'diagram-architect';

const MODE_INSTRUCTIONS: Record<AnalysisMode, string> = {
  normal: 'Dissect the syllabus and exam logistics with precision.',
  'sheet-filler': 'Structure the answer for a 10-mark university exam question. Use bold headings, bullet points, and ensure the content is optimized for filling exam sheets effectively.',
  'diagram-architect': 'Create a detailed logic walkthrough. Include a Mermaid.js diagram code block representing the architecture or flow of the concept. Ensure the diagram is hand-drawable and simple but technically accurate.'
};

const buildPrompt = (query: string, university: string, mode: AnalysisMode = 'normal', isRetry = false): string => {
  const retryPrefix = isRetry
    ? `IMPORTANT: Your previous response was too generic. You MUST focus EXCLUSIVELY on ${university}. ` +
      `Include ${university}-specific exam patterns, marking schemes, and syllabus structures. ` +
      `Do NOT give generic advice.\n\n`
    : '';
  
  const modeInstruction = MODE_INSTRUCTIONS[mode];

  return `${retryPrefix}${EXAMINER_PERSONA}\n\nTarget University: ${university}\nMode: ${mode}\nInstruction: ${modeInstruction}\nQuery: ${query}\n\nInitiate deep analysis:`;
};

export interface StreamCallbacks {
  onToken: (text: string) => void;
  onStall?: () => void;
}

export const streamLogisticsAnalysis = async (
  query: string,
  university: string,
  callbacks: StreamCallbacks,
  mode: AnalysisMode = 'normal',
  attempt = 1,
  modelId = 'gemini-1.5-flash'
): Promise<{ fullText: string; confidenceScore: number }> => {
  const { onToken, onStall } = callbacks;

  try {
    console.log(`[Core-4] Initiating ${mode} stream with ${modelId} (API: v1beta)...`);
    
    // Using v1beta explicitly for latest features/model support
    const model = genAI.getGenerativeModel(
      { model: modelId },
      { apiVersion: 'v1beta' }
    );

    const prompt = buildPrompt(query, university, mode, attempt > 1);
    const result = await model.generateContentStream(prompt);

    let fullText = '';
    let lastTokenTime = Date.now();

    const stallTimer = setInterval(() => {
      if (Date.now() - lastTokenTime > STREAM_TIMEOUT_MS) {
        onStall?.();
        clearInterval(stallTimer);
      }
    }, 1000);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullText += chunkText;
      lastTokenTime = Date.now();
      onToken(chunkText);
    }

    clearInterval(stallTimer);

    if (attempt === 1 && !isResponseRelevant(fullText, university)) {
      console.warn(`[Core-4] Response not university-specific. Auto-retrying...`);
      onToken('\n\n> System: Refining query context for ' + university + '...\n\n');
      return streamLogisticsAnalysis(query, university, callbacks, mode, 2, modelId);
    }

    let confidenceScore = 85;
    const match = fullText.match(/Confidence Score:\s*\[?(\d{1,3})\]?/i);
    if (match?.[1]) {
      confidenceScore = Math.min(parseInt(match[1], 10), 100);
    }

    return { fullText, confidenceScore };

  } catch (error: any) {
    const errorMsg = error?.message || '';
    console.error(`[Core-4] Engine Error:`, errorMsg);

    // Fallback logic if Flash is unavailable in region or Model ID is invalid
    if ((errorMsg.includes('404') || errorMsg.includes('not found')) && modelId === 'gemini-1.5-flash') {
      console.warn(`[Core-4] Model ${modelId} not found. Falling back to gemini-1.5-pro...`);
      return streamLogisticsAnalysis(query, university, callbacks, mode, attempt, 'gemini-1.5-pro');
    }

    if (error instanceof Error) {
      throw new Error(`System Recovery (Node Congestion): ${error.message}`);
    }
    throw new Error('System Recovery (Node Congestion): The intelligence engine encountered an unknown error.');
  }
};
