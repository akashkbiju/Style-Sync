import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

class GlobalErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("StyleSync Global Error:", error, errorInfo);
  }
  handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
      }
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()));
      }
    } catch (e) {}
    window.location.reload();
  };
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#09090b', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ maxWidth: '480px', background: '#18181b', padding: '2.5rem', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.1)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#e11d48', marginBottom: '0.75rem' }}>
              StyleSync
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#a1a1aa', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              A cached browser update was detected. Click below to refresh your app to the latest live version.
            </p>
            <button
              onClick={this.handleReset}
              style={{ background: '#e11d48', color: '#fff', border: 'none', padding: '0.75rem 1.75rem', borderRadius: '0.75rem', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.9rem' }}
            >
              Refresh & Load Live App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </React.StrictMode>,
);

// Unregister any stale service workers and purge caches to prevent black screens
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  }).catch(() => {});
}
if ('caches' in window) {
  caches.keys().then((keys) => {
    for (const key of keys) {
      caches.delete(key);
    }
  }).catch(() => {});
}
