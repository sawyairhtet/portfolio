import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EditorialSite } from './site/EditorialSite';

// The interactive desktop simulation is now a showcased artifact at /desktop,
// not the front door. Lazy-load it so the editorial homepage ships lean.
const DesktopShell = lazy(() =>
    import('./components/shell/DesktopShell').then(m => ({ default: m.DesktopShell }))
);
const DeepLinkHandler = lazy(() =>
    import('./components/shell/DeepLinkHandler').then(m => ({ default: m.DeepLinkHandler }))
);

// Blog pages live inside the editorial chrome. BlogPost carries react-markdown,
// so both are lazy-loaded to keep that weight off the homepage bundle.
const Blog = lazy(() => import('./site/Blog').then(m => ({ default: m.Blog })));
const BlogPost = lazy(() => import('./site/BlogPost').then(m => ({ default: m.BlogPost })));

function App() {
    return (
        <ErrorBoundary level="app">
            <BrowserRouter>
                <DeviceProvider>
                    <ThemeProvider>
                        <PreferencesProvider>
                            <SoundProvider>
                                <WindowManagerProvider>
                                    <NotificationProvider>
                                        <Suspense fallback={null}>
                                            <Routes>
                                                <Route path="/" element={<EditorialSite />} />
                                                <Route path="/blog" element={<Blog />} />
                                                <Route
                                                    path="/blog/:slug"
                                                    element={<BlogPost />}
                                                />
                                                <Route
                                                    path="/desktop"
                                                    element={<DesktopShell />}
                                                />
                                                <Route
                                                    path="/app/:appId"
                                                    element={<DeepLinkHandler />}
                                                />
                                                <Route path="*" element={<EditorialSite />} />
                                            </Routes>
                                        </Suspense>
                                    </NotificationProvider>
                                </WindowManagerProvider>
                            </SoundProvider>
                        </PreferencesProvider>
                    </ThemeProvider>
                </DeviceProvider>
            </BrowserRouter>
        </ErrorBoundary>
    );
}

export default App;
