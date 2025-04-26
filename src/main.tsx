
import React from 'react'; // Importação explícita do React
import { createRoot } from 'react-dom/client';
import './i18n/config'; // Garantir que o i18n é carregado primeiro
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
