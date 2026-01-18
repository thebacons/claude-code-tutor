import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Note: StrictMode removed to prevent double terminal mounting
// In production, this won't be an issue since StrictMode only affects development
createRoot(document.getElementById('root')).render(
  <App />
)
