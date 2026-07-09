import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export function useQueryParam(key: string, fallback = '') {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(key) ?? fallback;

  const setValue = useCallback(
    (next: string) => {
     
      setSearchParams(
        (prev) => {
          const nextParams = new URLSearchParams(prev);
          if (next) {
            nextParams.set(key, next);
          } else {
            nextParams.delete(key);
          }
          return nextParams;
        },
        { replace: false }
      );
    },
    [key, setSearchParams]
  );

  return [value, setValue] as const;
}
