import styles from './Select.module.scss';

const Select = ({ value, onChange, options, label, id }) => (
  <div className={styles['select-field']}>
    {label && (
      <label htmlFor={id} className={styles['select-field__label']}>
        {label}
      </label>
    )}
    <select
      id={id}
      className={styles['select-field__control']}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;
