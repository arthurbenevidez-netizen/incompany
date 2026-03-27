import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, Calendar, Mail, Phone, FileText, Send, History, Clock, AlertTriangle, RefreshCw, CheckCircle, XCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Company } from "@/types";

// Mock data
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
    sentAt: new Date(Date.now() - 3600000), // 1h ago
    expiresAt: new Date(Date.now() + 82800000), // 23h from now
    status: "pending",
  },
];

const mockHistory = [
  {
    id: "1",
    date: new Date("2024-01-20"),
    action: "Documentos enviados",
    description: "Cliente enviou 3 documentos para análise",
    user: "Sistema"
  },
  {
    id: "2", 
    date: new Date("2024-01-18"),
    action: "Solicitação de documentação",
    description: "Equipe de cadastro solicitou complementação de 3 documentos financeiros",
    user: "Equipe de Cadastro"
  },
  {
    id: "3",
    date: new Date("2024-01-18"),
    action: "Convite enviado",
    description: "Convite por email enviado para contato@techsolutions.com",
    user: "João Silva"
  },
  {
    id: "4",
    date: new Date("2024-01-15"),
    action: "Empresa criada",
    description: "Empresa adicionada à carteira comercial",
    user: "João Silva"
  },
];

export default function EmpresaDetalhesPage() {
  const { id } = useParams();
  const [emailInvite, setEmailInvite] = useState("");
  const [messageInvite, setMessageInvite] = useState("Olá! Você foi convidado para fazer o cadastro da sua empresa no sistema M7 Cadastro. Clique no link abaixo para começar:");
  const [invites, setInvites] = useState<Invite[]>(initialInvites);

  const getInviteStatus = (invite: Invite) => {
    if (invite.status === 'accepted') return 'accepted';
    if (new Date() > invite.expiresAt) return 'expired';
    return 'pending';
  };

  const getInviteStatusBadge = (invite: Invite) => {
    const status = getInviteStatus(invite);
    switch (status) {
      case 'accepted':
        return <Badge className="bg-success/10 text-success">Aceito</Badge>;
      case 'expired':
        return <Badge className="bg-destructive/10 text-destructive">Expirado</Badge>;
      case 'pending':
        return <Badge className="bg-warning/10 text-warning">Pendente</Badge>;
    }
  };

  const handleResendInvite = (invite: Invite) => {
    const now = new Date();
    const newInvite: Invite = {
      id: `inv-${Date.now()}`,
      email: invite.email,
      sentAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      status: 'pending',
    };
    setInvites(prev => [newInvite, ...prev]);
    toast.success(`Convite reenviado para ${invite.email}`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'awaiting_review':
        return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const [inviteSent, setInviteSent] = useState(false);
  const [lastInviteLink, setLastInviteLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  const handleSendInvite = () => {
    if (!emailInvite.trim()) return;
    const now = new Date();
    const newInvite: Invite = {
      id: `inv-${Date.now()}`,
      email: emailInvite,
      sentAt: now,
      expiresAt: new Date(now.getTime() + 24 * 60 * 60 * 1000),
      status: 'pending',
    };
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Detalhes da Empresa</h1>
          <p className="text-muted-foreground">Informações completas e histórico de processos</p>
        </div>
        <Dialog onOpenChange={(open) => { if (!open) handleCloseInviteDialog(); }}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Enviar Convite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enviar Convite por Email</DialogTitle>
            </DialogHeader>
            {!inviteSent ? (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Email do destinatário</label>
                  <Input
                    placeholder="contato@empresa.com"
                    value={emailInvite}
                    onChange={(e) => setEmailInvite(e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Mensagem</label>
                  <Textarea
                    value={messageInvite}
                    onChange={(e) => setMessageInvite(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleSendInvite} className="w-full">
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Convite
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                  <CheckCircle className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Convite enviado com sucesso!</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    O convite foi enviado para <strong>{emailInvite}</strong> e expira em 24 horas.
                  </p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-2">Link do convite</p>
                  <div className="flex items-center gap-2">
                    <Input value={lastInviteLink} readOnly className="text-xs font-mono" />
                    <Button size="sm" variant="outline" onClick={handleCopyLink} className="flex-shrink-0">
                      {linkCopied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      {/* Company Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informações da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">{mockCompany.name}</h3>
                <p className="text-muted-foreground">CNPJ: {mockCompany.cnpj}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(mockCompany.status)}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gerente Responsável</p>
                  <p className="font-medium">{mockCompany.managerName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground">Data de Criação</p>
                  <p className="font-medium">{mockCompany.createdAt.toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Última Atualização</p>
                  <p className="font-medium">{mockCompany.updatedAt.toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Documentação Solicitada - só mostra se houver */}
          {mockCompany.requestedDocuments && mockCompany.requestedDocuments.length > 0 && (
            <Card className="shadow-card border-warning">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning">
                  <Clock className="h-5 w-5" />
                  Documentação Solicitada pela Equipe de Análise
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Solicitada em {mockCompany.requestDate?.toLocaleDateString('pt-BR')} às {mockCompany.requestDate?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCompany.requestMessage && (
                  <div>
                    <h4 className="font-medium mb-2">Mensagem da equipe:</h4>
                    <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      {mockCompany.requestMessage}
                    </p>
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Documentos solicitados:</h4>
                  <div className="space-y-2">
                    {mockCompany.requestedDocuments.map((doc, index) => (
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
                    <Link to={`/documentos/${mockCompany.id}`}>
                      <FileText className="h-4 w-4 mr-2" />
                      Enviar Documentos
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

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
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        item.action === "Solicitação de documentação" 
                          ? "bg-warning" 
                          : item.action === "Documentos enviados"
                          ? "bg-success"
                          : "bg-primary"
                      }`}></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{item.action}</h4>
                            {item.action === "Solicitação de documentação" && (
                              <AlertTriangle className="h-4 w-4 text-warning" />
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {item.date.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        <p className="text-xs text-muted-foreground">Por: {item.user}</p>
                      </div>
                    </div>
                    {index < mockHistory.length - 1 && (
                      <Separator className="my-4 ml-6" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Progresso de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">
                    {mockCompany.documentsTotal! - mockCompany.documentsPending!}/{mockCompany.documentsTotal}
                  </div>
                  <p className="text-sm text-muted-foreground">Documentos aprovados</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Pendentes</span>
                    <span>{mockCompany.documentsPending}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Aprovados</span>
                    <span>{mockCompany.documentsTotal! - mockCompany.documentsPending!}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Histórico de Convites */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Convites Enviados
              </CardTitle>
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
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full mt-1"
                                  onClick={() => handleResendInvite(invite)}
                                >
                                  <RefreshCw className="h-3 w-3 mr-1" />
                                  Reenviar
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Envia um novo convite com validade de 24h</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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