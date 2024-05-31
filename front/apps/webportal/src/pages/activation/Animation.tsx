import { Circle3d } from '@ledget/media';
import { useColorScheme } from '@ledget/ui';

import styles from './styles/animation.module.scss';

export const Animation = () => {
    const { isDark } = useColorScheme()

    return (
        <div className={styles.animatedCircles}>
            <Circle3d dark={isDark} />
            <Circle3d dark={isDark} />
        </div>
    )
}

export default Animation
