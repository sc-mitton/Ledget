import stripeLogo from '../../../shared/svg-images/stripelogo.svg';

const StripeLogo = ({ size = 57 }) => {
  return (
    <img
      src={stripeLogo}
      alt="stripe"
      style={{ width: `${size}px`, height: 'auto' }}
    />
  );
};

export default StripeLogo;
