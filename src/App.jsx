import CharactersPage from './pages/CharactersPage/CharactersPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

const App = () => (
  <ErrorBoundary onError={(err) => console.error('App error boundary:', err)}>
    <CharactersPage />
  </ErrorBoundary>
);

export default App;
