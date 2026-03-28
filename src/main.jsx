import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { MessagesProvider } from './context/MessagesContext'
import App from './App.jsx'
import 'leaflet/dist/leaflet.css'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MessagesProvider>
          <App />
        </MessagesProvider>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>,
)
