import ActivityDropdown from './activity/Dropdown';
import styles from './styles/header.module.scss';
import { useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  return (
    <>
      <header className={styles.header}>
        <div>
          {!location.pathname.includes('profile') && (
            <ActivityDropdown id="notifications" />
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
