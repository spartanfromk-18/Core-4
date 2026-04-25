// Client-side connector addressing the Python Cloud Run container
// The backend handles the actual Embedding & Vertex AI MatchingEngine logic

const CLOUD_RUN_API_URL = import.meta.env.VITE_API_ENDPOINT || 'http://localhost:8080';

export interface SemanticSearchResult {
  id: string;
  question_id: string;
  subject: string;
  year: number | string;
  answer_pdf_url: string;
}

export const executeSemanticSearch = async (
  query: string, 
  universityId: string, 
  subject: string
): Promise<SemanticSearchResult[]> => {
  try {
    const response = await fetch(`${CLOUD_RUN_API_URL}/semantic_search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        university_id: universityId,
        subject
      })
    });

    if (!response.ok) {
      throw new Error(`Vector search failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Vector Search Fetch Error", err);
    throw err;
  }
};
