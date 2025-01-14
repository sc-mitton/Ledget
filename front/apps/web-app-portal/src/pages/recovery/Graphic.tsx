import { useColorScheme, StatusPulse } from '@ledget/ui';
import { Key } from '@ledget/media';
import styles from './styles/graphic.module.scss';

const MainGraphic = ({ unLocked }: { unLocked?: boolean }) => {
  const { isDark } = useColorScheme();

  return (
    <div className={styles.imageContainer}>
      <Key dark={isDark} />
      <StatusPulse positive={unLocked} size="medium" />
    </div>
  );
};

export default MainGraphic;
