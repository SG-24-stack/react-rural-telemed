// Fix for 'global is not defined' error caused by simple-peer
window.global = window;

import React from 'react'
import ReactDOM from 'react-dom/client'
// Removed the .jsx extension here to let the bundler resolve it automatically
import App from './App' 
import './index.css'

// Importing the Context Providers
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { OfflineSyncProvider } from './context/OfflineSyncContext'
import { ThemeProvider } from './context/ThemeContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <OfflineSyncProvider>
            <App />
          </OfflineSyncProvider>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)