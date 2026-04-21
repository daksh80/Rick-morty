import { useCallback, useState } from 'react';

const useErrorBoundary = () => {
  const [, setState] = useState();

  const throwError = useCallback((error) => {
    const toThrow = error instanceof Error ? error : new Error(String(error));
    setState(() => {
      throw toThrow;
    });
  }, []);

  return { throwError };
};

export default useErrorBoundary;
