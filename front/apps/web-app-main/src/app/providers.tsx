import { useEffect } from 'react';
import { PersistGate } from 'redux-persist/integration/react';

import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import '@styles/base.scss';
import { ColorSchemeProvider, ScreenProvider } from '@ledget/ui';
import { setEnvironment, selectEnvironment } from '@ledget/shared-features';
import { useAppDispatch, useAppSelector } from '@hooks/store';
import store, { persistor } from '@features/store';

const Providers = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const environment = useAppSelector(selectEnvironment);

  useEffect(() => {
    dispatch(
      setEnvironment({
        name: import.meta.env.VITE_ENVIRONMENT as 'dev' | 'prod',
        apiUrl: import.meta.env.VITE_LEDGET_API_URI,
        platform: 'browser',
      })
    );
  }, []);

  return environment ? (
    <ColorSchemeProvider>
      <ScreenProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </ScreenProvider>
    </ColorSchemeProvider>
  ) : null;
};

export default function ({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Providers>{children}</Providers>
      </PersistGate>
    </Provider>
  );
}
