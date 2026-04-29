import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
if (!apiKey) {
  console.error("[Core-4] CRITICAL: VITE_GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(apiKey);

// System Instructions - The "Core" identity of the engine
const SYSTEM_INSTRUCTION = `You are a Senior External Examiner for top-tier Indian universities (AKTU, SPPU, VJTI). 
Your tone is strict, highly analytical, and uncompromisingly precise. 
You evaluate exam logistics, predict question patterns, and dissect syllabus structures with absolute authority.
Provide structured outputs using Markdown (bullet points, clear headings) that fit well inside a high-end terminal interface. 
Always conclude your analysis by generating an exact numerical Confidence Score [0-100] based on the certainty of your predictions. 
Format this specifically as: "Confidence Score: [number]".`;

// University-specific keywords to validate relevance
const UNIVERSITY_KEYWORDS: Record<string, string[]> = {
  AKTU: ['aktu', 'dr. a.p.j', 'lucknow', 'uttar pradesh', 'ktu', 'semester', 'btech'],
  SPPU: ['sppu', 'savitribai', 'pune', 'maharashtra', 'pune university'],
  VJTI: ['vjti', 'veermata', 'jijabai', 'matunga', 'mumbai'],
};

const STREAM_TIMEOUT_MS = 15000;

export type AnalysisMode = 'normal' | 'sheet-filler' | 'diagram-architect';

const MODE_INSTRUCTIONS: Record<AnalysisMode, string> = {
  normal: 'Dissect the syllabus and exam logistics with precision.',
  'sheet-filler': 'Structure the answer for a 10-mark university exam question. Use bold headings, bullet points, and ensure content is optimized for filling exam sheets effectively.',
  'diagram-architect': 'Create a detailed logic walkthrough. Include a Mermaid.js diagram code block. Ensure the diagram is hand-drawable and technically accurate.'
};

/**
 * Validates that the response is university-specific.
 */
const isResponseRelevant = (text: string, university: string): boolean => {
  const lower = text.toLowerCase();
  const keywords = UNIVERSITY_KEYWORDS[university] ?? [];
  if (keywords.length === 0) return true;
  return keywords.some(kw => lower.includes(kw));
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
  modelId = 'gemini-2.0-flash'
): Promise<{ fullText: string; confidenceScore: number }> => {
  const { onToken, onStall } = callbacks;

  try {
    console.log(`[Core-4] Initiating ${mode} analysis via ${modelId}...`);

    const model = genAI.getGenerativeModel({
      model: modelId,
      systemInstruction: SYSTEM_INSTRUCTION,
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 2048,
        responseMimeType: "text/plain",
      },
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
      ],
    }, { apiVersion: 'v1beta' });

    const modeInstruction = MODE_INSTRUCTIONS[mode];
    const retryPrefix = attempt > 1 ? `CRITICAL RETRY: Previous response lacked ${university} specificity. DO NOT BE GENERIC.\n` : '';
    
    const prompt = `${retryPrefix}Target University: ${university}\nMode: ${mode}\nInstruction: ${modeInstruction}\nQuery: ${query}\n\nInitiate deep analysis:`;

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

    // Context Validation
    if (attempt === 1 && !isResponseRelevant(fullText, university)) {
      console.warn(`[Core-4] Redirecting engine for ${university} specificity...`);
      onToken('\n\n> System: Refining logic for ' + university + '...\n\n');
      return streamLogisticsAnalysis(query, university, callbacks, mode, 2, modelId);
    }

    // Score Extraction
    let confidenceScore = 85;
    const match = fullText.match(/Confidence Score:\s*\[?(\d{1,3})\]?/i);
    if (match?.[1]) {
      confidenceScore = Math.min(parseInt(match[1], 10), 100);
    }

    return { fullText, confidenceScore };

  } catch (error: any) {
    const errorMsg = error?.message || '';
    console.error(`[Core-4] Engine Fault:`, errorMsg);

    const isModelError = errorMsg.includes('404') || errorMsg.includes('not found');

    if (isModelError && modelId !== 'gemini-2.0-flash-lite') {
      console.warn(`[Core-4] Model ${modelId} unavailable. Falling back to gemini-2.0-flash-lite...`);
      onToken('\n\n> System: Switching to stable core (gemini-2.0-flash-lite)...\n\n');
      return streamLogisticsAnalysis(query, university, callbacks, mode, attempt, 'gemini-2.0-flash-lite');
    }

    throw new Error(`System Error: ${errorMsg || 'Node Congestion detected.'}`);
  }
};
