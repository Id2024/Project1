import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="503690152414-kshr5g1r1r6qr59f7okm0o590957s9ri.apps.googleusercontent.com">
    <AuthContextProvider>
    <App />
    </AuthContextProvider>
    </GoogleOAuthProvider> 
  </React.StrictMode>,
)
