import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; // Import Provider from react-redux
import { ConfigProvider } from './src/contexts/ConfigContext';
import './src/index.scss';
import App from "./src/App"
import reportWebVitals from './src/reportWebVitals';

import store from './src/store';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  <Provider store={store}> {/* Wrap ConfigProvider in Provider */}
    <ConfigProvider>
      <App />
    </ConfigProvider>
  </Provider>
);

reportWebVitals();
