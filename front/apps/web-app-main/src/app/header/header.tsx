import { LedgetLogoIcon2 } from '@ledget/media';
import ActivityDropdown from './activity/Dropdown';
import styles from './styles/header.module.scss';

function Header() {
  return (
    <>
      <header className={styles.header}>
        <div>
          <ActivityDropdown id="notifications" />
        </div>
      </header>
    </>
  );
}

export default Header;
