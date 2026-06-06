import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Home } from './site/Home';

// The writing feed is the front door (eager). The portfolio moved to /work, and
// the interactive desktop simulation is a showcased artifact at /desktop — both
// lazy-loaded so the homepage feed ships lean (no react-hook-form/zod, no
// desktop bundle, no react-markdown).
const WorkPage = lazy(() => import('./site/WorkPage').then(m => ({ default: m.WorkPage })));
const NotFound = lazy(() => import('./site/NotFound').then(m => ({ default: m.NotFound })));
const DesktopShell = lazy(() =>
    import('./components/shell/DesktopShell').then(m => ({ default: m.DesktopShell }))
);
const DeepLinkHandler = lazy(() =>
    import('./components/shell/DeepLinkHandler').then(m => ({ default: m.DeepLinkHandler }))
);

// Posts render at clean root slugs (/<slug>). BlogPost carries react-markdown, so
// it stays lazy to keep that weight off the homepage bundle.
const BlogPost = lazy(() => import('./site/BlogPost').then(m => ({ default: m.BlogPost })));

// Legacy /blog/:slug → /:slug, preserving the slug (paired with a netlify 301 for
// direct hits). The old /blog index redirects to the feed at /.
function BlogRedirect() {
    const { slug } = useParams<{ slug: string }>();
    return <Navigate to={`/${slug ?? ''}`} replace />;
}

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
                                                {/* Explicit routes first, then the
                                                    dynamic post slug, then the 404. */}
                                                <Route path="/" element={<Home />} />
                                                <Route path="/work" element={<WorkPage />} />
                                                <Route
                                                    path="/desktop"
                                                    element={<DesktopShell />}
                                                />
                                                <Route
                                                    path="/app/:appId"
                                                    element={<DeepLinkHandler />}
                                                />
                                                <Route
                                                    path="/blog"
                                                    element={<Navigate to="/" replace />}
                                                />
                                                <Route
                                                    path="/blog/:slug"
                                                    element={<BlogRedirect />}
                                                />
                                                <Route path="/:slug" element={<BlogPost />} />
                                                <Route path="*" element={<NotFound />} />
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
