import logoDark from '../../../shared/brand-pngs/logoIconGrayscaleDark.png';
import logoLight from '../../../shared/brand-pngs/logoIconGrayscaleLight.png';

const Logo = ({ darkMode = false }) =>
  darkMode ? (
    <img src={logoDark} alt={'logo'} className={'icon'} />
  ) : (
    <img src={logoLight} alt={'logo'} className={'icon'} />
  );

export default Logo;
