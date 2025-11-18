// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login"; 
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminDashboard } from "./pages/AdminDashboard";

// --- Nossas Novas Páginas (temporárias) ---

function TecnicoDashboard() {
    return <h2>PAINEL DO TÉCNICO</h2>;
}
function ClienteDashboard() {
    return <h2>PAINEL DO CLIENTE</h2>;
}
function HomePage() {
    return <h2>Home (Página Principal Protegida)</h2>;
}
// ---
function App() {
  return (
    <Routes>
      {/* A rota de login é pública */}
      <Route path="/" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/tecnico/dashboard" element={<TecnicoDashboard />} />
        <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
      </Route>
    </Routes>
  )
}

export default App