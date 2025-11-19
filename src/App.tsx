// src/App.tsx
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/Login"; 
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminTecnicos } from "./pages/AdminTecnicos";
import { AdminClientes } from "./pages/AdminClientes";
import { NovoChamado } from "./pages/NovoChamado";
import { ClienteDashboard } from "./pages/ClienteDashboard";
import { TecnicoDashboard } from "./pages/TecnicoDashboard";
import { DetalhesChamado } from "./pages/DetalhesChamado";


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
        <Route path="/admin/tecnicos" element={<AdminTecnicos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
         <Route path="/cliente/novo-chamado" element={<NovoChamado />} />
         <Route path="/tecnico/dashboard" element={<TecnicoDashboard />} />
         <Route path="/chamados/:id" element={<DetalhesChamado />} />
      </Route>
    </Routes>
  )
}

export default App