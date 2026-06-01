import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { PreferencesProvider } from './context/PreferencesContext';
import { DesktopShell } from './components/shell/DesktopShell';
import { DeepLinkHandler } from './components/shell/DeepLinkHandler';
import { ErrorBoundary } from './components/ErrorBoundary';

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
                                        <Routes>
                                            <Route path="/" element={<DesktopShell />} />
                                            <Route
                                                path="/app/:appId"
                                                element={<DeepLinkHandler />}
                                            />
                                            <Route path="*" element={<DesktopShell />} />
                                        </Routes>
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
