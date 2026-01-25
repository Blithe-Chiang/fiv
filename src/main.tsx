import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastProvider } from './components/common/Toast';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <ToastProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </ToastProvider>
  </ErrorBoundary>,
);
