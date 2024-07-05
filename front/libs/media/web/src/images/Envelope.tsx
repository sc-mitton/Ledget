import EnvelopeLight from '../../../shared/images/envelopelight.png';
import EnvelopeDark from '../../../shared/images/envelopedark.png';

const EnvelopeImage = ({ dark }: { dark: boolean }) => {
  return dark ? (
    <img style={{ height: '3em' }} src={EnvelopeDark} alt="envelope" />
  ) : (
    <img style={{ height: '3em' }} src={EnvelopeLight} alt="envelope" />
  );
};

export default EnvelopeImage;
