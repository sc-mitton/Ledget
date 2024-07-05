import PersonLight from '../../../shared/images/personlight.png';
import PersonDark from '../../../shared/images/persondark.png';

const Person = ({ dark }: { dark: boolean }) => {
  return dark ? (
    <img style={{ height: '3em' }} src={PersonDark} alt="user" />
  ) : (
    <img style={{ height: '3em' }} src={PersonLight} alt="user" />
  );
};

export default Person;
