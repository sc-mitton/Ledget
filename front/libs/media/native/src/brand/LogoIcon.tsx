import { Image } from 'react-native';

import LogoIconDark from '../../../shared/brand-pngs/logo-icon-dark.png';
import LogoIconLight from '../../../shared/brand-pngs/logo-icon-light.png';

const LogoIconGrayscale = ({ dark = false, size = 64 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={LogoIconDark}
      resizeMode="contain"
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={LogoIconLight}
      resizeMode="contain"
    />
  );
};

export default LogoIconGrayscale;
