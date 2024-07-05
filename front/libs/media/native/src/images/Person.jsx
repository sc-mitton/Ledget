import { Image } from 'react-native';

import PersonLight from '../../../shared/images/personlight.png';
import PersonDark from '../../../shared/images/persondark.png';

const Person = ({ dark }) => {
  return dark ? (
    <Image style={{ height: 48 }} src={PersonDark} alt="user" />
  ) : (
    <Image style={{ height: 48 }} src={PersonLight} alt="user" />
  );
};

export default Person;
