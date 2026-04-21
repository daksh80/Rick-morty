import { useCallback, useMemo } from 'react';
import { fetchCharacters } from '../api/rickAndMorty';
import useFetch, { prefetchResource } from './useFetch';
import useRetry from './useRetry';

const CHARACTERS_TTL = 5 * 60 * 1000;

export const getCharactersKey = ({ page, name, status }) =>
  `characters:${page}:${name}:${status}`;

export const prefetchCharacters = ({ page, name, status }) =>
  prefetchResource({
    key: getCharactersKey({ page, name, status }),
    ttl: CHARACTERS_TTL,
    fetcher: ({ signal }) => fetchCharacters({ page, name, status }, { signal }),
  });

/**
 * Domain hook — fetches + caches a page of characters for the given filters.
 *
 * Composes:
 *   - useFetch : request + cache-by-key + cancellation
 *   - useRetry : transparent exponential-backoff retry on transient failures
 */
const useCharacters = ({ page, name, status }) => {
  const key = getCharactersKey({ page, name, status });
  const { run: runWithRetry } = useRetry({ maxRetries: 2, baseDelay: 500 });

  const fetcher = useCallback(
    ({ signal }) =>
      runWithRetry(
        ({ signal: retrySignal }) => fetchCharacters({ page, name, status }, { signal: retrySignal }),
        { signal }
      ),
    [page, name, status, runWithRetry]
  );

  const { data, loading, error, refetch } = useFetch({
    key,
    fetcher,
    ttl: CHARACTERS_TTL,
  });

  const friendlyError = useMemo(() => {
    if (!error) return null;
    const isNetworkError = !error.status;
    return isNetworkError
      ? 'Unable to reach the Rick & Morty API. Check your connection and try again.'
      : `Error ${error.status}: ${error.message}`;
  }, [error]);

  return {
    characters: data?.results ?? [],
    pageInfo: data?.info ?? null,
    loading,
    error: friendlyError,
    retry: refetch,
  };
};

export default useCharacters;
