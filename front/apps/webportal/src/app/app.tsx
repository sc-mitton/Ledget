import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux';

import Routes from './Routes'
import store from '@features/store'
import { ColorSchemeProvider } from '@ledget/ui'
import { ColorSchemedDiv, ScreenProvider } from '@ledget/ui'
import { setEnvironment, selectEnvironment } from '@ledget/shared-features'
import { useAppDispatch, useAppSelector } from '@hooks/store'

const App = () => {
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

  useEffect(() => {
    dispatch(setEnvironment(import.meta.env.VITE_ENVIRONMENT as 'dev' | 'prod'));
  }, []);

  return environment ? <Routes /> : null;
}

const EnrichedApp = () => (
  <Provider store={store}>
    <ScreenProvider>
      <ColorSchemeProvider>
        <ColorSchemedDiv className='full-screen'>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </ColorSchemedDiv>
      </ColorSchemeProvider>
    </ScreenProvider>
  </Provider>
)

export default EnrichedApp;
