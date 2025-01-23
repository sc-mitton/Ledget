import styles from './styles/card.module.scss';
import { PulseDiv } from '@ledget/ui';
import { cardWidth } from './constants';

const SkeletonCards = () => (
  <>
    <div
      className={styles.card}
      data-skeleton={true}
      style={{ '--card-width': `${cardWidth}px` } as React.CSSProperties}
    >
      <PulseDiv isSkeleton={true} />
    </div>
    <div
      className={styles.card}
      data-skeleton={true}
      style={{ '--card-width': `${cardWidth}px` } as React.CSSProperties}
    >
      <PulseDiv isSkeleton={true} />
    </div>
    <div
      className={styles.card}
      data-skeleton={true}
      style={{ '--card-width': `${cardWidth}px` } as React.CSSProperties}
    >
      <PulseDiv isSkeleton={true} />
    </div>
  </>
);

export default SkeletonCards;
