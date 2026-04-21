import { BASE_URL } from '../utils/constants';

const buildUrl = (path, params) => {
  const url = new URL(path, BASE_URL + '/');
  Object.entries(params).forEach(([k, v]) => {
    if (v !== '' && v !== null && v !== undefined) url.searchParams.set(k, v);
  });
  return url.toString();
};

const handleResponse = async (res) => {
  if (res.status === 404) return null;
  if (!res.ok) {
    const err = new Error(`HTTP ${res.status} ${res.statusText}`);
    err.status = res.status;
    throw err;
  }
  return res.json();
};

export const fetchCharacters = async (
  { page = 1, name = '', status = '' } = {},
  { signal } = {}
) => {
  const isFirstPage = page === 1 && name === '' && status === '';
  if (isFirstPage && typeof window !== 'undefined' && window.__rmPrefetch) {
    const data = await window.__rmPrefetch;
    window.__rmPrefetch = null;
    if (data) return data;
  }

  const url = buildUrl('character', { page, name, status });
  const res = await fetch(url, { signal });
  return handleResponse(res);
};
