import { Link, useNavigate } from "react-router-dom";
import { LogOut, Menu } from "lucide-react";
import { MENU_CONFIG } from "../../utils/menuConfig"; 

export function Navbar() {
  const navigate = useNavigate();

  // 1. LEITURA DO USUÁRIO
  const getUserData = () => {
    const userStr = localStorage.getItem("user"); // Verifique se é 'user' ou 'helpti_user'
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);

    } catch (error) {
      return null;
    }
  };

  const user = getUserData();

  // 2. LOGOUT
  const handleSignOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // 3. DEFINIÇÃO DO PERFIL ATUAL
  // Se o perfil não existir ou for nulo, assume CLIENTE por segurança
  const perfil = user?.perfil || "CLIENTE";
  
  // 4. SELEÇÃO DO MENU DINÂMICO
  // Busca a lista baseada no perfil (ADMIN, PRESTADORA, GESTOR...). 
  // Se não achar a chave, carrega o menu de CLIENTE.
  const menuItensAtuais = MENU_CONFIG[perfil] || MENU_CONFIG["CLIENTE"];

  // Lógica visual do nome da empresa
  const nomeEmpresaDisplay = user?.empresaNome || (perfil === "ADMIN" ? "HelpTI Matriz" : "Minha Empresa");

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LADO ESQUERDO: Logo */}
          <div className="flex items-center gap-4">
            <Link to={menuItensAtuais[0]?.path || "/home"} className="flex items-center gap-2">
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

          {/* CENTRO: Menu Dinâmico */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {/* AQUI É O PULO DO GATO: Renderizamos a lista que veio do Config */}
              {menuItensAtuais.map((item, index) => (
                <Link
                  key={index} // Usei index ou path como chave
                  to={item.path}
                  className="text-slate-300 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
                >
                  {/* Renderiza o ícone que está salvo no objeto de configuração */}
                  <item.icon size={16} />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* LADO DIREITO: Perfil e Sair */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-medium">{user?.nome || "Visitante"}</span>
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