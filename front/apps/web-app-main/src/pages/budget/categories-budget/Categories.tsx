import { Tag, Plus } from '@geist-ui/icons';
import { useLocation, useNavigate } from 'react-router-dom';

import List from './List';
import styles from './styles.module.scss';
import { Window } from '@ledget/ui';
import { Filter2 } from '@ledget/media';
import { useScreenContext, IconButtonBorderedGray } from '@ledget/ui';

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
          <IconButtonBorderedGray>
            <Filter2 className="icon" />
          </IconButtonBorderedGray>
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
