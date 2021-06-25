import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './services/firebase';
import '../src/assets/styles/auth.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
