import { memo } from 'react';
import styles from './Character.module.scss';
import { STATUS_COLOR } from '../../utils/constants';

const cls = (name) => styles[`character__${name}`];

const Character = memo(({ name, image, status, species, location, priority = false }) => {
  const statusColor = STATUS_COLOR[status?.toLowerCase()] ?? STATUS_COLOR.unknown;

  return (
    <article className={styles.character}>
      <img
        src={image}
        alt={name}
        className={cls('image')}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        width="300"
        height="300"
      />
      <div className={cls('body')}>
        <h2 className={cls('name')}>{name}</h2>
        <span className={cls('status')} style={{ '--status-color': statusColor }}>
          <span className={cls('dot')} />
          {status} — {species}
        </span>
        <p className={cls('location')}>
          <span className={cls('location-label')}>Last seen</span>
          {location}
        </p>
      </div>
    </article>
  );
});

Character.displayName = 'Character';

export default Character;
