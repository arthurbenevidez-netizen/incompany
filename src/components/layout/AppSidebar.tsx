import { Building2, FileText, Users, BarChart3, Bell, Shield, Home, UserCircle, GitBranch } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { User } from "@/types";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

interface AppSidebarProps {
  currentUser: User;
}

const homeItems = [
  { title: "Home", url: "/", icon: Home },
];

const cadastroItems = [
  { title: "Carteira Comercial", url: "/carteira", icon: Building2 },
  { title: "Análise de Cadastro", url: "/analise", icon: FileText },
  { title: "Recrutamento", url: "/recrutamento", icon: Users },
  { title: "Workflow", url: "/workflows", icon: GitBranch },
];

const clienteItems = [
  { title: "Portal do Cliente", url: "/cliente/demo", icon: UserCircle },
];

const authItems = [
  { title: "Programação de Avisos", url: "/programacao-avisos", icon: Bell },
  { title: "Gestão de Perfis", url: "/gestao-perfis", icon: Shield },
];

export function AppSidebar({ currentUser }: AppSidebarProps) {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary text-primary-foreground font-medium rounded-md" : "hover:bg-muted/50";

  const collapsed = state === 'collapsed';

  const renderGroup = (label: string, items: typeof homeItems) => (
    <SidebarGroup key={label}>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink to={item.url} end className={getNavCls}>
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent>
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SC</span>
            </div>
            {!collapsed && (
              <div>
                <h2 className="font-semibold text-sm">Sistema de Cadastro</h2>
                <p className="text-xs text-muted-foreground">Habilitação em FIDC</p>
              </div>
            )}
          </div>
        </div>

        {renderGroup("Geral", homeItems)}
        {renderGroup("Cadastro de Empresa", cadastroItems)}
        {renderGroup("Simulação", clienteItems)}
        {renderGroup("Administração", authItems)}
      </SidebarContent>
    </Sidebar>
  );
}