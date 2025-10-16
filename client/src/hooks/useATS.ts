/**
 * React Hook for ATS Scoring
 */

import { useState } from 'react';
import { apiService } from '../services/api';
import type { ATSScoreRequest, ATSScoreResponse } from '../services/api';

export interface ATSHookResult {
  calculateScore: (request: ATSScoreRequest) => Promise<ATSScoreResponse>;
  isLoading: boolean;
  error: string | null;
}

export const useATS = (): ATSHookResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateScore = async (request: ATSScoreRequest): Promise<ATSScoreResponse> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await apiService.calculateATSScore(request);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    calculateScore,
    isLoading,
    error
  };
}; 