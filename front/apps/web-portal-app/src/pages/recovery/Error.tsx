import { FormError } from '@ledget/ui';
import styles from './styles/error.module.scss';

const Error = ({ msg }: { msg?: string }) => (
  <div className={styles.recoveryErrorContainer}>
    {msg ? (
      <FormError msg={msg} />
    ) : (
      <FormError msg={'Something went wrong, please try again later.'} />
    )}
  </div>
);

export default Error;
