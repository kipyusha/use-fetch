import { useCallback, useEffect, useRef, useState } from "react";

interface TApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  cancelFetch: () => void;
  refetch: () => void;
}

function useFetch<T>(initialUrl: string): TApiResponse<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const abortConrollerRef = useRef<AbortController | null>(null);
  const currentUrlRef = useRef<string>(initialUrl);

  const cancelFetch = useCallback(() => {
    if (abortConrollerRef.current) {
      abortConrollerRef.current.abort();
      console.log("feth request cancelled");
    }
    setLoading(false);
  }, []);

  const executeFetch = useCallback(async (currentUrl: string) => {
    if (!currentUrl) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    currentUrlRef.current = currentUrl;

    const controller = new AbortController();
    abortConrollerRef.current = controller;
    const signal = controller.signal;
    try {
      const response = await fetch(currentUrl, { signal });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: response.statusText }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }
      const result: T = await response.json();
      setData(result);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
      } else {
        setError(new Error("An unknown eeror occurred"));
      }
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    executeFetch(currentUrlRef.current);
  }, [executeFetch]);

  useEffect(() => {
    if (initialUrl) {
      executeFetch(initialUrl);
    }
    return () => {
      cancelFetch();
    };
  }, [initialUrl, executeFetch, cancelFetch]);

  return { data, loading, error, cancelFetch, refetch };
}

export default useFetch;
