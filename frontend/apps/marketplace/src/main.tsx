import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrandProvider } from '../../../shared/src/context/BrandContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrandProvider>
      <App />
    </BrandProvider>
  </React.StrictMode>
);
