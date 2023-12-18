import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import "./style/base.css"
import "./style/portal.scss"
import Routes from './Routes'
import store from '@features/store'
import { ColorSchemedMain } from '@ledget/ui'

function App() {

    return (
        <ColorSchemedMain>
            <Provider store={store}>
                <BrowserRouter>
                    <Routes />
                </BrowserRouter>
            </Provider>
        </ColorSchemedMain>
    )
}

export default App
