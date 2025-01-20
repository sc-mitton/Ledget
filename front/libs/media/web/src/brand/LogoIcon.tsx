import logoDark from '../../../shared/brand-pngs/logo-icon-dark.png';
import logoLight from '../../../shared/brand-pngs/logo-icon-light.png';

const Logo = ({ darkMode = false }) =>
  darkMode ? (
    <img src={logoDark} alt={'logo'} className={'icon'} />
  ) : (
    <img src={logoLight} alt={'logo'} className={'icon'} />
  );

export default Logo;
