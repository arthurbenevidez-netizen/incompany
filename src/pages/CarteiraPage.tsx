import { useState } from "react";
import { Plus, Search, Building2, FileText, Clock, CheckCircle, UserPlus, ShieldAlert, RefreshCw, UserCheck, AlertTriangle, XCircle, Users, LayoutGrid, List } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Company } from "@/types";
import { Link } from "react-router-dom";
import { getProcessTypeLabel, getProcessTypeBadge } from "@/data/documentCategories";

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

const mockCompanies: Company[] = [
  {
    id: "1",
    name: "Tech Solutions LTDA",
    cnpj: "12.345.678/0001-90",
    status: "in_progress",
    processType: "cadastro_cedente",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "2",
    name: "Indústria ABC S.A.",
    cnpj: "98.765.432/0001-10",
    status: "pending",
    processType: "risco_sacado",
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
  },
  {
    id: "3",
    name: "Comércio XYZ LTDA",
    cnpj: "11.222.333/0001-44",
    status: "approved",
    processType: "atualizacao_cedente",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    approvedAt: new Date("2024-06-01"),
  },
  {
    id: "4",
    name: "Startup Inovação LTDA",
    cnpj: "22.333.444/0001-55",
    status: "approved",
    processType: "cadastro_cedente",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-19"),
    approvedAt: new Date("2025-08-01"),
  },
  {
    id: "5",
    name: "Logística Rápida LTDA",
    cnpj: "33.444.555/0001-66",
    status: "pending",
    processType: "cadastro_sacado",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: "6",
    name: "Distribuidora Norte LTDA",
    cnpj: "44.555.666/0001-77",
    status: "rejected",
    processType: "cadastro_cedente",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-10"),
  },
];

function needsRenewal(company: Company): boolean {
  if (company.status !== 'approved' || !company.approvedAt) return false;
  return Date.now() - company.approvedAt.getTime() >= SIX_MONTHS_MS;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'approved':
      return <Badge className="bg-success-light text-success">Aprovada</Badge>;
    case 'pending':
      return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
    case 'in_progress':
      return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
    case 'rejected':
      return <Badge className="bg-destructive-light text-destructive">Reprovada</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
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

const getProcessTypeIconWithTooltip = (processType: string) => {
  const classes = getProcessTypeBadge(processType);
  const icon = getProcessTypeIcon(processType);
  const label = getProcessTypeLabel(processType);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${classes} border rounded-full p-1.5 flex items-center justify-center shrink-0`}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

type ViewMode = 'grid' | 'manager';

export default function CarteiraPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const companiesByManager = filteredCompanies.reduce<Record<string, Company[]>>((acc, company) => {
    const key = company.managerName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(company);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carteira Comercial</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas da sua carteira e seus processos de cadastro
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover" asChild>
          <Link to="/nova-empresa">
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Link>
        </Button>
      </div>

      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CNPJ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              <Button variant={selectedStatus === "all" ? "default" : "outline"} onClick={() => setSelectedStatus("all")} size="sm">Todas</Button>
              <Button variant={selectedStatus === "pending" ? "default" : "outline"} onClick={() => setSelectedStatus("pending")} size="sm">Pendentes</Button>
              <Button variant={selectedStatus === "in_progress" ? "default" : "outline"} onClick={() => setSelectedStatus("in_progress")} size="sm">Em Análise</Button>
              <Button variant={selectedStatus === "approved" ? "default" : "outline"} onClick={() => setSelectedStatus("approved")} size="sm">Aprovadas</Button>
              <Button variant={selectedStatus === "rejected" ? "default" : "outline"} onClick={() => setSelectedStatus("rejected")} size="sm">Reprovadas</Button>
              <div className="border-l border-border pl-2 ml-1 flex gap-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant={viewMode === "grid" ? "default" : "outline"} onClick={() => setViewMode("grid")} size="sm" className="px-2">
                        <LayoutGrid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Visualização em grade</p></TooltipContent>
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
          </div>
        </CardContent>
      </Card>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(companiesByManager).map(([managerName, companies]) => (
            <div key={managerName}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{managerName}</h2>
                <Badge variant="secondary" className="ml-1">{companies.length} empresa{companies.length !== 1 ? 's' : ''}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companies.map((company) => (
                  <CompanyCard key={company.id} company={company} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCompanies.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar os filtros de busca" : "Adicione empresas à sua carteira para começar"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const renewal = needsRenewal(company);
  return (
    <Card className={`shadow-card hover:shadow-elevated transition-shadow cursor-pointer ${renewal ? 'border-warning' : ''}`}>
      {renewal && (
        <div className="bg-warning/10 border-b border-warning/30 px-4 py-2 rounded-t-xl flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">Atualização necessária — aprovado há mais de 6 meses</span>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {getProcessTypeIconWithTooltip(company.processType)}
            <CardTitle className="text-lg truncate">{company.name}</CardTitle>
          </div>
          {getStatusBadge(company.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">CNPJ</p>
            <p className="font-mono text-sm">{company.cnpj}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gerente Comercial</p>
            <p className="text-sm font-medium">{company.managerName}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <p className="text-sm">{company.createdAt.toLocaleDateString('pt-BR')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Atualizado em</p>
              <p className="text-sm">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" asChild>
              <Link to={`/documentos/${company.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                Documentos
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <Link to={`/empresa/${company.id}`}>
                Ver Detalhes
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
