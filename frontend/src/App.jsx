import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './components/common/ToastContainer';
import AlertDetailsModal from './components/alerts/AlertDetailsModal';
import { selectTheme } from './features/settings/settingsSlice';

export default function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  return (
    <BrowserRouter>
      <ToastProvider>
        <AppRoutes />
        <AlertDetailsModal />
      </ToastProvider>
    </BrowserRouter>
  );
}
