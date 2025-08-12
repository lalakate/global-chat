import { useState } from 'react';

export const useApi = <T>(apiFunction: (...args: any[]) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = async (...args: any[]) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error';
      setError(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData(null);
    setError(null);
    setLoading(false);
  };

  return { data, loading, error, execute, reset };
};
