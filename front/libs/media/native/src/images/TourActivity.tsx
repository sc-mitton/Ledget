import { Image } from 'react-native';

import tourActivityLight from '../../../shared/images/activity-tour-light.png';
import tourActivityDark from '../../../shared/images/activity-tour-dark.png';

const TourActivity = ({ dark = false, size = 425 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={tourActivityDark}
      resizeMode="contain"
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={tourActivityLight}
      resizeMode="contain"
    />
  );
};

export default TourActivity;
