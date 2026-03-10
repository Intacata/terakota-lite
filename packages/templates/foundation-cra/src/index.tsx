import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import store from './store';
import App from './App';
import './styles/index.css';

// Filter MUI/Emotion props from styled-components DOM nodes
const shouldForwardProp = (prop: string, target: any) => {
    if (typeof target === 'string') {
        return !['sx', 'css', 'ownerState', 'theme', 'as', 'forwardedAs', 'classes'].includes(prop);
    }
    return true;
};

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
