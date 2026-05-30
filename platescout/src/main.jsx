import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './components/App/App.jsx';
import './assets/reset.css';
import './index.css';

import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
        <App />
        <Toaster position = "top-right" />
    </BrowserRouter>
  </StrictMode>
)
