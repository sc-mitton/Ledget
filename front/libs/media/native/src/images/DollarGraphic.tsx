import { Image } from 'react-native';

import DollarLightPng from '../../../shared/images/3d-dollar-light.png';
import DollarDarkPng from '../../../shared/images/3d-dollar-dark.png';

const DollarGraphic = ({ dark = false, size = 220 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={DollarDarkPng}
      resizeMode='contain'
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={DollarLightPng}
      resizeMode='contain'
    />
  );
};

export default DollarGraphic;
