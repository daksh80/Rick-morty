import { useCallback, useState } from 'react';

/**
 * Imperatively forward an async error to the nearest <ErrorBoundary>.
 *
 * Error boundaries only catch errors thrown during render / lifecycle —
 * they miss errors from event handlers, promises, and effects. This hook
 * schedules a re-render that throws during render, letting the boundary
 * catch it.
 *
 * @example
 *   const { throwError } = useErrorBoundary();
 *   try { await risky(); } catch (err) { throwError(err); }
 */
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
