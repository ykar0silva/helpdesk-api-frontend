import { Link, useNavigate } from "react-router-dom";
import { 
  LogOut, 
  Menu, 
  LayoutDashboard, 
  Users, 
  Building2, 
  Ticket,
  UserCog
} from "lucide-react";

export function Navbar() {
  const navigate = useNavigate();

  // 1. FUNÇÃO PARA LER OS DADOS DO USUÁRIO (Direto do LocalStorage)
  const getUserData = () => {
    const userStr = localStorage.getItem("user"); // Ou "usuario", verifique como você salvou no Login
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      return null;
    }
  };

  const user = getUserData();

  // 2. FUNÇÃO DE LOGOUT MANUAL
  const handleSignOut = () => {
    localStorage.removeItem("user");  // Remove dados do usuário
    localStorage.removeItem("token"); // Remove o token
    navigate("/"); // Redireciona para o login
  };

  // 3. DEFINIÇÃO DO PERFIL E NOME DA EMPRESA
  const perfil = user?.perfil || "CLIENTE"; 
  
  // Lógica de exibição do nome da empresa
  const nomeEmpresaDisplay = user?.empresaNome || (perfil === "ADMIN" ? "HelpTI Matriz" : "Minha Empresa");

  // 4. CONFIGURAÇÃO DOS MENUS
  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      roles: ["ADMIN", "GESTOR", "TECNICO"]
    },
    {
      label: "Chamados",
      path: "/chamados",
      icon: Ticket,
      roles: ["ADMIN", "GESTOR", "TECNICO", "CLIENTE"]
    },
    {
      label: "Técnicos",
      path: "/tecnicos",
      icon: UserCog,
      roles: ["ADMIN", "GESTOR"]
    },
    {
      label: "Clientes",
      path: "/clientes",
      icon: Users,
      roles: ["ADMIN", "GESTOR"]
    },
    {
      label: "Empresas",
      path: "/empresas",
      icon: Building2,
      roles: ["ADMIN"]
    }
  ];

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LADO ESQUERDO: Logo e Nome da Empresa */}
          <div className="flex items-center gap-4">
            <Link to="/home" className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Menu size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight">HelpDesk TI</span>
                <span className="text-[10px] text-blue-300 uppercase tracking-wider">
                  {nomeEmpresaDisplay}
                </span>
              </div>
            </Link>
          </div>

          {/* CENTRO: Links de Navegação */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                // Filtra o menu baseado no perfil salvo no localStorage
                if (item.roles.includes(perfil)) {
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className="text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                }
                return null;
              })}
            </div>
          </div>

          {/* LADO DIREITO: Perfil e Logout */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user?.nome || "Usuário"}</span>
              <span className="text-xs text-slate-400">{perfil}</span>
            </div>
            
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              title="Sair do sistema"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}