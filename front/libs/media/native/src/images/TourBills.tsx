import { Image } from 'react-native';

import TourBillsLight from '../../../shared/images/bills-tour-light.png';
import TourBillsDark from '../../../shared/images/bills-tour-dark.png';

const TourBills = ({ dark = false, size = 425 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={TourBillsDark}
      resizeMode="contain"
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={TourBillsLight}
      resizeMode="contain"
    />
  );
};

export default TourBills;
