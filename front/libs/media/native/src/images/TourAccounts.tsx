import { Image } from 'react-native';

import TourAccountsLight from '../../../shared/images/accounts-tour-light.png';
import TourAccountsDark from '../../../shared/images/accounts-tour-dark.png';

const TourAccounts = ({ dark = false, size = 325 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={TourAccountsDark}
      resizeMode='contain'
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={TourAccountsLight}
      resizeMode='contain'
    />
  );
};

export default TourAccounts;
