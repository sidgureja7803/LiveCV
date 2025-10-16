import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'

// Disable React.StrictMode in production to prevent double-rendering cycles
// This can help reduce stack size issues during complex component rendering
const AppWithRouter = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Get root element safely
const rootElement = document.getElementById('root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  // Disable StrictMode in production to prevent double-rendering
  // which can lead to stack size issues with complex components
  if (import.meta.env.PROD) {
    root.render(AppWithRouter);
  } else {
    root.render(
      <React.StrictMode>
        {AppWithRouter}
      </React.StrictMode>
    );
  }
}
