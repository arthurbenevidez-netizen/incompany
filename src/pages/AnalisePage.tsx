import { useState } from "react";
import { Search, Building2, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare, FileText, Users, LayoutGrid, XCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getProcessTypeIconWithTooltip as getProcessTypeIconWithTooltipUtil } from "@/utils/processTypeUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DocumentRequestModal } from "@/components/DocumentRequestModal";
import { Company } from "@/types";
import { Link } from "react-router-dom";
import { getProcessTypeLabel, getProcessTypeBadge } from "@/data/documentCategories";

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Solutions LTDA",
    cnpj: "12.345.678/0001-90",
    status: "awaiting_review",
    processType: "cadastro_cedente",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-20"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 8,
  },
  {
    id: "2",
    name: "Indústria ABC S.A.",
    cnpj: "98.765.432/0001-10",
    status: "pending",
    processType: "risco_sacado",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-02"),
    updatedAt: new Date("2024-01-18"),
    savedStatus: "incompleto",
    documentsPending: 5,
    documentsTotal: 10,
  },
  {
    id: "3",
    name: "Comércio XYZ LTDA",
    cnpj: "11.222.333/0001-44",
    status: "in_progress",
    processType: "atualizacao_cedente",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-22"),
    savedStatus: "completo",
    documentsPending: 2,
    documentsTotal: 6,
  },
  {
    id: "4",
    name: "Startup Rápida LTDA",
    cnpj: "44.555.666/0001-77",
    status: "approved",
    processType: "cadastro_cedente",
    managerName: "Ana Paula Mendes",
    managerId: "6",
    createdAt: new Date("2023-12-10"),
    updatedAt: new Date("2024-02-01"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 8,
  },
  {
    id: "5",
    name: "Logística Sul S.A.",
    cnpj: "55.666.777/0001-88",
    status: "pending",
    processType: "cadastro_sacado",
    managerName: "Carlos Lima",
    managerId: "5",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-15"),
    savedStatus: "incompleto",
    documentsPending: 4,
    documentsTotal: 4,
  },
  {
    id: "6",
    name: "Distribuidora Norte LTDA",
    cnpj: "66.777.888/0001-99",
    status: "rejected",
    processType: "cadastro_cedente",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-02-15"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 8,
  },
  {
    id: "7",
    name: "Metalúrgica Progresso Ltda",
    cnpj: "88.999.111/0001-33",
    status: "approved",
    processType: "cadastro_cedente",
    managerName: "Roberto Ferreira",
    managerId: "4",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-18"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 8,
  },
  {
    id: "8",
    name: "Agro Safra S.A.",
    cnpj: "99.111.222/0001-44",
    status: "in_progress",
    processType: "risco_sacado",
    managerName: "Fernanda Oliveira",
    managerId: "5",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
    savedStatus: "incompleto",
    documentsPending: 3,
    documentsTotal: 10,
  },
  {
    id: "9",
    name: "Energia Verde Ltda",
    cnpj: "10.222.333/0001-55",
    status: "awaiting_review",
    processType: "atualizacao_cedente",
    managerName: "Fernanda Oliveira",
    managerId: "5",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-25"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 6,
  },
  {
    id: "10",
    name: "Transportes União Ltda",
    cnpj: "20.333.444/0001-66",
    status: "pending",
    processType: "cadastro_sacado",
    managerName: "Roberto Ferreira",
    managerId: "4",
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-22"),
    savedStatus: "incompleto",
    documentsPending: 6,
    documentsTotal: 8,
  },
  {
    id: "11",
    name: "Farmacêutica Saúde Ltda",
    cnpj: "30.444.555/0001-77",
    status: "rejected",
    processType: "cadastro_cedente",
    managerName: "Ana Paula Mendes",
    managerId: "6",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-02-14"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 8,
  },
  {
    id: "12",
    name: "Têxtil Nordeste S.A.",
    cnpj: "40.555.666/0001-88",
    status: "in_progress",
    processType: "cadastro_cedente",
    managerName: "Ana Paula Mendes",
    managerId: "6",
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-26"),
    savedStatus: "incompleto",
    documentsPending: 1,
    documentsTotal: 8,
  },
  {
    id: "13",
    name: "Construtora Horizonte S.A.",
    cnpj: "50.666.777/0001-99",
    status: "awaiting_review",
    processType: "risco_sacado",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-02-08"),
    updatedAt: new Date("2024-02-25"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 10,
  },
  {
    id: "14",
    name: "Alimentos Brasil Ltda",
    cnpj: "60.777.888/0001-11",
    status: "approved",
    processType: "cadastro_sacado",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-02-10"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 4,
  },
  {
    id: "grp-1",
    name: "Grupo Alpha Holdings",
    cnpj: "12.345.678/0001-90",
    status: "awaiting_review",
    processType: "cadastro_cedente",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-06"),
    updatedAt: new Date("2024-01-25"),
    savedStatus: "completo",
    documentsPending: 0,
    documentsTotal: 16,
  },
  {
    id: "grp-2",
    name: "Grupo Beta Participações",
    cnpj: "55.666.777/0001-88",
    status: "in_progress",
    processType: "cadastro_cedente",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-28"),
    savedStatus: "incompleto",
    documentsPending: 4,
    documentsTotal: 24,
  },
];

type AnaliseFilter = "todos" | "pendentes" | "em_andamento" | "aprovados" | "reprovados";
type ViewMode = "list" | "manager";

export default function AnalisePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<AnaliseFilter>("pendentes");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'rejected':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'awaiting_review':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-pending" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Reprovado</Badge>;
      case 'awaiting_review':
        return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'pending':
        return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'in_progress':
      default:
        return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
    }
  };

  const getProcessTypeIconWithTooltip = (processType: string) => getProcessTypeIconWithTooltipUtil(processType);

  const filterCompanies = (filter: AnaliseFilter) => {
    let filtered = mockCompanies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm) ||
        c.managerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    switch (filter) {
      case 'todos':
        break;
      case 'pendentes':
        filtered = filtered.filter(c => (c.documentsPending ?? 0) > 0 && c.status !== 'approved' && c.status !== 'rejected');
        break;
      case 'em_andamento':
        filtered = filtered.filter(c => c.status === 'in_progress' || c.status === 'awaiting_review');
        break;
      case 'aprovados':
        filtered = filtered.filter(c => c.status === 'approved');
        break;
      case 'reprovados':
        filtered = filtered.filter(c => c.status === 'rejected');
        break;
    }

    return filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const filteredCompanies = filterCompanies(activeFilter);

  const companiesByManager = filteredCompanies.reduce<Record<string, Company[]>>((acc, company) => {
    const key = company.managerName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(company);
    return acc;
  }, {});

  const handleSoliciatarDocumentacao = (companyId: string, selectedDocuments: string[], message: string) => {
    console.log("Solicitando documentação para empresa:", companyId, selectedDocuments, message);
  };

  const handleReprovar = (companyId: string, notes: string) => {
    console.log("Reprovando empresa:", companyId, "Notas:", notes);
  };

  const handleAprovar = (companyId: string, notes: string) => {
    console.log("Aprovando empresa:", companyId, "Comentários:", notes);
  };

  const todosCount = mockCompanies.length;
  const pendentesCount = mockCompanies.filter(c => (c.documentsPending ?? 0) > 0 && c.status !== 'approved' && c.status !== 'rejected').length;
  const andamentoCount = mockCompanies.filter(c => c.status === 'in_progress' || c.status === 'awaiting_review').length;
  const aprovadosCount = mockCompanies.filter(c => c.status === 'approved').length;
  const reprovadosCount = mockCompanies.filter(c => c.status === 'rejected').length;

  const cardProps = {
    getStatusIcon,
    getStatusBadge,
    getProcessTypeIconWithTooltip,
    activeFilter,
    onSolicitarDocumentacao: handleSoliciatarDocumentacao,
    onReprovar: handleReprovar,
    onAprovar: handleAprovar,
    selectedCompany,
    setSelectedCompany,
    reviewNotes,
    setReviewNotes,
    approvalNotes,
    setApprovalNotes,
  };

  const renderCompanies = () => {
    if (filteredCompanies.length === 0) {
      return (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar os filtros de busca" : "Não há empresas nesta categoria"}
            </p>
          </CardContent>
        </Card>
      );
    }

    if (viewMode === "manager") {
      return (
        <div className="space-y-8">
          {Object.entries(companiesByManager).map(([managerName, companies]) => (
            <div key={managerName}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{managerName}</h2>
                <Badge variant="secondary" className="ml-1">{companies.length} empresa{companies.length !== 1 ? 's' : ''}</Badge>
              </div>
              <div className="space-y-4">
                {companies.map((company) => (
                  <CompanyAnaliseCard key={company.id} company={company} {...cardProps} />
                ))}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <CompanyAnaliseCard key={company.id} company={company} {...cardProps} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Análise de Cadastro</h1>
          <p className="text-muted-foreground">
            Analise empresas e seus documentos para aprovação de cadastro
          </p>
        </div>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por empresa, CNPJ ou gerente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={viewMode === "list" ? "default" : "outline"} onClick={() => setViewMode("list")} size="sm" className="px-2">
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Visualização em lista</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant={viewMode === "manager" ? "default" : "outline"} onClick={() => setViewMode("manager")} size="sm" className="px-2">
                      <Users className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Agrupar por gerente</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as AnaliseFilter)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="todos" className="gap-2">
            <LayoutGrid className="h-4 w-4" />
            Todos ({todosCount})
          </TabsTrigger>
          <TabsTrigger value="pendentes" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendentesCount})
          </TabsTrigger>
          <TabsTrigger value="em_andamento" className="gap-2">
            <FileText className="h-4 w-4" />
            Em Andamento ({andamentoCount})
          </TabsTrigger>
          <TabsTrigger value="aprovados" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Aprovados ({aprovadosCount})
          </TabsTrigger>
          <TabsTrigger value="reprovados" className="gap-2">
            <XCircle className="h-4 w-4" />
            Reprovados ({reprovadosCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-6">
          {renderCompanies()}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CompanyAnaliseCardProps {
  company: Company;
  getStatusIcon: (s: string) => JSX.Element;
  getStatusBadge: (s: string) => JSX.Element;
  getProcessTypeIconWithTooltip: (s: string) => JSX.Element;
  activeFilter: AnaliseFilter;
  onSolicitarDocumentacao: (id: string, docs: string[], msg: string) => void;
  onReprovar: (id: string, notes: string) => void;
  onAprovar: (id: string, notes: string) => void;
  selectedCompany: Company | null;
  setSelectedCompany: (c: Company | null) => void;
  reviewNotes: string;
  setReviewNotes: (n: string) => void;
  approvalNotes: string;
  setApprovalNotes: (n: string) => void;
}

function CompanyAnaliseCard({
  company,
  getStatusIcon,
  getStatusBadge,
  getProcessTypeIconWithTooltip,
  activeFilter,
  onSolicitarDocumentacao,
  onReprovar,
  onAprovar,
  selectedCompany,
  setSelectedCompany,
  reviewNotes,
  setReviewNotes,
  approvalNotes,
  setApprovalNotes,
}: CompanyAnaliseCardProps) {
  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              {getProcessTypeIconWithTooltip(company.processType)}
              {company.id.startsWith('grp-') && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Users className="h-3 w-3" />
                        Grupo
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent><p>Grupo Econômico</p></TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              <h3 className="font-semibold text-lg">{company.name}</h3>
              {getStatusBadge(company.status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-mono text-sm">{company.cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gerente Comercial</p>
                <p className="text-sm font-medium">{company.managerName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Documentos</p>
                <p className="text-sm">
                  <span className="text-destructive font-medium">{company.documentsPending || 0}</span> pendentes de{" "}
                  <span className="font-medium">{company.documentsTotal || 0}</span> total
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Criado em</p>
                <p className="text-sm">{company.createdAt.toLocaleDateString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Atualizado em</p>
                <p className="text-sm">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {activeFilter !== 'aprovados' && activeFilter !== 'reprovados' && (
            <>
              <DocumentRequestModal
                company={company}
                onRequest={onSolicitarDocumentacao}
              />

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => { setSelectedCompany(company); setReviewNotes(""); }}
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Reprovar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Reprovar Cadastro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Empresa:</p>
                      <p className="font-medium">{company.name} - {company.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Motivo da reprovação:</label>
                      <Textarea
                        placeholder="Descreva o motivo da reprovação do cadastro..."
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="destructive" onClick={() => onReprovar(company.id, reviewNotes)}>
                        Reprovar Cadastro
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-success hover:bg-success/90 text-success-foreground"
                    onClick={() => { setSelectedCompany(company); setApprovalNotes(""); }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Aprovar Cadastro</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Empresa:</p>
                      <p className="font-medium">{company.name} - {company.cnpj}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Comentários sobre a aprovação:</label>
                      <Textarea
                        placeholder="Adicione comentários sobre a aprovação do cadastro... (opcional)"
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        className="bg-success hover:bg-success/90 text-success-foreground"
                        onClick={() => onAprovar(company.id, approvalNotes)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprovar Cadastro
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </>
          )}

          <Button size="sm" variant="outline" asChild className="ml-auto">
            <Link to={`/analise/${company.id}`}>
              <Eye className="h-4 w-4 mr-2" />
              Visualizar
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
