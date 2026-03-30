import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, Mail, Phone, FileText, Send, History, Clock, AlertTriangle, RefreshCw, CheckCircle, XCircle, Copy, Check, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Company, EconomicGroup } from "@/types";

// Mock standalone company
const mockCompany: Company = {
  id: "1",
  name: "Tech Solutions LTDA",
  cnpj: "12.345.678/0001-90",
  status: "awaiting_review",
  processType: "cadastro_cedente",
  managerName: "João Silva",
  managerId: "1",
  createdAt: new Date("2024-01-15"),
  updatedAt: new Date("2024-01-20"),
  documentsPending: 3,
  documentsTotal: 9,
  requestedDocuments: [
    "Balanço Atualizado",
    "Balancete Atualizado",
    "Comprovante de Regularidade Fiscal"
  ],
  requestDate: new Date("2024-01-18"),
  requestMessage: "Prezado cliente, solicitamos a complementação dos documentos financeiros para dar continuidade à análise do cadastro. Por favor, encaminhe os documentos atualizados conforme listado."
};

// Mock groups
const mockGroups: EconomicGroup[] = [
  {
    id: "grp-1",
    name: "Grupo Alpha Holdings",
    processType: "cadastro_cedente",
    status: "in_progress",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    companies: [
      {
        id: "2", name: "Indústria ABC S.A.", cnpj: "98.765.432/0001-10",
        status: "pending", processType: "cadastro_cedente",
        managerName: "João Silva", managerId: "1",
        createdAt: new Date("2024-01-10"), updatedAt: new Date("2024-01-18"),
        groupId: "grp-1", documentsPending: 4, documentsTotal: 12,
      },
      {
        id: "6", name: "ABC Logística LTDA", cnpj: "98.765.432/0002-00",
        status: "pending", processType: "cadastro_cedente",
        managerName: "João Silva", managerId: "1",
        createdAt: new Date("2024-01-10"), updatedAt: new Date("2024-01-18"),
        groupId: "grp-1", documentsPending: 2, documentsTotal: 9,
      },
    ],
  },
  {
    id: "grp-2",
    name: "Grupo Beta Participações",
    processType: "risco_sacado",
    status: "approved",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-02-01"),
    approvedAt: new Date("2025-06-15"),
    companies: [
      {
        id: "3", name: "Comércio XYZ LTDA", cnpj: "11.222.333/0001-44",
        status: "approved", processType: "risco_sacado",
        managerName: "Maria Santos", managerId: "2",
        createdAt: new Date("2024-01-05"), updatedAt: new Date("2024-01-22"),
        groupId: "grp-2", documentsPending: 0, documentsTotal: 8,
      },
      {
        id: "7", name: "XYZ Distribuidora LTDA", cnpj: "11.222.333/0002-25",
        status: "approved", processType: "risco_sacado",
        managerName: "Maria Santos", managerId: "2",
        createdAt: new Date("2024-01-05"), updatedAt: new Date("2024-01-22"),
        groupId: "grp-2", documentsPending: 0, documentsTotal: 10,
      },
      {
        id: "8", name: "XYZ Transportes S.A.", cnpj: "11.222.333/0003-06",
        status: "approved", processType: "risco_sacado",
        managerName: "Maria Santos", managerId: "2",
        createdAt: new Date("2024-01-05"), updatedAt: new Date("2024-01-22"),
        groupId: "grp-2", documentsPending: 1, documentsTotal: 9,
      },
    ],
  },
  {
    id: "grp-3",
    name: "Grupo Inovação Tech",
    processType: "atualizacao_cedente",
    status: "in_progress",
    managerName: "Roberto Ferreira",
    managerId: "4",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-02-10"),
    companies: [
      {
        id: "10", name: "Consultoria Delta LTDA", cnpj: "55.666.777/0001-88",
        status: "in_progress", processType: "atualizacao_cedente",
        managerName: "Roberto Ferreira", managerId: "4",
        createdAt: new Date("2024-01-18"), updatedAt: new Date("2024-02-10"),
        groupId: "grp-3", documentsPending: 5, documentsTotal: 11,
      },
      {
        id: "11", name: "Delta Sistemas S.A.", cnpj: "55.666.777/0002-69",
        status: "in_progress", processType: "atualizacao_cedente",
        managerName: "Roberto Ferreira", managerId: "4",
        createdAt: new Date("2024-01-18"), updatedAt: new Date("2024-02-10"),
        groupId: "grp-3", documentsPending: 3, documentsTotal: 9,
      },
    ],
  },
];

const allStandaloneCompanies: Company[] = [mockCompany];

interface Invite {
  id: string;
  email: string;
  sentAt: Date;
  expiresAt: Date;
  status: 'pending' | 'accepted' | 'expired';
}

const initialInvites: Invite[] = [
  {
    id: "inv1",
    email: "contato@techsolutions.com",
    sentAt: new Date("2024-01-18T10:30:00"),
    expiresAt: new Date("2024-01-19T10:30:00"),
    status: "expired",
  },
  {
    id: "inv2",
    email: "financeiro@techsolutions.com",
    sentAt: new Date(Date.now() - 3600000),
    expiresAt: new Date(Date.now() + 82800000),
    status: "pending",
  },
];

const mockHistory = [
  { id: "1", date: new Date("2024-01-20"), action: "Documentos enviados", description: "Cliente enviou 3 documentos para análise", user: "Sistema" },
  { id: "2", date: new Date("2024-01-18"), action: "Solicitação de documentação", description: "Equipe de cadastro solicitou complementação de 3 documentos financeiros", user: "Equipe de Cadastro" },
  { id: "3", date: new Date("2024-01-18"), action: "Convite enviado", description: "Convite por email enviado para contato@techsolutions.com", user: "João Silva" },
  { id: "4", date: new Date("2024-01-15"), action: "Empresa criada", description: "Empresa adicionada à carteira comercial", user: "João Silva" },
];

export default function EmpresaDetalhesPage() {
  const { id } = useParams();

  // Determine if it's a group or standalone company
  const group = mockGroups.find(g => g.id === id);
  const standaloneCompany = !group ? (allStandaloneCompanies.find(c => c.id === id) || mockCompany) : null;

  const isGroup = !!group;

  return isGroup
    ? <GroupDetalhes group={group} />
    : <CompanyDetalhes company={standaloneCompany!} />;
}

function GroupDetalhes({ group }: { group: EconomicGroup }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [emailInvite, setEmailInvite] = useState("");
  const [messageInvite, setMessageInvite] = useState("Olá! Você foi convidado para fazer o cadastro da sua empresa no Sistema de Cadastro. Clique no link abaixo para começar:");
  const [invites, setInvites] = useState<Invite[]>(initialInvites);
  const [inviteSent, setInviteSent] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const company = group.companies[currentIndex];
  const total = group.companies.length;

  const prev = () => setCurrentIndex(i => (i - 1 + total) % total);
  const next = () => setCurrentIndex(i => (i + 1) % total);

  const getInviteStatus = (invite: Invite) => {
    if (invite.status === 'accepted') return 'accepted';
    if (new Date() > invite.expiresAt) return 'expired';
    return 'pending';
  };

  const getInviteStatusBadge = (invite: Invite) => {
    const status = getInviteStatus(invite);
    switch (status) {
      case 'accepted': return <Badge className="bg-success/10 text-success">Aceito</Badge>;
      case 'expired': return <Badge className="bg-destructive/10 text-destructive">Expirado</Badge>;
      case 'pending': return <Badge className="bg-warning/10 text-warning">Pendente</Badge>;
    }
  };

  const handleResendInvite = (invite: Invite) => {
    const now = new Date();
    const newInvite: Invite = { id: `inv-${Date.now()}`, email: invite.email, sentAt: now, expiresAt: new Date(now.getTime() + 86400000), status: 'pending' };
    setInvites(prev => [newInvite, ...prev]);
    toast.success(`Convite reenviado para ${invite.email}`);
  };

  const handleSendInvite = () => {
    if (!emailInvite.trim()) return;
    const now = new Date();
    const newInvite: Invite = { id: `inv-${Date.now()}`, email: emailInvite, sentAt: now, expiresAt: new Date(now.getTime() + 86400000), status: 'pending' };
    setInvites(prev => [newInvite, ...prev]);
    const link = `${window.location.origin}/cliente/${newInvite.id}`;
    setLastInviteLink(link);
    setInviteSent(true);
    setLinkCopied(false);
    toast.success(`Convite enviado para ${emailInvite}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lastInviteLink);
    setLinkCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCloseInviteDialog = () => {
    setInviteSent(false);
    setEmailInvite("");
    setLinkCopied(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovada</Badge>;
      case 'pending': return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'awaiting_review': return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'in_progress': return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Rejeitada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Aggregate doc progress
  const totalDocs = group.companies.reduce((sum, c) => sum + (c.documentsTotal || 0), 0);
  const totalPending = group.companies.reduce((sum, c) => sum + (c.documentsPending || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">{group.name}</h1>
            <Badge variant="secondary">{total} empresa(s)</Badge>
          </div>
          <p className="text-muted-foreground">Detalhes do Grupo Econômico</p>
        </div>
        <Dialog onOpenChange={(open) => { if (!open) handleCloseInviteDialog(); }}>
          <DialogTrigger asChild>
            <Button><Send className="h-4 w-4 mr-2" />Enviar Convite</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Enviar Convite por Email</DialogTitle></DialogHeader>
            {!inviteSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email do destinatário</label>
                  <Input placeholder="contato@empresa.com" value={emailInvite} onChange={(e) => setEmailInvite(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea value={messageInvite} onChange={(e) => setMessageInvite(e.target.value)} rows={4} />
                </div>
                <Button onClick={handleSendInvite} className="w-full"><Send className="h-4 w-4 mr-2" />Enviar Convite</Button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Convite enviado com sucesso!</p>
                  <p className="text-sm text-muted-foreground mt-1">O convite foi enviado para <strong>{emailInvite}</strong> e expira em 24 horas.</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Link do convite</p>
                  <div className="flex items-center gap-2">
                    <Input value={lastInviteLink} readOnly className="text-xs font-mono" />
                    <Button size="sm" variant="outline" onClick={handleCopyLink} className="flex-shrink-0">
                      {linkCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Company Selector Card */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Empresa do Grupo
                </CardTitle>
                {total > 1 && (
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={prev}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground font-medium">{currentIndex + 1} / {total}</span>
                    <Button size="icon" variant="outline" className="h-8 w-8" onClick={next}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
              {/* Dots */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-1.5 pt-2">
                  {group.companies.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 w-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{company.name}</h3>
                  <p className="text-muted-foreground">CNPJ: {company.cnpj}</p>
                </div>
                {getStatusBadge(company.status)}
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">Gerente Responsável</p>
                  <p className="font-medium">{group.managerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo de Processo</p>
                  <p className="font-medium capitalize">{company.processType.replace(/_/g, ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p className="font-medium">{company.createdAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="font-medium">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
              <div className="pt-2">
                <Button className="w-full" asChild>
                  <Link to={`/documentos/${company.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Ver Documentos desta Empresa
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Histórico */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Histórico de Processos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHistory.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${item.action === "Solicitação de documentação" ? "bg-warning" : item.action === "Documentos enviados" ? "bg-success" : "bg-primary"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.action}</h4>
                            {item.action === "Solicitação de documentação" && <AlertTriangle className="h-4 w-4 text-warning" />}
                          </div>
                          <span className="text-sm text-muted-foreground">{item.date.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">Por: {item.user}</p>
                      </div>
                    </div>
                    {index < mockHistory.length - 1 && <Separator className="my-4 ml-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Group-level doc progress */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Progresso do Grupo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{totalDocs - totalPending}/{totalDocs}</div>
                  <p className="text-sm text-muted-foreground">Documentos aprovados (total)</p>
                </div>
                <Separator />
                {group.companies.map(c => {
                  const approved = (c.documentsTotal || 0) - (c.documentsPending || 0);
                  const pct = c.documentsTotal ? Math.round((approved / c.documentsTotal) * 100) : 0;
                  return (
                    <div key={c.id} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="truncate font-medium">{c.name}</span>
                        <span className="text-muted-foreground">{approved}/{c.documentsTotal || 0}</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Convites */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Convites Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invites.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum convite enviado</p>
                ) : (
                  invites.map((invite) => {
                    const status = getInviteStatus(invite);
                    return (
                      <div key={invite.id} className="border rounded-md p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate flex-1">{invite.email}</span>
                          {getInviteStatusBadge(invite)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Enviado em {invite.sentAt.toLocaleDateString('pt-BR')} às {invite.sentAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {status === 'pending' && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Expira em {invite.expiresAt.toLocaleDateString('pt-BR')} às {invite.expiresAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        {status === 'expired' && (
                          <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => handleResendInvite(invite)}>
                            <RefreshCw className="h-3 w-3 mr-1" />Reenviar
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function CompanyDetalhes({ company }: { company: Company }) {
  const [emailInvite, setEmailInvite] = useState("");
  const [messageInvite, setMessageInvite] = useState("Olá! Você foi convidado para fazer o cadastro da sua empresa no Sistema de Cadastro. Clique no link abaixo para começar:");
  const [invites, setInvites] = useState<Invite[]>(initialInvites);
  const [inviteSent, setInviteSent] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const getInviteStatus = (invite: Invite) => {
    if (invite.status === 'accepted') return 'accepted';
    if (new Date() > invite.expiresAt) return 'expired';
    return 'pending';
  };

  const getInviteStatusBadge = (invite: Invite) => {
    const status = getInviteStatus(invite);
    switch (status) {
      case 'accepted': return <Badge className="bg-success/10 text-success">Aceito</Badge>;
      case 'expired': return <Badge className="bg-destructive/10 text-destructive">Expirado</Badge>;
      case 'pending': return <Badge className="bg-warning/10 text-warning">Pendente</Badge>;
    }
  };

  const handleResendInvite = (invite: Invite) => {
    const now = new Date();
    const newInvite: Invite = { id: `inv-${Date.now()}`, email: invite.email, sentAt: now, expiresAt: new Date(now.getTime() + 86400000), status: 'pending' };
    setInvites(prev => [newInvite, ...prev]);
    toast.success(`Convite reenviado para ${invite.email}`);
  };

  const handleSendInvite = () => {
    if (!emailInvite.trim()) return;
    const now = new Date();
    const newInvite: Invite = { id: `inv-${Date.now()}`, email: emailInvite, sentAt: now, expiresAt: new Date(now.getTime() + 86400000), status: 'pending' };
    setInvites(prev => [newInvite, ...prev]);
    const link = `${window.location.origin}/cliente/${newInvite.id}`;
    setLastInviteLink(link);
    setInviteSent(true);
    setLinkCopied(false);
    toast.success(`Convite enviado para ${emailInvite}`);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(lastInviteLink);
    setLinkCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleCloseInviteDialog = () => {
    setInviteSent(false);
    setEmailInvite("");
    setLinkCopied(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovada</Badge>;
      case 'pending': return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'awaiting_review': return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'in_progress': return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Rejeitada</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalhes da Empresa</h1>
          <p className="text-muted-foreground">Informações completas e histórico de processos</p>
        </div>
        <Dialog onOpenChange={(open) => { if (!open) handleCloseInviteDialog(); }}>
          <DialogTrigger asChild>
            <Button><Send className="h-4 w-4 mr-2" />Enviar Convite</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Enviar Convite por Email</DialogTitle></DialogHeader>
            {!inviteSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email do destinatário</label>
                  <Input placeholder="contato@empresa.com" value={emailInvite} onChange={(e) => setEmailInvite(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea value={messageInvite} onChange={(e) => setMessageInvite(e.target.value)} rows={4} />
                </div>
                <Button onClick={handleSendInvite} className="w-full"><Send className="h-4 w-4 mr-2" />Enviar Convite</Button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Convite enviado com sucesso!</p>
                  <p className="text-sm text-muted-foreground mt-1">O convite foi enviado para <strong>{emailInvite}</strong> e expira em 24 horas.</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Link do convite</p>
                  <div className="flex items-center gap-2">
                    <Input value={lastInviteLink} readOnly className="text-xs font-mono" />
                    <Button size="sm" variant="outline" onClick={handleCopyLink} className="flex-shrink-0">
                      {linkCopied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{company.name}</h3>
                <p className="text-muted-foreground">CNPJ: {company.cnpj}</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(company.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gerente Responsável</p>
                  <p className="font-medium">{company.managerName}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p className="font-medium">{company.createdAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="font-medium">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {company.requestedDocuments && company.requestedDocuments.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Clock className="h-5 w-5" />
                  Documentação Solicitada pela Equipe de Análise
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Solicitada em {company.requestDate?.toLocaleDateString('pt-BR')} às {company.requestDate?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {company.requestMessage && (
                  <div>
                    <h4 className="font-medium mb-2">Mensagem da equipe:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{company.requestMessage}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-medium mb-2">Documentos solicitados:</h4>
                  <div className="space-y-2">
                    {company.requestedDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm p-2 bg-warning/5 rounded-md">
                        <FileText className="h-4 w-4 text-warning" />
                        <span>{doc}</span>
                        <Badge variant="outline" className="ml-auto">Pendente</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link to={`/documentos/${company.id}`}><FileText className="h-4 w-4 mr-2" />Enviar Documentos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><History className="h-5 w-5" />Histórico de Processos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockHistory.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${item.action === "Solicitação de documentação" ? "bg-warning" : item.action === "Documentos enviados" ? "bg-success" : "bg-primary"}`} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.action}</h4>
                            {item.action === "Solicitação de documentação" && <AlertTriangle className="h-4 w-4 text-warning" />}
                          </div>
                          <span className="text-sm text-muted-foreground">{item.date.toLocaleDateString('pt-BR')}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">Por: {item.user}</p>
                      </div>
                    </div>
                    {index < mockHistory.length - 1 && <Separator className="my-4 ml-6" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader><CardTitle>Progresso de Documentos</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{(company.documentsTotal || 0) - (company.documentsPending || 0)}/{company.documentsTotal}</div>
                  <p className="text-sm text-muted-foreground">Documentos aprovados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Pendentes</span><span>{company.documentsPending}</span></div>
                  <div className="flex justify-between text-sm"><span>Aprovados</span><span>{(company.documentsTotal || 0) - (company.documentsPending || 0)}</span></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" />Convites Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invites.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Nenhum convite enviado</p>
                ) : (
                  invites.map((invite) => {
                    const status = getInviteStatus(invite);
                    return (
                      <div key={invite.id} className="border rounded-md p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium truncate flex-1">{invite.email}</span>
                          {getInviteStatusBadge(invite)}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>Enviado em {invite.sentAt.toLocaleDateString('pt-BR')} às {invite.sentAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {status === 'pending' && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>Expira em {invite.expiresAt.toLocaleDateString('pt-BR')} às {invite.expiresAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                        {status === 'expired' && (
                          <Button variant="outline" size="sm" className="w-full mt-1" onClick={() => handleResendInvite(invite)}>
                            <RefreshCw className="h-3 w-3 mr-1" />Reenviar
                          </Button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
