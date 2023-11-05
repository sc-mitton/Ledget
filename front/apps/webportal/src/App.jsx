import { BrowserRouter } from 'react-router-dom'

import "./style/base.css"
import "./style/portal.scss"
import Routes from './Routes'
import store from '@features/store'

function App() {

    return (
        <main>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>
        </main >
    )
}

export default App
