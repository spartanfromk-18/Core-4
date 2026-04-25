import { useState } from 'react';
import { executeSemanticSearch } from '../firebase/vectorSearch';
import type { SemanticSearchResult } from '../firebase/vectorSearch';

export const useSemanticSearch = () => {
  const [results, setResults] = useState<SemanticSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = async (query: string, universityId: string, subject: string) => {
    setIsSearching(true);
    setError(null);
    try {
      const data = await executeSemanticSearch(query, universityId, subject);
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during search.');
    } finally {
      setIsSearching(false);
    }
  };

  return { results, isSearching, error, search };
};
