import { Tag, Plus } from '@geist-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import List from './List';
import styles from './styles.module.scss';
import { Window } from '@ledget/ui';
import { useScreenContext, IconButtonBorderedGray } from '@ledget/ui';
import OrderMenu from '../order-menu/OrderMenu';

const ColumnView = () => {
  const { screenSize } = useScreenContext();
  return (
    <div className={styles.columns} data-screen-size={screenSize}>
      <Window>
        <List period="month" />
      </Window>
      <Window>
        <List period="year" />
      </Window>
    </div>
  );
};

const SpendingCategories = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3>
          <Tag className="icon" />
          Categories
        </h3>
        <div className={styles.headerButtons}>
          <div>
            <OrderMenu itemType="category" />
          </div>
          <IconButtonBorderedGray
            onClick={() => navigate(`/budget/new-category${location.search}`)}
          >
            <Plus className="icon" />
          </IconButtonBorderedGray>
        </div>
      </div>
      <ColumnView />
    </div>
  );
};

export default SpendingCategories;
