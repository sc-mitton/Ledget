import { MoreHorizontal, Edit2, Trash } from '@geist-ui/icons';

import styles from './styles/menu.module.scss';
import { StyledMenu, IconButtonHalfGray } from '@ledget/ui';
import { useCategoryModalContext } from './Context';

const Menu = () => {
  const { setView } = useCategoryModalContext();

  return (
    <div className={styles.menu}>
      <StyledMenu>
        <StyledMenu.Button as={IconButtonHalfGray}>
          <MoreHorizontal size={'1.5em'} />
        </StyledMenu.Button>
        <StyledMenu.Items>
          <StyledMenu.Item
            label={'Edit'}
            icon={<Edit2 className="icon" />}
            onClick={() => setView('edit')}
          />
          <StyledMenu.Item
            renderLeft={() => <span className={styles.redText}>Delete</span>}
            renderRight={() => (
              <div className={styles.redText}>
                <Trash className="icon" />
              </div>
            )}
            onClick={() => setView('delete')}
          />
        </StyledMenu.Items>
      </StyledMenu>
    </div>
  );
};

export default Menu;
