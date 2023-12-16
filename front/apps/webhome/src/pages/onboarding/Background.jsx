import { LedgetLogoIcon } from '@ledget/media'

const Header = () => (
    <header>
        <div className="header-container">
            <div className="header-logo">
                <LedgetLogoIcon />
            </div>
            <div className="header-right">
            </div>
        </div>
    </header>
)

const Dashboard = () => (
    <>
        <Header />
        <div
            style={{
                backgroundColor: 'var(--overlay)',
                display: 'flex',
                position: 'fixed',
                inset: '0',
            }}
        >
        </div>
    </>
)

export default Dashboard
