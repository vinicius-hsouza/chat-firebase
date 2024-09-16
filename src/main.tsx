import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { PiPProvider } from './contextPIP'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PiPProvider>
      <App />
    </PiPProvider>
  </React.StrictMode>
)
