import Character from '../Character/Character';
import styles from './CharacterList.module.scss';

const CharacterList = ({ characters }) => {
  if (characters.length === 0) {
    return (
      <div className={styles['character-list__empty']}>
        <p>No characters found for the selected filters.</p>
      </div>
    );
  }

  return (
    <ul className={styles['character-list']} aria-label="Character list">
      {characters.map((char, index) => (
        <li key={char.id}>
          <Character
            name={char.name}
            image={char.image}
            status={char.status}
            species={char.species}
            location={char.location?.name ?? 'Unknown'}
            priority={index === 0}
          />
        </li>
      ))}
    </ul>
  );
};

export default CharacterList;
