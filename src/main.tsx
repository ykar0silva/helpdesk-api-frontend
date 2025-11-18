// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from "react-router-dom"; // <-- IMPORTE

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- ADICIONE */}
      <App />
    </BrowserRouter> {/* <-- ADICIONE */}
  </React.StrictMode>,
)