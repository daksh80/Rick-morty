import { useCallback, useRef, useState } from 'react';

const createAbortError = () => {
  const error = new Error('The operation was aborted.');
  error.name = 'AbortError';
  return error;
};

/**
 * Retry an async operation with exponential backoff.
 *
 * Useful for transient network failures — each failed attempt waits
 * `baseDelay × backoff^n` ms before retrying, up to `maxRetries` times.
 *
 * @example
 *   const { run, attempt, isRetrying } = useRetry({ maxRetries: 3 });
 *   const data = await run(() => fetch('/api/…').then(r => r.json()));
 */
const useRetry = ({ maxRetries = 3, baseDelay = 500, backoff = 2 } = {}) => {
  const [attempt, setAttempt] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const timeoutRef = useRef(null);

  const sleep = (ms, signal) =>
    new Promise((resolve, reject) => {
      if (signal?.aborted) {
        reject(createAbortError());
        return;
      }

      const onAbort = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        reject(createAbortError());
      };

      timeoutRef.current = setTimeout(() => {
        signal?.removeEventListener('abort', onAbort);
        resolve();
      }, ms);

      signal?.addEventListener('abort', onAbort, { once: true });
    });

  const shouldRetryError = (error) => {
    if (!error || error.name === 'AbortError') return false;
    if (!error.status) return true;
    return error.status === 408 || error.status === 429 || error.status >= 500;
  };

  const run = useCallback(
    async (operation, { signal } = {}) => {
      setAttempt(0);
      setIsRetrying(false);

      for (let i = 0; i <= maxRetries; i += 1) {
        try {
          if (signal?.aborted) throw createAbortError();
          setAttempt(i);
          if (i > 0) setIsRetrying(true);
          const result = await operation({ signal });
          setIsRetrying(false);
          return result;
        } catch (err) {
          if (i === maxRetries || !shouldRetryError(err)) {
            setIsRetrying(false);
            throw err;
          }
          await sleep(baseDelay * backoff ** i, signal);
        }
      }
      return undefined;
    },
    [maxRetries, baseDelay, backoff]
  );

  const cancel = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsRetrying(false);
  }, []);

  return { run, attempt, isRetrying, cancel };
};

export default useRetry;
