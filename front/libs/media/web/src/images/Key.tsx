import keylight from '../../../shared/images/keylight.png';
import keydark from '../../../shared/images/keydark.png';

const Key = ({ dark }: { dark: boolean }) => {
  return dark ? (
    <img style={{ height: '3em' }} src={keydark} alt="key" />
  ) : (
    <img style={{ height: '3em' }} src={keylight} alt="key" />
  );
};

export default Key;
