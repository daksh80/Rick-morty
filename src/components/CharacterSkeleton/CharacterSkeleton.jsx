import styles from './CharacterSkeleton.module.scss';

const cls = (name) => styles[`character-skeleton__${name}`];

const SkeletonCard = () => (
  <div className={cls('card')} aria-hidden="true">
    <div className={cls('image')} />
    <div className={cls('body')}>
      <div className={cls('line')} style={{ width: '70%' }} />
      <div className={cls('line')} style={{ width: '50%' }} />
      <div className={cls('line')} style={{ width: '60%', marginTop: 8 }} />
    </div>
  </div>
);

const CharacterSkeleton = ({ count = 20 }) => (
  <ul className={styles['character-skeleton']} aria-hidden="true">
    {Array.from({ length: count }, (_, i) => (
      <li key={i}><SkeletonCard /></li>
    ))}
  </ul>
);

export default CharacterSkeleton;
