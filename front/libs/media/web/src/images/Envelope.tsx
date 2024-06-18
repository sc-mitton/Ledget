import EnvelopeLight from '../../../shared/images/envelopelight.png';
import EnvelopeDark from '../../../shared/images/envelopedark.png';

const EnvelopeImage = ({ dark }: { dark: boolean }) => {
  return dark ? (
    <img style={{ height: '3em' }} src={EnvelopeDark} alt="desert" />
  ) : (
    <img style={{ height: '3em' }} src={EnvelopeLight} alt="desert" />
  );
};

export default EnvelopeImage;
