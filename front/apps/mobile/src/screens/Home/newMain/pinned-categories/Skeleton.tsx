import { Box } from '@ledget/native-ui';

import styles from './styles/pinned-categories';
import EmojiProgressCircle from './EmojiProgressCircle';

const Skeleton = () => {
  return (
    <Box opacity={0.3} style={styles.skeletonCircles}>
      {Array.from({ length: 4 }).map((_, index) => (
        <Box flex={1} key={index} alignItems="center" justifyContent="center">
          <EmojiProgressCircle
            progress={Math.random() * 0.5 + 0.25}
            emoji={null}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Skeleton;
