import { Image } from 'react-native';

import emptyBoxLight from '../../../shared/images/empty-box-light.png';
import emptyBoxDark from '../../../shared/images/empty-box-dark.png';

const EmptyBox = ({ dark = false, size = 72 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={emptyBoxDark}
      resizeMode="contain"
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={emptyBoxLight}
      resizeMode="contain"
    />
  );
};

export default EmptyBox;
