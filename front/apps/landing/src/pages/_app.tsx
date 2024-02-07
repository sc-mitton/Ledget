import { AppProps } from 'next/app';
import "../styles/globals.scss";
import Layout from '../components/layout';

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </Layout>
  );
}

export default CustomApp;
