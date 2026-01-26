import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { CartProvider } from './context/CartContext'
import { initializeTracker } from './lib/tracker'

// Initialize tracker before rendering
initializeTracker()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
