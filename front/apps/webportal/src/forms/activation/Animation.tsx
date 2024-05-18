import { Circle3d } from '@ledget/media';
import { useColorScheme } from '@ledget/ui';

import './styles/Animation.scss'

export const Animation = () => {
    const { isDark } = useColorScheme()

    return (
        <div id='animated-joined-circles'>
            <Circle3d dark={isDark} />
            <Circle3d dark={isDark} />
        </div>
    )
}

export default Animation
