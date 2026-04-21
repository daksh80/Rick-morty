import styles from './Input.module.scss';

const Input = ({ value, onChange, placeholder, label, id }) => (
  <div className={styles['input-field']}>
    {label && (
      <label htmlFor={id} className={styles['input-field__label']}>
        {label}
      </label>
    )}
    <input
      id={id}
      className={styles['input-field__control']}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  </div>
);

export default Input;
