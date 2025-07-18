import { useLocation, useNavigate, Link } from 'react-router-dom';
import { LedgetLogoIcon } from '@ledget/media';
import { useColorScheme, MiniCta, useScreenContext } from '@ledget/ui';
import styles from './styles.module.scss';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark } = useColorScheme();
  const { screenSize } = useScreenContext();

  const splitPath = location.pathname.split('/');

  const text = {
    login: "Don't have an account?",
    register: 'Already have an account?',
  };

  return (
    <header className={styles.header} data-size={screenSize}>
      <div>
        <a
          href={import.meta.env.VITE_LANDING}
          tabIndex={0}
          aria-label="login page"
        >
          <LedgetLogoIcon darkMode={isDark} />
        </a>
      </div>
      <div>
        {splitPath[splitPath.length - 1] === 'register' && (
          <>
            {screenSize !== 'extra-small' && `${text.register}`}&nbsp;&nbsp;
            <Link to="/login" tabIndex={0}>
              Login
            </Link>
          </>
        )}
        {splitPath[splitPath.length - 1] === 'login' && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {screenSize !== 'extra-small' && `${text.login}`}
            <MiniCta
              onClick={() => navigate('/register')}
              aria-label="Sign Up"
              style={{ marginLeft: '.5rem' }}
            >
              Sign Up
            </MiniCta>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
