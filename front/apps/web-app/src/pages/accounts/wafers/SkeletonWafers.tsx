import styles from './styles/wafers.module.scss';
import waferStyles from './styles/wafer.module.scss';
import { ShimmerDiv } from '@ledget/ui';

const SkeletonWafers = ({ count, width }: { count: number; width: number }) => (
  <div className={styles.skeletonWafers}>
    {Array(count)
      .fill(0)
      .map((_, index) => (
        <div
          className={styles.skeletonAccountWaferContainer}
          style={{ width: `${width}px` }}
        >
          <ShimmerDiv
            key={index}
            className={waferStyles.skeletonAccountWafer}
            shimmering={true}
            background="var(--skeleton-wafer-background)"
            shimmerColor="var(--skeleton-wafer-shimmer)"
            style={{ position: 'absolute' }}
          />
        </div>
      ))}
  </div>
);

export default SkeletonWafers;
