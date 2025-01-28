import { Card } from '@components';
import { cardWidth, cardHeight } from './constants';

const SkeletonCards = () => (
  <>
    <Card width={cardWidth} height={cardHeight} />
    <Card width={cardWidth} height={cardHeight} />
    <Card width={cardWidth} height={cardHeight} />
  </>
);

export default SkeletonCards;
