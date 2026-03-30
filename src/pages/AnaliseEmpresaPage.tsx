import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle, AlertTriangle, Calendar, User, FileText, Clock, Check, X, Eye, Users, ChevronLeft, ChevronRight, XCircle } from "lucide-react";
import { getProcessTypeIconComponent } from "@/utils/processTypeUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Company, DocumentCategory, DocumentWithFiles } from "@/types";
import { documentCategories, getProcessTypeLabel } from "@/data/documentCategories";
import DocumentViewModal from "@/components/DocumentViewModal";

interface GroupMember {
  id: string;
  name: string;
  cnpj: string;
  status: 'pending' | 'approved' | 'rejected' | 'in_progress' | 'awaiting_review';
  documentsPending: number;
  documentsTotal: number;
}

interface AnaliseGroup {
  id: string;
  name: string;
  cnpj: string;
  processType: string;
  managerName: string;
  managerId: string;
  createdAt: Date;
  updatedAt: Date;
  status: string;
  members: GroupMember[];
}

const mockGroups: AnaliseGroup[] = [
  {
    id: "grp-2",
    name: "Grupo Beta Participações",
    cnpj: "55.666.777/0001-88",
    processType: "cadastro_cedente",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-28"),
    status: "in_progress",
    members: [
      { id: "grp2-emp1", name: "Beta Logística S.A.", cnpj: "55.666.777/0001-88", status: "approved", documentsPending: 0, documentsTotal: 8 },
      { id: "grp2-emp2", name: "Beta Transportes Ltda", cnpj: "55.666.778/0001-69", status: "awaiting_review", documentsPending: 1, documentsTotal: 8 },
      { id: "grp2-emp3", name: "Beta Armazéns S.A.", cnpj: "55.666.779/0001-40", status: "in_progress", documentsPending: 3, documentsTotal: 8 },
    ],
  },
];

const mockCompanies: Company[] = [
  {
    id: "1", name: "Tech Solutions LTDA", cnpj: "12.345.678/0001-90",
    status: "awaiting_review", processType: "cadastro_cedente",
    managerName: "João Silva", managerId: "1",
    createdAt: new Date("2024-01-15"), updatedAt: new Date("2024-01-20"),
    documentsPending: 3, documentsTotal: 8,
  },
  {
    id: "2", name: "Indústria ABC S.A.", cnpj: "98.765.432/0001-10",
    status: "pending", processType: "risco_sacado",
    managerName: "Maria Santos", managerId: "2",
    createdAt: new Date("2024-01-10"), updatedAt: new Date("2024-01-18"),
    documentsPending: 5, documentsTotal: 10,
  },
  {
    id: "3", name: "Comércio XYZ LTDA", cnpj: "11.222.333/0001-44",
    status: "awaiting_review", processType: "atualizacao_cedente",
    managerName: "Pedro Costa", managerId: "3",
    createdAt: new Date("2024-01-05"), updatedAt: new Date("2024-01-22"),
    documentsPending: 2, documentsTotal: 6,
  },
  {
    id: "4", name: "Startup Rápida LTDA", cnpj: "44.555.666/0001-77",
    status: "approved", processType: "cadastro_cedente",
    managerName: "Ana Paula", managerId: "4",
    createdAt: new Date("2023-12-10"), updatedAt: new Date("2024-02-01"),
    documentsPending: 0, documentsTotal: 8,
  },
  {
    id: "5", name: "Logística Sul S.A.", cnpj: "55.666.777/0001-88",
    status: "pending", processType: "cadastro_sacado",
    managerName: "Carlos Lima", managerId: "5",
    createdAt: new Date("2024-01-03"), updatedAt: new Date("2024-01-15"),
    documentsPending: 4, documentsTotal: 4,
  },
  {
    id: "6", name: "Distribuidora Norte LTDA", cnpj: "66.777.888/0001-99",
    status: "rejected", processType: "cadastro_cedente",
    managerName: "João Silva", managerId: "1",
    createdAt: new Date("2024-01-08"), updatedAt: new Date("2024-02-15"),
    documentsPending: 0, documentsTotal: 8,
  },
];

const mockDocumentsByCompany: Record<string, DocumentWithFiles[]> = {
  "1": [
    { id: "1", companyId: "1", name: "Balanço e DRE 2022", type: "financeira", category: "Balanço e DRE 2022", status: "approved", files: [{ id: "f1", fileName: "balanco_dre_2022.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-15") }], reviewedAt: new Date("2024-01-16"), reviewerId: "admin1" },
    { id: "2", companyId: "1", name: "Contrato Social + Última Alteração", type: "empresa", category: "Contrato Social + Última Alteração", status: "pending", files: [{ id: "f2", fileName: "contrato_social_completo.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-15") }] },
    { id: "3", companyId: "1", name: "RG/CPF ou CNH", type: "socios", category: "RG/CPF ou CNH", status: "needs_replacement", files: [{ id: "f3", fileName: "cpf_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-14") }, { id: "f4", fileName: "cpf_socio2.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") }], reviewedAt: new Date("2024-01-16"), reviewerNotes: "Favor enviar documento mais legível do sócio 1.", reviewerId: "admin1" },
    { id: "4", companyId: "1", name: "Balanço e DRE 2023", type: "financeira", category: "Balanço e DRE 2023", status: "approved", files: [{ id: "f6", fileName: "balanco_dre_2023.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-16") }], reviewedAt: new Date("2024-01-17"), reviewerId: "admin1" },
    { id: "5", companyId: "1", name: "Comprovante de Endereço", type: "socios", category: "Comprovante de Endereço", status: "pending", files: [{ id: "f7", fileName: "comprovante_endereco_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") }] },
  ],
  "grp2-emp1": [
    { id: "g1", companyId: "grp2-emp1", name: "Contrato Social + Última Alteração", type: "empresa", category: "Contrato Social + Última Alteração", status: "approved", files: [{ id: "gf1", fileName: "contrato_social_beta_log.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-12") }], reviewedAt: new Date("2024-01-14"), reviewerId: "admin1" },
    { id: "g2", companyId: "grp2-emp1", name: "Balanço e DRE 2022", type: "financeira", category: "Balanço e DRE 2022", status: "approved", files: [{ id: "gf2", fileName: "balanco_2022_beta_log.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-12") }], reviewedAt: new Date("2024-01-15"), reviewerId: "admin1" },
    { id: "g3", companyId: "grp2-emp1", name: "Balanço e DRE 2023", type: "financeira", category: "Balanço e DRE 2023", status: "approved", files: [{ id: "gf3", fileName: "balanco_2023_beta_log.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-13") }], reviewedAt: new Date("2024-01-15"), reviewerId: "admin1" },
    { id: "g4", companyId: "grp2-emp1", name: "RG/CPF ou CNH", type: "socios", category: "RG/CPF ou CNH", status: "approved", files: [{ id: "gf4", fileName: "docs_socios_beta_log.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-12") }], reviewedAt: new Date("2024-01-14"), reviewerId: "admin1" },
  ],
  "grp2-emp2": [
    { id: "g5", companyId: "grp2-emp2", name: "Contrato Social + Última Alteração", type: "empresa", category: "Contrato Social + Última Alteração", status: "approved", files: [{ id: "gf5", fileName: "contrato_social_beta_transp.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-14") }], reviewedAt: new Date("2024-01-16"), reviewerId: "admin1" },
    { id: "g6", companyId: "grp2-emp2", name: "Balanço e DRE 2022", type: "financeira", category: "Balanço e DRE 2022", status: "pending", files: [{ id: "gf6", fileName: "balanco_2022_beta_transp.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-15") }] },
    { id: "g7", companyId: "grp2-emp2", name: "RG/CPF ou CNH", type: "socios", category: "RG/CPF ou CNH", status: "needs_replacement", files: [{ id: "gf7", fileName: "docs_socios_beta_transp.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-14") }], reviewedAt: new Date("2024-01-17"), reviewerNotes: "Documento do sócio 2 ilegível, favor reenviar.", reviewerId: "admin1" },
  ],
  "grp2-emp3": [
    { id: "g8", companyId: "grp2-emp3", name: "Contrato Social + Última Alteração", type: "empresa", category: "Contrato Social + Última Alteração", status: "pending", files: [{ id: "gf8", fileName: "contrato_social_beta_armaz.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") }] },
    { id: "g9", companyId: "grp2-emp3", name: "Balanço e DRE 2023", type: "financeira", category: "Balanço e DRE 2023", status: "pending", files: [{ id: "gf9", fileName: "balanco_2023_beta_armaz.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-20") }] },
  ],
};

export default function AnaliseEmpresaPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [activeTab, setActiveTab] = useState("empresa");
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [rejectionConfirmed, setRejectionConfirmed] = useState(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);

  // Check if this is a group
  const group = mockGroups.find(g => g.id === companyId);

  if (group) {
    return <GroupAnaliseView group={group} />;
  }

  const company = mockCompanies.find(c => c.id === companyId);

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analise"><ArrowLeft className="h-4 w-4 mr-2" />Voltar para Análise</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Empresa não encontrada</h3>
            <p className="text-muted-foreground">A empresa solicitada não foi encontrada no sistema.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const documents = mockDocumentsByCompany[company.id] || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Reprovado</Badge>;
      case 'awaiting_review': return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'pending': return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      default: return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
    }
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-success" />;
      case 'rejected': return <X className="h-4 w-4 text-destructive" />;
      case 'needs_replacement': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'needs_replacement': return <Badge className="bg-warning-light text-warning">Requer Substituição</Badge>;
      default: return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
    }
  };

  const getProcessTypeName = (type: string) => getProcessTypeLabel(type);
  const getProcessIcon = (processType: string) => getProcessTypeIconComponent(processType, "md");

  const handleReprovar = () => {
    console.log("Reprovando:", company.id, reviewNotes);
    setRejectionConfirmed(true);
  };
  const handleAprovar = () => {
    console.log("Aprovando:", company.id, approvalNotes);
    setApprovalConfirmed(true);
  };

  const getDocumentsByType = (type: string) => documentCategories.filter(cat => cat.type === type && cat.processType === company.processType);
  const getUploadedDocument = (categoryName: string) => documents.find(doc => doc.category === categoryName && doc.companyId === company.id);

  const calculateProgress = () => {
    const relevantCategories = documentCategories.filter(cat => cat.processType === company.processType);
    const totalRequired = relevantCategories.filter(cat => cat.obligation === 'obrigatorio').length;
    const approvedRequired = documents.filter(doc =>
      doc.companyId === company.id && doc.status === 'approved' &&
      relevantCategories.find(cat => cat.name === doc.category)?.obligation === 'obrigatorio'
    ).length;
    return totalRequired > 0 ? Math.round((approvedRequired / totalRequired) * 100) : 0;
  };

  const docTabs = [
    { value: "empresa", label: "Empresa", type: "empresa" },
    { value: "socios", label: "Sócios", type: "socios" },
    { value: "financeira", label: "Financeira", type: "financeira" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analise"><ArrowLeft className="h-4 w-4 mr-2" />Voltar para Análise</Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Análise de Cadastro</h1>
            <p className="text-muted-foreground">Detalhes do processo de análise</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Reprovação */}
          <Dialog open={rejectionOpen} onOpenChange={(o) => { setRejectionOpen(o); if (!o) setRejectionConfirmed(false); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive" onClick={() => { setReviewNotes(""); setRejectionConfirmed(false); }}>
                <AlertTriangle className="h-4 w-4 mr-2" />Reprovar
              </Button>
            </DialogTrigger>
            <DialogContent>
              {rejectionConfirmed ? (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">Cadastro Reprovado</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    O cadastro de <strong>{company.name}</strong> foi reprovado. A decisão e o motivo foram registrados no workflow.
                  </p>
                  {reviewNotes && (
                    <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
                      <p className="text-xs text-muted-foreground mb-1">Motivo registrado:</p>
                      <p className="text-sm">{reviewNotes}</p>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => { setRejectionOpen(false); navigate("/analise"); }} className="mt-4">
                    Retomar a Análise
                  </Button>
                </div>
              ) : (
                <>
                  <DialogHeader><DialogTitle>Reprovar Cadastro</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Empresa:</p>
                      <p className="font-medium">{company.name} - {company.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Motivo da reprovação:</label>
                      <Textarea placeholder="Descreva o motivo..." value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={4} />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={handleReprovar} disabled={!reviewNotes.trim()}>Reprovar Cadastro</Button>
                      <Button variant="outline" onClick={() => setRejectionOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Aprovação */}
          <Dialog open={approvalOpen} onOpenChange={(o) => { setApprovalOpen(o); if (!o) setApprovalConfirmed(false); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => { setApprovalNotes(""); setApprovalConfirmed(false); }}>
                <CheckCircle className="h-4 w-4 mr-2" />Aprovar
              </Button>
            </DialogTrigger>
            <DialogContent>
              {approvalConfirmed ? (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">Cadastro Aprovado!</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    O cadastro de <strong>{company.name}</strong> foi aprovado com sucesso. A decisão foi registrada no workflow.
                  </p>
                  {approvalNotes && (
                    <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
                      <p className="text-xs text-muted-foreground mb-1">Comentário registrado:</p>
                      <p className="text-sm">{approvalNotes}</p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button variant="outline" onClick={() => { setApprovalOpen(false); navigate("/analise"); }}>
                      Retomar a Análise
                    </Button>
                    <Button
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => { setApprovalOpen(false); navigate("/recrutamento"); }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Continuar Recrutamento
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <DialogHeader><DialogTitle>Aprovar Cadastro</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Empresa:</p>
                      <p className="font-medium">{company.name} - {company.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comentários:</label>
                      <Textarea placeholder="Adicione comentários... (opcional)" value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={4} />
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={handleAprovar}>
                        <CheckCircle className="h-4 w-4 mr-2" />Aprovar Cadastro
                      </Button>
                      <Button variant="outline" onClick={() => setApprovalOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getProcessIcon(company.processType)}
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <p className="text-muted-foreground font-mono text-sm">{company.cnpj}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">{getStatusBadge(company.status)}</div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Processo</p>
              <p className="font-medium">{getProcessTypeName(company.processType)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gerente Responsável</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{company.managerName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{company.createdAt.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso</p>
              <div className="flex items-center gap-2">
                <Progress value={calculateProgress()} className="w-24" />
                <span className="text-sm font-medium">{calculateProgress()}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />Documentos Enviados
          </CardTitle>
          <p className="text-sm text-muted-foreground">Visualize e analise todos os documentos enviados pela empresa</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {docTabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
            </TabsList>
            {docTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-3">
                <AnaliseDocumentSection
                  categories={getDocumentsByType(tab.type)}
                  getUploadedDocument={getUploadedDocument}
                  getDocStatusIcon={getDocStatusIcon}
                  getDocStatusBadge={getDocStatusBadge}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================== GROUP ANALYSIS VIEW =====================

function GroupAnaliseView({ group }: { group: AnaliseGroup }) {
  const navigate = useNavigate();
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("empresa");
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionOpen, setRejectionOpen] = useState(false);
  const [approvalOpen, setApprovalOpen] = useState(false);
  const [rejectionConfirmed, setRejectionConfirmed] = useState(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState(false);

  const selectedMember = group.members[selectedMemberIndex];
  const documents = mockDocumentsByCompany[selectedMember.id] || [];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Reprovado</Badge>;
      case 'awaiting_review': return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'pending': return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      default: return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
    }
  };

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-success" />;
      case 'rejected': return <X className="h-4 w-4 text-destructive" />;
      case 'needs_replacement': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'needs_replacement': return <Badge className="bg-warning-light text-warning">Requer Substituição</Badge>;
      default: return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
    }
  };

  const getDocumentsByType = (type: string) => documentCategories.filter(cat => cat.type === type && cat.processType === group.processType);
  const getUploadedDocument = (categoryName: string) => documents.find(doc => doc.category === categoryName && doc.companyId === selectedMember.id);

  const calculateMemberProgress = (memberId: string) => {
    const memberDocs = mockDocumentsByCompany[memberId] || [];
    const relevantCategories = documentCategories.filter(cat => cat.processType === group.processType);
    const totalRequired = relevantCategories.filter(cat => cat.obligation === 'obrigatorio').length;
    const approvedRequired = memberDocs.filter(doc => doc.status === 'approved' && relevantCategories.find(cat => cat.name === doc.category)?.obligation === 'obrigatorio').length;
    return totalRequired > 0 ? Math.round((approvedRequired / totalRequired) * 100) : 0;
  };

  const overallProgress = Math.round(group.members.reduce((sum, m) => sum + calculateMemberProgress(m.id), 0) / group.members.length);
  const approvedCount = group.members.filter(m => m.status === 'approved').length;

  const docTabs = [
    { value: "empresa", label: "Empresa", type: "empresa" },
    { value: "socios", label: "Sócios", type: "socios" },
    { value: "financeira", label: "Financeira", type: "financeira" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analise"><ArrowLeft className="h-4 w-4 mr-2" />Voltar para Análise</Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">Análise de Cadastro</h1>
              <Badge variant="outline" className="gap-1">
                <Users className="h-3 w-3" />Grupo Econômico
              </Badge>
            </div>
            <p className="text-muted-foreground">Avaliação consolidada do grupo</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Reprovação Grupo */}
          <Dialog open={rejectionOpen} onOpenChange={(o) => { setRejectionOpen(o); if (!o) setRejectionConfirmed(false); }}>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive" onClick={() => { setReviewNotes(""); setRejectionConfirmed(false); }}>
                <AlertTriangle className="h-4 w-4 mr-2" />Reprovar Grupo
              </Button>
            </DialogTrigger>
            <DialogContent>
              {rejectionConfirmed ? (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">Grupo Reprovado</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    O grupo <strong>{group.name}</strong> ({group.members.length} empresas) foi reprovado. A decisão foi registrada no workflow.
                  </p>
                  {reviewNotes && (
                    <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
                      <p className="text-xs text-muted-foreground mb-1">Motivo registrado:</p>
                      <p className="text-sm">{reviewNotes}</p>
                    </div>
                  )}
                  <Button variant="outline" onClick={() => { setRejectionOpen(false); navigate("/analise"); }} className="mt-4">
                    Retomar a Análise
                  </Button>
                </div>
              ) : (
                <>
                  <DialogHeader><DialogTitle>Reprovar Grupo</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Grupo:</p>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.members.length} empresas</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Motivo da reprovação:</label>
                      <Textarea placeholder="Descreva o motivo..." value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={4} />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={() => { console.log("Reprovar grupo", reviewNotes); setRejectionConfirmed(true); }} disabled={!reviewNotes.trim()}>Reprovar Grupo</Button>
                      <Button variant="outline" onClick={() => setRejectionOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>

          {/* Aprovação Grupo */}
          <Dialog open={approvalOpen} onOpenChange={(o) => { setApprovalOpen(o); if (!o) setApprovalConfirmed(false); }}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => { setApprovalNotes(""); setApprovalConfirmed(false); }} disabled={approvedCount < group.members.length}>
                <CheckCircle className="h-4 w-4 mr-2" />Aprovar Grupo
              </Button>
            </DialogTrigger>
            <DialogContent>
              {approvalConfirmed ? (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-success" />
                  </div>
                  <h3 className="text-xl font-semibold text-center">Grupo Aprovado!</h3>
                  <p className="text-sm text-muted-foreground text-center max-w-md">
                    O grupo <strong>{group.name}</strong> ({group.members.length} empresas) foi aprovado com sucesso. A decisão foi registrada no workflow.
                  </p>
                  {approvalNotes && (
                    <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
                      <p className="text-xs text-muted-foreground mb-1">Comentário registrado:</p>
                      <p className="text-sm">{approvalNotes}</p>
                    </div>
                  )}
                  <div className="flex gap-3 mt-4">
                    <Button
                      className="bg-success hover:bg-success/90 text-success-foreground"
                      onClick={() => { setApprovalOpen(false); navigate("/recrutamento"); }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Continuar Recrutamento
                    </Button>
                    <Button variant="outline" onClick={() => { setApprovalOpen(false); navigate("/analise"); }}>
                      Retomar a Análise
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <DialogHeader><DialogTitle>Aprovar Grupo</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Grupo:</p>
                      <p className="font-medium">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{approvedCount}/{group.members.length} empresas aprovadas</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comentários:</label>
                      <Textarea placeholder="Adicione comentários... (opcional)" value={approvalNotes} onChange={(e) => setApprovalNotes(e.target.value)} rows={4} />
                    </div>
                    <div className="flex gap-2">
                      <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => { console.log("Aprovar grupo", approvalNotes); setApprovalConfirmed(true); }}>
                        <CheckCircle className="h-4 w-4 mr-2" />Aprovar Grupo
                      </Button>
                      <Button variant="outline" onClick={() => setApprovalOpen(false)}>Cancelar</Button>
                    </div>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Group Info Card */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">{group.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{group.members.length} empresas no grupo</p>
              </div>
            </div>
            {getStatusBadge(group.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Processo</p>
              <p className="font-medium">{getProcessTypeLabel(group.processType)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Gerente Responsável</p>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <p className="font-medium">{group.managerName}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Empresas Aprovadas</p>
              <p className="font-medium">{approvedCount} de {group.members.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progresso Geral</p>
              <div className="flex items-center gap-2">
                <Progress value={overallProgress} className="w-24" />
                <span className="text-sm font-medium">{overallProgress}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Selector */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={selectedMemberIndex === 0}
              onClick={() => setSelectedMemberIndex(i => i - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 flex gap-2 overflow-x-auto">
              {group.members.map((member, index) => {
                const progress = calculateMemberProgress(member.id);
                const isSelected = index === selectedMemberIndex;
                return (
                  <button
                    key={member.id}
                    onClick={() => { setSelectedMemberIndex(index); setActiveTab("empresa"); }}
                    className={`flex-1 min-w-[180px] rounded-lg border-2 p-3 transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30 bg-card"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold truncate">{member.name}</p>
                      {member.status === 'approved' && <Check className="h-4 w-4 text-success shrink-0" />}
                      {member.status === 'awaiting_review' && <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0" />}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mb-2">{member.cnpj}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={progress} className="h-1.5 flex-1" />
                      <span className="text-xs font-medium text-muted-foreground">{progress}%</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={selectedMemberIndex === group.members.length - 1}
              onClick={() => setSelectedMemberIndex(i => i + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Selected Company Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">{selectedMember.name}</h2>
            <p className="text-sm text-muted-foreground font-mono">{selectedMember.cnpj}</p>
          </div>
          {getStatusBadge(selectedMember.status)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Progresso:</span>
          <Progress value={calculateMemberProgress(selectedMember.id)} className="w-24" />
          <span className="text-sm font-medium">{calculateMemberProgress(selectedMember.id)}%</span>
        </div>
      </div>

      {/* Documents Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />Documentos — {selectedMember.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">Visualize e analise os documentos desta empresa</p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {docTabs.map(tab => <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>)}
            </TabsList>
            {docTabs.map(tab => (
              <TabsContent key={tab.value} value={tab.value} className="space-y-3">
                <AnaliseDocumentSection
                  categories={getDocumentsByType(tab.type)}
                  getUploadedDocument={getUploadedDocument}
                  getDocStatusIcon={getDocStatusIcon}
                  getDocStatusBadge={getDocStatusBadge}
                />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

// ===================== DOCUMENT SECTION =====================

interface AnaliseDocumentSectionProps {
  categories: DocumentCategory[];
  getUploadedDocument: (name: string) => DocumentWithFiles | undefined;
  getDocStatusIcon: (status: string) => JSX.Element;
  getDocStatusBadge: (status: string) => JSX.Element;
}

function AnaliseDocumentSection({ categories, getUploadedDocument, getDocStatusIcon, getDocStatusBadge }: AnaliseDocumentSectionProps) {
  if (categories.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Nenhuma categoria de documento para este tipo de processo.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {categories.map((category) => {
        const uploadedDoc = getUploadedDocument(category.name);
        return (
          <div key={category.id} className="border rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  {category.obligation === 'obrigatorio' && <Badge variant="outline" className="text-xs">Obrigatório</Badge>}
                  {category.obligation === 'condicional' && <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Condicional</Badge>}
                  {category.obligation === 'opcional' && <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 border-slate-200">Opcional</Badge>}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{category.description}</p>
                {uploadedDoc ? (
                  <div className="space-y-2">
                    {uploadedDoc.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-md">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">{file.uploadedAt.toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                    {uploadedDoc.status === 'needs_replacement' && uploadedDoc.reviewerNotes && (
                      <div className="p-2 bg-warning-light rounded-md">
                        <p className="text-xs text-warning-foreground"><strong>Obs:</strong> {uploadedDoc.reviewerNotes}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                    <Clock className="h-3.5 w-3.5" />Nenhum documento enviado
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 ml-4 shrink-0">
                {uploadedDoc ? (
                  <>
                    {getDocStatusIcon(uploadedDoc.status)}
                    {getDocStatusBadge(uploadedDoc.status)}
                    <DocumentViewModal
                      trigger={<Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Eye className="h-4 w-4" /></Button>}
                      documentName={category.name}
                      files={uploadedDoc.files}
                      status={uploadedDoc.status}
                    />
                  </>
                ) : (
                  <Badge variant="outline" className="text-xs text-muted-foreground">Não enviado</Badge>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
