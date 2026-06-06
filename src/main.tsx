import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// NOTE: the desktop's main.css is imported inside DesktopShell (lazy), so the
// editorial homepage ships only src/site/editorial.css. Do not re-add it here.

if (import.meta.env.DEV) {
    import('@axe-core/react').then(axe => axe.default(React, ReactDOM, 1000));
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);

// Tear down the pre-React paint splash only after the app has mounted, so the
// real UI is already painted underneath when the overlay is removed (no bare frame).
document.getElementById('static-shell')?.remove();
