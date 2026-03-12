import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import store from '~/store';
import App from './App';

import './styles/index.css';
import './i18n/i18n'; // initialise i18n on startup

// ─── Styled-Components prop filter ────────────────────────────────────────────
// Prevents MUI / Emotion internal props (sx, ownerState, etc.) from being
// forwarded to real DOM nodes through styled-components wrappers.
const shouldForwardProp = (prop: string, target: unknown) => {
    if (typeof target === 'string') {
        const blocked = ['sx', 'css', 'ownerState', 'theme', 'as', 'forwardedAs', 'classes'];
        return !blocked.includes(prop) && isPropValid(prop);
    }
    return true;
};

// ─── Mount ────────────────────────────────────────────────────────────────────
const container = document.getElementById('root');
if (!container) throw new Error('Root container #root not found');

createRoot(container).render(
    <React.StrictMode>
        <Provider store={store}>
            <StyleSheetManager shouldForwardProp={shouldForwardProp}>
                <App />
            </StyleSheetManager>
        </Provider>
    </React.StrictMode>
);
