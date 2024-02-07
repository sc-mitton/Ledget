import React from 'react';
import * as ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import localeData from 'dayjs/plugin/localeData'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import weekYear from 'dayjs/plugin/weekYear'
import { ColorSchemeProvider, useColorScheme } from '@ledget/ui'

dayjs.extend(customParseFormat)
dayjs.extend(advancedFormat)
dayjs.extend(weekday)
dayjs.extend(localeData)
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)

import App from './App';
import store from '@features/store';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)


root.render(
    <Provider store={store}>
        <ColorSchemeProvider>
            <BrowserRouter>
                <React.StrictMode>
                    <App />
                </React.StrictMode>
            </BrowserRouter>
        </ColorSchemeProvider>
    </Provider>
)
