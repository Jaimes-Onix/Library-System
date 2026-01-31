
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import * as pdfjsLib from 'pdfjs-dist';

// --- System Resilience Shims ---
try {
  if (typeof window !== 'undefined' && pdfjsLib) {
    // Standardize worker source to the exact esm.sh version for consistency
    const PDFJS_VERSION = '4.4.168';
    // Using esm.sh build path for the worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://esm.sh/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.mjs`;
  }
} catch (e) {
  console.error("PDF.js worker initialization warning:", e);
}

// Global error handler to provide feedback instead of a blank screen
window.onerror = (message, source, lineno, colno, error) => {
  console.error("CRITICAL_BOOT_FAILURE:", { message, source, lineno, error });
  const root = document.getElementById('root');
  if (root && root.innerHTML.trim() === "") {
    root.innerHTML = `
      <div style="height: 100vh; display: flex; align-items: center; justify-content: center; background: #FFFFFF; font-family: system-ui, -apple-system; padding: 40px; text-align: center; color: #1d1d1f;">
        <div style="max-width: 480px; margin: auto;">
          <h1 style="font-weight: 900; font-size: 32px; letter-spacing: -0.04em; margin-bottom: 24px;">Interface Error</h1>
          <p style="color: #86868b; font-size: 17px; margin-bottom: 32px; line-height: 1.5; font-weight: 500;">
            The application encountered a runtime exception during boot.
          </p>
          <div style="background: #f5f5f7; padding: 24px; border-radius: 20px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; font-size: 13px; text-align: left; margin-bottom: 32px; color: #ff3b30; overflow: auto; max-height: 200px; border: 1px solid rgba(0,0,0,0.05);">
            <div style="font-weight: bold; margin-bottom: 8px;">Stack Trace:</div>
            ${message}<br/>
            ${error?.stack || 'No stack trace available'}
          </div>
          <button onclick="window.location.reload()" style="background: #000; color: #fff; border: none; padding: 18px 36px; border-radius: 18px; font-weight: 700; cursor: pointer; font-size: 15px; transition: all 0.2s;">Restart System</button>
        </div>
      </div>
    `;
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  // Removed StrictMode to prevent double-initialization bugs with react-pageflip
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
