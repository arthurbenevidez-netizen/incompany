import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import HomePage from "./pages/HomePage";
import CarteiraPage from "./pages/CarteiraPage";
import CadastroPage from "./pages/CadastroPage";
import DocumentosPage from "./pages/DocumentosPage";
import AnalisePage from "./pages/AnalisePage";
import AnaliseEmpresaPage from "./pages/AnaliseEmpresaPage";
import RecrutamentoPage from "./pages/RecrutamentoPage";
import EmpresaDetalhesPage from "./pages/EmpresaDetalhesPage";
import NovaEmpresaPage from "./pages/NovaEmpresaPage";
import NotificacoesPage from "./pages/NotificacoesPage";
import ProgramacaoAvisosPage from "./pages/ProgramacaoAvisosPage";
import GestaoPerfilPage from "./pages/GestaoPerfilPage";
import ClientePortalPage from "./pages/ClientePortalPage";
import WorkflowPage from "./pages/WorkflowPage";
import NotFound from "./pages/NotFound";
import { User } from "@/types";

const queryClient = new QueryClient();

// Mock user - em produção viria de autenticação
const mockUser: User = {
  id: "1",
  name: "João Silva",
  email: "joao.silva@empresa.com.br",
  role: "gerente_comercial", // Mude para "equipe_cadastro" para ver a outra interface
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout currentUser={mockUser}>
              <HomePage />
            </AppLayout>
          } />
          <Route path="/dashboard" element={
            <AppLayout currentUser={mockUser}>
              <HomePage />
            </AppLayout>
          } />
          <Route path="/carteira" element={
            <AppLayout currentUser={mockUser}>
              <CarteiraPage />
            </AppLayout>
          } />
          <Route path="/cadastro" element={
            <AppLayout currentUser={{...mockUser, role: "equipe_cadastro"}}>
              <CadastroPage />
            </AppLayout>
          } />
          <Route path="/documentos/:companyId" element={
            <AppLayout currentUser={mockUser}>
              <DocumentosPage />
            </AppLayout>
          } />
          <Route path="/documentos/grupo/:companyId" element={
            <AppLayout currentUser={mockUser}>
              <DocumentosPage />
            </AppLayout>
          } />
          <Route path="/analise" element={
            <AppLayout currentUser={{...mockUser, role: "equipe_cadastro"}}>
              <AnalisePage />
            </AppLayout>
          } />
          <Route path="/analise/:companyId" element={
            <AppLayout currentUser={{...mockUser, role: "equipe_cadastro"}}>
              <AnaliseEmpresaPage />
            </AppLayout>
          } />
          <Route path="/recrutamento" element={
            <AppLayout currentUser={mockUser}>
              <RecrutamentoPage />
            </AppLayout>
          } />
          <Route path="/empresa/:id" element={
            <AppLayout currentUser={mockUser}>
              <EmpresaDetalhesPage />
            </AppLayout>
          } />
          <Route path="/nova-empresa" element={
            <AppLayout currentUser={mockUser}>
              <NovaEmpresaPage />
            </AppLayout>
          } />
          <Route path="/notificacoes" element={
            <AppLayout currentUser={mockUser}>
              <NotificacoesPage />
            </AppLayout>
          } />
          <Route path="/programacao-avisos" element={
            <AppLayout currentUser={mockUser}>
              <ProgramacaoAvisosPage />
            </AppLayout>
          } />
          <Route path="/gestao-perfis" element={
            <AppLayout currentUser={mockUser}>
              <GestaoPerfilPage />
            </AppLayout>
          } />
          <Route path="/cliente/:token" element={<ClientePortalPage />} />
          <Route path="/workflow/:companyId" element={
            <AppLayout currentUser={mockUser}>
              <WorkflowPage />
            </AppLayout>
          } />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
