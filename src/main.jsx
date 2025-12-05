import { StrictMode } from 'react';
import './index.css';
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from 'react-hot-toast';
import { createRoot } from 'react-dom/client';
import AuthProvider from './AuthProvider';
import { router } from './routes/Routes';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      {/* Toasts */}
      <ToastContainer position="top-right" autoClose={2000} />
      <Toaster position="top-right" toastOptions={{ duration: 2500 }} />
    </AuthProvider>
  </StrictMode>
);
