import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: { borderRadius: '10px', background: '#1a1a1a', color: '#fff', fontSize: '13px' },
        success: { iconTheme: { primary: '#D5AA5B', secondary: '#fff' } },
      }}
    />
  </React.StrictMode>
);
