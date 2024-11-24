import { Image } from 'react-native';

import LinkLightPng from '../../../shared/images/3d-link-light.png';
import LinkDarkPng from '../../../shared/images/3d-link-dark.png';

const LinkGraphic = ({ dark = false, size = 104 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={LinkDarkPng}
      resizeMode='contain'
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={LinkLightPng}
      resizeMode='contain'
    />
  );
};

export default LinkGraphic;
