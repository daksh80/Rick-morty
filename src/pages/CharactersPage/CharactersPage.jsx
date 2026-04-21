import { useEffect, useRef, useState } from 'react';
import useCharacters from '../../hooks/useCharacters';
import useDebounce from '../../hooks/useDebounce';
import Filters from '../../components/Filters/Filters';
import CharacterList from '../../components/CharacterList/CharacterList';
import CharacterSkeleton from '../../components/CharacterSkeleton/CharacterSkeleton';
import Pagination from '../../components/Pagination/Pagination';
import ErrorMessage from '../../components/common/ErrorMessage/ErrorMessage';
import { DEBOUNCE_DELAY } from '../../utils/constants';
import styles from './CharactersPage.module.scss';

const cls = (name) => styles[`characters-page__${name}`];

const CharactersPage = () => {
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState('');
  const [status, setStatus] = useState('');

  const debouncedName = useDebounce(nameInput, DEBOUNCE_DELAY);
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPage(1);
  }, [debouncedName]);

  const { characters, pageInfo, loading, error, retry } = useCharacters({
    page,
    name: debouncedName,
    status,
  });

  const handleStatusChange = (value) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <main className={styles['characters-page']}>
      <header className={cls('header')}>
        <h1 className={cls('title')}>Rick &amp; Morty Characters</h1>
        <p className={cls('subtitle')}>
          {pageInfo ? `${pageInfo.count} characters found` : 'Browse the multiverse'}
        </p>
      </header>

      <Filters
        name={nameInput}
        onNameChange={setNameInput}
        status={status}
        onStatusChange={handleStatusChange}
      />

      {loading && <CharacterSkeleton count={20} />}
      {error && <ErrorMessage message={error} onRetry={retry} />}
      {!loading && !error && <CharacterList characters={characters} />}

      <Pagination
        currentPage={page}
        totalPages={pageInfo?.pages ?? 0}
        onPageChange={setPage}
      />
    </main>
  );
};

export default CharactersPage;
