export const BASE_URL = 'https://rickandmortyapi.com/api';

export const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'alive', label: 'Alive' },
  { value: 'dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' },
];

export const STATUS_COLOR = {
  alive: '#55cc44',
  dead: '#d63d2e',
  unknown: '#9e9e9e',
};

export const DEBOUNCE_DELAY = 400;
