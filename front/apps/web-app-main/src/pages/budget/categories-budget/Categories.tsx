import { Tag } from '@geist-ui/icons';

import { Window } from '@ledget/ui';
import List from './List';
import styles from './styles.module.scss';

import { useScreenContext } from '@ledget/ui';

const ColumnView = () => {
  const { screenSize } = useScreenContext();
  return (
    <div className={styles.columns} data-size={screenSize}>
      <Window>
        <List period="month" />
      </Window>
      <Window>
        <List period="year" />
      </Window>
    </div>
  );
};

const SpendingCategories = () => (
  <div className={styles.container}>
    <h3>
      <Tag className="icon" />
      Categories
    </h3>
    <ColumnView />
  </div>
);

export default SpendingCategories;
