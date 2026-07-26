import React from 'react';
import '../src/shared/i18n'; // initialize i18n
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import '@wma/shared-ui'; // load shared styling tokens

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
