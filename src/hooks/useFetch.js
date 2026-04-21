import { useState, useEffect, useCallback } from 'react';
import { cacheGet, cacheSet, cacheDelete } from '../utils/cache';

const inflightRequests = new Map();

export const prefetchResource = ({ key, fetcher, ttl }) => {
  const cached = cacheGet(key);
  if (cached !== null) return Promise.resolve(cached);

  let requestPromise = inflightRequests.get(key);
  if (!requestPromise) {
    requestPromise = fetcher({})
      .then((result) => {
        if (result !== null && result !== undefined) {
          cacheSet(key, result, ttl);
        }
        return result;
      })
      .finally(() => {
        inflightRequests.delete(key);
      });

    inflightRequests.set(key, requestPromise);
  }

  return requestPromise.catch((error) => {
    if (error?.name === 'AbortError') return null;
    throw error;
  });
};

const useFetch = ({ key, fetcher, ttl, enabled = true }) => {
  const [data, setData] = useState(() => cacheGet(key));
  const [loading, setLoading] = useState(() => enabled && cacheGet(key) === null);
  const [error, setError] = useState(null);
  const [refreshTick, setRefreshTick] = useState(0);

  const refetch = useCallback(() => {
    cacheDelete(key);
    inflightRequests.delete(key);
    setRefreshTick((n) => n + 1);
  }, [key]);

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    let cancelled = false;
    const run = async () => {
      const cached = cacheGet(key);
      if (cached !== null) {
        setData(cached);
        setLoading(false);
      } else {
        setLoading(true);
      }
      setError(null);

      let requestPromise = inflightRequests.get(key);
      if (!requestPromise) {
        requestPromise = fetcher({ signal: controller.signal })
          .then((result) => {
            if (result !== null && result !== undefined) {
              cacheSet(key, result, ttl);
            }
            return result;
          })
          .finally(() => {
            inflightRequests.delete(key);
          });
        inflightRequests.set(key, requestPromise);
      }

      requestPromise
        .then((result) => {
          if (!cancelled) setData(result);
        })
        .catch((err) => {
          if (!cancelled && err?.name !== 'AbortError') setError(err);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    };

    run();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [key, refreshTick, enabled, fetcher, ttl]);

  return { data, loading, error, refetch };
};

export default useFetch;
