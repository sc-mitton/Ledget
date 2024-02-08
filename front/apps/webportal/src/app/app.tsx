import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import Header from './header'
import "@styles/base.scss"
import "@styles/portal.scss"
import Routes from './Routes'
import store from '@features/store'
import { ColorSchemedDiv, ScreenProvider } from '@ledget/ui'

function App() {

  return (
    <ScreenProvider>
      <ColorSchemedDiv className='full-screen'>
        <Provider store={store}>
          <BrowserRouter>
            <Routes />
          </BrowserRouter>
        </Provider>
      </ColorSchemedDiv>
    </ScreenProvider>
  )
}

export default App
