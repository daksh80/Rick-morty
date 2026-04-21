import Input from '../common/Input/Input';
import Select from '../common/Select/Select';
import { STATUS_OPTIONS } from '../../utils/constants';
import styles from './Filters.module.scss';

const Filters = ({ name, onNameChange, status, onStatusChange }) => (
  <div className={styles.filters}>
    <div className={styles['filters__field']}>
      <Input
        id="name-filter"
        label="Search by name"
        value={name}
        onChange={onNameChange}
        placeholder="e.g. Rick Sanchez"
      />
    </div>
    <div className={styles['filters__field']}>
      <Select
        id="status-filter"
        label="Filter by status"
        value={status}
        onChange={onStatusChange}
        options={STATUS_OPTIONS}
      />
    </div>
  </div>
);

export default Filters;
