import { Image } from 'react-native';

import keylight from '../../../shared/images/keylight.png';
import keydark from '../../../shared/images/keydark.png';

const Key = ({ dark }) => {
  return dark ? (
    <Image style={{ height: 48 }} src={keydark} alt="key" />
  ) : (
    <Image style={{ height: 48 }} src={keylight} alt="key" />
  );
};

export default Key;
