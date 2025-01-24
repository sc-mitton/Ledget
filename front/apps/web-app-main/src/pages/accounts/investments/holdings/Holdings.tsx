import { ArrowUpRight, ArrowDownLeft, ChevronRight } from '@geist-ui/icons';

import styles from './styles.module.scss';
import { TextButton, Window } from '@ledget/ui';

const Transactions = () => {
  return (
    <div className={styles.container}>
      <Window className={styles.table}>
        <div className={styles.header}>
          <TextButton>
            <div>
              Holdings
              <ChevronRight className="icon small" strokeWidth={2} />
            </div>
          </TextButton>
        </div>
      </Window>
    </div>
  );
};

export default Transactions;
