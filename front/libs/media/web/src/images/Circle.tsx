import CircleLight from '../../../shared/images/circlelight3d.png';
import CircleDark from '../../../shared/images/circledark3d.png';

const Circle = ({ dark }: { dark: boolean }) => {
  return dark ? (
    <img style={{ height: '3em' }} src={CircleDark} alt="3d circle" />
  ) : (
    <img style={{ height: '3em' }} src={CircleLight} alt="3d circle" />
  );
};

export default Circle;
