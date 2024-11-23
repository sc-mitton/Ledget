import { Image } from 'react-native';

import tourSpendingCategoriesLight from '../../../shared/images/spending-categories-tour-light.png';
import tourSpendingCategoriesDark from '../../../shared/images/spending-categories-tour-dark.png';

const TourSpendingCategories = ({ dark = false, size = 425 }) => {
  return dark ? (
    <Image
      style={{ width: size, height: size }}
      source={tourSpendingCategoriesDark}
      resizeMode='contain'
    />
  ) : (
    <Image
      style={{ width: size, height: size }}
      source={tourSpendingCategoriesLight}
      resizeMode='contain'
    />
  );
};

export default TourSpendingCategories;
