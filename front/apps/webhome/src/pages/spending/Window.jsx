import './styles/Window.css'
import NeedsConfirmationWindow from './needsConfirmation/Window'
import HistoryWindow from './history/Window'


const Spending = () => (
    <div id="spending-window">
        <NeedsConfirmationWindow />
        <HistoryWindow />
    </div>
)

export default Spending
