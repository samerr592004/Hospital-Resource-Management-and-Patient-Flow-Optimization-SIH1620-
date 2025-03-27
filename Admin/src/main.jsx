import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from "./App";
import AdminContextProvider from './contexts/AdminContext';
import DoctorContextProvider from './contexts/DoctorContext';
import AppContextProvider from './contexts/AppContext';

createRoot(document.getElementById('root')).render(

    <BrowserRouter>
    <AdminContextProvider>
        <DoctorContextProvider>
          <AppContextProvider>
            <App />
          </AppContextProvider>
        </DoctorContextProvider>
      </AdminContextProvider>
      
    </BrowserRouter>

);
