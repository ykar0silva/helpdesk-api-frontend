// src/App.tsx
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/Login/Index"; 
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminTecnicos } from "./pages/AdminTecnicos";
import { AdminClientes } from "./pages/AdminClientes";
import { NovoChamado } from "./pages/NovoChamado";
import { ClienteDashboard } from "./pages/ClienteDashboard";
import { TecnicoDashboard } from "./pages/TecnicoDashboard";
import { DetalhesChamado } from "./pages/DetalhesChamado";
import { AdminCategorias } from "./pages/AdminCategorias";
import { AdminChamados } from "./pages/AdminChamados";
import { AdminTecnicoDetalhes } from "./pages/AdminTecnicoDetalhes";
import { AdminFinanceiroGeral } from "./pages/AdminFinanceiroGeral";

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
        <Route path="/admin/dashboard" element={<AdminChamados />} />
        <Route path="/tecnico/dashboard" element={<TecnicoDashboard />} />
        <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
        <Route path="/admin/tecnicos" element={<AdminTecnicos />} />
        <Route path="/admin/clientes" element={<AdminClientes />} />
        <Route path="/cliente/dashboard" element={<ClienteDashboard />} />
        <Route path="/cliente/novo-chamado" element={<NovoChamado />} />
        <Route path="/tecnico/dashboard" element={<TecnicoDashboard />} />
        <Route path="/chamados/:id" element={<DetalhesChamado />} />
        <Route path="/admin/categorias" element={<AdminCategorias />} />
        <Route path="/admin/pagamentos" element={<AdminFinanceiroGeral />} />
        <Route path="/admin/tecnicos/:tecnicoId" element={<AdminTecnicoDetalhes />} />
      </Route>
    </Routes>
  )
}

export default App