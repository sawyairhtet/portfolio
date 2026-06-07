import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { WorkPage } from './site/WorkPage';

// The portfolio is the front door (eager) at /. The writing feed moved to
// /writing, and the interactive desktop simulation is a showcased artifact at
// /desktop — both lazy-loaded so the front door ships lean. WorkPage's Contact
// form is itself lazy (see WorkPage.tsx) so react-hook-form/zod stay off the
// initial bundle; react-markdown rides with BlogPost, the desktop bundle stays
// on /desktop.
const Home = lazy(() => import('./site/Home').then(m => ({ default: m.Home })));
const NotFound = lazy(() => import('./site/NotFound').then(m => ({ default: m.NotFound })));
const DesktopShell = lazy(() =>
    import('./components/shell/DesktopShell').then(m => ({ default: m.DesktopShell }))
);
const DeepLinkHandler = lazy(() =>
    import('./components/shell/DeepLinkHandler').then(m => ({ default: m.DeepLinkHandler }))
);

// Posts render at clean root slugs (/<slug>). BlogPost carries react-markdown, so
// it stays lazy to keep that weight off the front-door bundle.
const BlogPost = lazy(() => import('./site/BlogPost').then(m => ({ default: m.BlogPost })));

// Legacy /blog/:slug → /:slug, preserving the slug (paired with a netlify 301 for
// direct hits). The old /blog index redirects to the writing feed at /writing.
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
                                                <Route path="/" element={<WorkPage />} />
                                                <Route path="/writing" element={<Home />} />
                                                <Route
                                                    path="/work"
                                                    element={<Navigate to="/" replace />}
                                                />
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
                                                    element={<Navigate to="/writing" replace />}
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
