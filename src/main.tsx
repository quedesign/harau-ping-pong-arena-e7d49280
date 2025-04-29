
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App'
import './index.css'
import { Toaster } from '@/components/ui/sonner';
import { initializeTestData } from '@/services/setupTestData';

// Inicializar dados de teste
initializeTestData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  </React.StrictMode>,
)
