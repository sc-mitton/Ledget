import { Image } from 'react-native';

import envelopelight from '../../../shared/images/envelopelight.png';
import envelopedark from '../../../shared/images/envelopedark.png';

const EnvelopeImage = ({ dark, size = 84 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={envelopedark}
      resizeMode='contain'
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={envelopelight}
      resizeMode='contain'
    />
  );
};

export default EnvelopeImage;
