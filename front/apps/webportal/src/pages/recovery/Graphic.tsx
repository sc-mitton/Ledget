import { useColorScheme, StatusPulse } from '@ledget/ui'
import { Key } from '@ledget/media'

const MainGraphic = ({ unLocked }: { unLocked?: boolean }) => {
    const { isDark } = useColorScheme()

    return (
        <div
            className={`${(unLocked) ? 'unlocked' : 'locked'}`}
            id="image-container"
        >
            <Key dark={isDark} />
            <StatusPulse positive={unLocked} size="medium" />
        </div>
    )
}

export default MainGraphic
