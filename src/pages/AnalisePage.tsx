import { useState } from "react";
import { Search, Building2, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare, FileText, UserPlus, ShieldAlert, RefreshCw, UserCheck } from "lucide-react";
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

// Mock - empresas salvas pelo gerente
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
    managerName: "Ana Paula",
    managerId: "4",
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
];

type AnaliseFilter = "pendentes" | "em_andamento" | "finalizados";

export default function AnalisePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<AnaliseFilter>("pendentes");
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

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
        return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'awaiting_review':
        return <Badge className="bg-warning-light text-warning">Aguardando Revisão</Badge>;
      case 'pending':
        return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'in_progress':
      default:
        return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
    }
  };

  const getSavedStatusBadge = (savedStatus?: string) => {
    if (savedStatus === 'completo') {
      return <Badge className="bg-success-light text-success border border-success/20 text-xs">Finalizado</Badge>;
    }
    return <Badge className="bg-warning-light text-warning border border-warning/20 text-xs">Incompleto</Badge>;
  };

  const getProcessTypeIcon = (processType: string) => {
    switch (processType) {
      case 'cadastro_cedente':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'risco_sacado':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'atualizacao_cedente':
        return <RefreshCw className="h-4 w-4 text-green-600" />;
      case 'cadastro_sacado':
        return <UserCheck className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  // Filter logic
  const filterCompanies = (filter: AnaliseFilter) => {
    let filtered = mockCompanies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.cnpj.includes(searchTerm) ||
        c.managerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    switch (filter) {
      case 'pendentes':
        // Tem pendência de documento
        filtered = filtered.filter(c => (c.documentsPending ?? 0) > 0 && c.status !== 'approved');
        break;
      case 'em_andamento':
        // Cadastro está analisando documentos (in_progress ou awaiting_review)
        filtered = filtered.filter(c => c.status === 'in_progress' || c.status === 'awaiting_review');
        break;
      case 'finalizados':
        // Cadastro aprovou
        filtered = filtered.filter(c => c.status === 'approved');
        break;
    }

    // Sort oldest first
    return filtered.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  };

  const filteredCompanies = filterCompanies(activeFilter);

  const handleSoliciatarDocumentacao = (companyId: string, selectedDocuments: string[], message: string) => {
    console.log("Solicitando documentação para empresa:", companyId, selectedDocuments, message);
  };

  const handleReprovar = (companyId: string, notes: string) => {
    console.log("Reprovando empresa:", companyId, "Notas:", notes);
  };

  const handleAprovar = (companyId: string, notes: string) => {
    console.log("Aprovando empresa:", companyId, "Comentários:", notes);
  };

  const pendentesCount = mockCompanies.filter(c => (c.documentsPending ?? 0) > 0 && c.status !== 'approved').length;
  const andamentoCount = mockCompanies.filter(c => c.status === 'in_progress' || c.status === 'awaiting_review').length;
  const finalizadosCount = mockCompanies.filter(c => c.status === 'approved').length;

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

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por empresa, CNPJ ou gerente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as AnaliseFilter)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pendentes" className="gap-2">
            <Clock className="h-4 w-4" />
            Pendentes ({pendentesCount})
          </TabsTrigger>
          <TabsTrigger value="em_andamento" className="gap-2">
            <FileText className="h-4 w-4" />
            Em Andamento ({andamentoCount})
          </TabsTrigger>
          <TabsTrigger value="finalizados" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Finalizados ({finalizadosCount})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter} className="mt-6">
          <div className="space-y-4">
            {filteredCompanies.map((company) => (
              <CompanyAnaliseCard
                key={company.id}
                company={company}
                getStatusIcon={getStatusIcon}
                getStatusBadge={getStatusBadge}
                getSavedStatusBadge={getSavedStatusBadge}
                getProcessTypeIcon={getProcessTypeIcon}
                activeFilter={activeFilter}
                onSolicitarDocumentacao={handleSoliciatarDocumentacao}
                onReprovar={handleReprovar}
                onAprovar={handleAprovar}
                selectedCompany={selectedCompany}
                setSelectedCompany={setSelectedCompany}
                reviewNotes={reviewNotes}
                setReviewNotes={setReviewNotes}
                approvalNotes={approvalNotes}
                setApprovalNotes={setApprovalNotes}
              />
            ))}
          </div>

          {filteredCompanies.length === 0 && (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Tente ajustar os filtros de busca" : "Não há empresas nesta categoria"}
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface CompanyAnaliseCardProps {
  company: Company;
  getStatusIcon: (s: string) => JSX.Element;
  getStatusBadge: (s: string) => JSX.Element;
  getSavedStatusBadge: (s?: string) => JSX.Element;
  getProcessTypeIcon: (s: string) => JSX.Element;
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
  getSavedStatusBadge,
  getProcessTypeIcon,
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
  const processClasses = getProcessTypeBadge(company.processType);

  return (
    <Card className="shadow-card hover:shadow-elevated transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{company.name}</h3>
              {getStatusBadge(company.status)}
              {getSavedStatusBadge(company.savedStatus)}
              <Badge className={`${processClasses} border text-xs font-medium flex items-center gap-1`}>
                {getProcessTypeIcon(company.processType)}
                {getProcessTypeLabel(company.processType)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">CNPJ</p>
                <p className="font-mono text-sm">{company.cnpj}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Gerente Responsável</p>
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
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
          {activeFilter !== 'finalizados' && (
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
