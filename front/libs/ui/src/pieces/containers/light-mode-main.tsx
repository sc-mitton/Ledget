import './styles/light-mode-styles.scss'


const LightModeMain = ({ children }: { children: React.ReactNode }) => {

    return (
        <main>
            {children}
        </main>
    )
}

export default LightModeMain
