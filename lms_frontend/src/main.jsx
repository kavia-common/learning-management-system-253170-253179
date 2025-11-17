import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

/**
 * PUBLIC_INTERFACE
 * Vite entrypoint: mounts the React app and provides BrowserRouter.
 * Adds an ErrorBoundary and a minimal /__health route to avoid blank screen.
 */

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMessage: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMessage: error?.message || 'Unknown error' };
  }
  componentDidCatch(error, errorInfo) {
    // eslint-disable-next-line no-console
    console.error('[LMS] Uncaught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 16, fontFamily: 'ui-sans-serif, system-ui' }}>
          <div style={{ margin: '8px 0', fontWeight: 600, color: '#111827' }}>
            Something went wrong while loading the app.
          </div>
          <div style={{ color: '#6B7280', fontSize: 14 }}>
            {this.state.errorMessage}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, color: '#6B7280' }}>
            Check the browser console for details. Backend features are disabled until configured.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Minimal health component to ensure non-blank rendering
function Health() {
  return (
    <div style={{ padding: 16 }}>
      <div style={{ fontWeight: 600 }}>Frontend is running</div>
      <div style={{ color: '#6B7280', fontSize: 14 }}>
        This is a lightweight health page. Navigate back to "/" to use the app.
      </div>
    </div>
  );
}

const rootEl = document.getElementById('root');
if (!rootEl) {
  const fallback = document.createElement('div');
  fallback.style.padding = '16px';
  fallback.innerText = 'Root element #root not found in index.html';
  document.body.appendChild(fallback);
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/__health" element={<Health />} />
            <Route path="/*" element={<App />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </React.StrictMode>
  );
}
