import logo from '../../../shared/brand-svgs/logo.svg';
import logoDarkMode from '../../../shared/brand-svgs/logo-dark-mode.svg';

const Logo = ({ darkMode = false }) =>
  darkMode ? (
    <img src={logoDarkMode} alt={'logo'} className={'icon'} />
  ) : (
    <img src={logo} alt={'logo'} className={'icon'} />
  );

export default Logo;
