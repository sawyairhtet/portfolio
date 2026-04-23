import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { DeviceProvider } from './context/DeviceContext';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { WindowManagerProvider } from './context/WindowManagerContext';
import { NotificationProvider } from './context/NotificationContext';
import { DesktopShell } from './components/shell/DesktopShell';
import { DeepLinkHandler } from './components/shell/DeepLinkHandler';

function App() {
    return (
        <BrowserRouter>
            <QueryClientProvider client={queryClient}>
                <DeviceProvider>
                    <ThemeProvider>
                        <SoundProvider>
                            <WindowManagerProvider>
                                <NotificationProvider>
                                    <Routes>
                                        <Route path="/" element={<DesktopShell />} />
                                        <Route path="/app/:appId" element={<DeepLinkHandler />} />
                                        <Route path="*" element={<DesktopShell />} />
                                    </Routes>
                                </NotificationProvider>
                            </WindowManagerProvider>
                        </SoundProvider>
                    </ThemeProvider>
                </DeviceProvider>
            </QueryClientProvider>
        </BrowserRouter>
    );
}

export default App;
