import { BakedSwitch } from '@ledget/ui'
import { useColorScheme } from '@ledget/ui'
import './styles/Settings.scss'

const Settings = () => {
    const { isDark, setDarkMode } = useColorScheme()

    return (
        <div className="padded-content">
            <h2>Settings</h2>
            <div className="settings-list">
                <section className='inner-window'>
                    <ul>
                        <BakedSwitch
                            as='li'
                            checked={isDark}
                            onChange={() => setDarkMode(!isDark)}
                        >
                            <span>{isDark ? 'Dark' : 'Light'} mode</span>
                        </BakedSwitch>
                    </ul>
                </section>
            </div>
        </div>
    )
}

export default Settings
