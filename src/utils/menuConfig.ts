import { LayoutDashboard, Users, Ticket, Building2, UserCog, FileText, Briefcase, PlusCircle } from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: any;
}

export const MENU_CONFIG: Record<string, MenuItem[]> = {

  ADMIN: [
    { label: "Empresas", path: "/admin/empresas", icon: Building2 },
    { label: "Técnicos", path: "/admin/tecnicos", icon: UserCog },
    { label: "Clientes", path: "/admin/clientes", icon: Users },
    { label: "Chamados", path: "/chamados", icon: Ticket },
  ],

 
  PRESTADORA: [
    { label: "Chamados", path: "/chamados", icon: Ticket },
    { label: "Técnicos", path: "/admin/tecnicos", icon: UserCog },
    { label: "Clientes", path: "/admin/clientes", icon: Users },
    { label: "Empresas", path: "/admin/empresas", icon: Building2 }
  ],


  TECNICO: [
    { label: "Minha Fila", path: "/chamados", icon: Ticket },
  ],

  GESTOR: [
    { label: "Chamados da Equipe", path: "/chamados", icon: Ticket },
    { label: "Meus Funcionários", path: "/cliente/tecnicos", icon: Users },
    { label: "Novo Chamado", path: "/chamados/novo", icon: PlusCircle },
  ],

  CLIENTE: [
    { label: "Meus Chamados", path: "/chamados", icon: Ticket },
    { label: "Abrir Novo", path: "/chamados/novo", icon: FileText },
  ]
};