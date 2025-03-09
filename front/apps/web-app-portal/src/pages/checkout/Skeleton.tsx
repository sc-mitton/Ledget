import { PulseDiv, TextSkeletonDiv } from '@ledget/ui';
import styles from './styles/prices.module.scss';

const Skeleton = () => {
  return (
    <PulseDiv isSkeleton={true} className={styles.skeleton}>
      <TextSkeletonDiv
        isSkeleton={true}
        length={12}
        style={{ height: '2.5em' }}
      />
      <TextSkeletonDiv isSkeleton={true} length={12} />
    </PulseDiv>
  );
};

export default Skeleton;
