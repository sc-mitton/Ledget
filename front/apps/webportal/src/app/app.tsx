import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import "@styles/base.scss"
import "@styles/portal.scss"
import Routes from './Routes'
import store from '@features/store'
import { ColorSchemedMain, ScreenProvider } from '@ledget/ui'

function App() {

  return (
    <ScreenProvider>
      <ColorSchemedMain>
        <Provider store={store}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Provider>
      </ColorSchemedMain>
    </ScreenProvider>
  )
}

export default App
