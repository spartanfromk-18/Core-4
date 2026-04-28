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

const buildPrompt = (query: string, university: string, isRetry = false): string => {
  const retryPrefix = isRetry
    ? `IMPORTANT: Your previous response was too generic. You MUST focus EXCLUSIVELY on ${university}. ` +
      `Include ${university}-specific exam patterns, marking schemes, and syllabus structures. ` +
      `Do NOT give generic advice.\n\n`
    : '';
  return `${retryPrefix}${EXAMINER_PERSONA}\n\nTarget University: ${university}\nQuery: ${query}\n\nInitiate deep analysis:`;
};

export interface StreamCallbacks {
  onToken: (text: string) => void;
  onStall?: () => void;
}

export const streamLogisticsAnalysis = async (
  query: string,
  university: string,
  callbacks: StreamCallbacks,
  attempt = 1
): Promise<{ fullText: string; confidenceScore: number }> => {
  const { onToken, onStall } = callbacks;

  try {
    console.log("[Core-4] Initiating stream with gemini-1.5-flash-latest...");
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
    const prompt = buildPrompt(query, university, attempt > 1);
    const result = await model.generateContentStream(prompt);

    let fullText = '';
    let lastTokenTime = Date.now();

    // Set up stall detector
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

    // Auto-retry if response isn't university-specific (max 2 attempts)
    if (attempt === 1 && !isResponseRelevant(fullText, university)) {
      console.warn(`[Core-4] Response not university-specific for ${university}. Auto-retrying with refined prompt...`);
      // Clear current output and retry
      onToken('\n\n> System: Refining query context for ' + university + '...\n\n');
      return streamLogisticsAnalysis(query, university, callbacks, 2);
    }

    // Extract Confidence Score
    let confidenceScore = 85;
    const match = fullText.match(/Confidence Score:\s*\[?(\d{1,3})\]?/i);
    if (match?.[1]) {
      confidenceScore = Math.min(parseInt(match[1], 10), 100);
    }

    return { fullText, confidenceScore };

  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`System Recovery (Node Congestion): ${error.message}`);
    }
    throw new Error('System Recovery (Node Congestion): The intelligence engine encountered an unknown error. Please retry.');
  }
};
