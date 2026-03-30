import { useState } from "react";
import { Plus, Search, Building2, FileText, Clock, CheckCircle, AlertTriangle, XCircle, Users, LayoutGrid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getProcessTypeIconWithTooltip } from "@/utils/processTypeUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Company, EconomicGroup } from "@/types";
import { Link } from "react-router-dom";
import { getProcessTypeLabel, getProcessTypeBadge } from "@/data/documentCategories";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
// Collapsible kept for potential future use

const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000;

// Standalone companies (not in a group)
const standaloneCompanies: Company[] = [
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
    name: "Distribuidora Nacional LTDA",
    cnpj: "33.444.555/0001-66",
    status: "pending",
    processType: "cadastro_sacado",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "15",
    name: "Serviços Integrados Ltda",
    cnpj: "77.888.999/0001-66",
    status: "rejected",
    processType: "atualizacao_cedente",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-22"),
    updatedAt: new Date("2024-02-15"),
  },
];

// Economic groups with their companies
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
        id: "2",
        name: "Indústria ABC S.A.",
        cnpj: "98.765.432/0001-10",
        status: "pending",
        processType: "cadastro_cedente",
        managerName: "João Silva",
        managerId: "1",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18"),
        groupId: "grp-1",
      },
      {
        id: "6",
        name: "ABC Logística LTDA",
        cnpj: "98.765.432/0002-00",
        status: "pending",
        processType: "cadastro_cedente",
        managerName: "João Silva",
        managerId: "1",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-18"),
        groupId: "grp-1",
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
        id: "3",
        name: "Comércio XYZ LTDA",
        cnpj: "11.222.333/0001-44",
        status: "approved",
        processType: "risco_sacado",
        managerName: "Maria Santos",
        managerId: "2",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-22"),
        approvedAt: new Date("2024-06-01"),
        groupId: "grp-2",
      },
      {
        id: "7",
        name: "XYZ Distribuidora LTDA",
        cnpj: "11.222.333/0002-25",
        status: "approved",
        processType: "risco_sacado",
        managerName: "Maria Santos",
        managerId: "2",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-22"),
        approvedAt: new Date("2024-06-01"),
        groupId: "grp-2",
      },
      {
        id: "8",
        name: "XYZ Transportes S.A.",
        cnpj: "11.222.333/0003-06",
        status: "approved",
        processType: "risco_sacado",
        managerName: "Maria Santos",
        managerId: "2",
        createdAt: new Date("2024-01-05"),
        updatedAt: new Date("2024-01-22"),
        approvedAt: new Date("2024-06-01"),
        groupId: "grp-2",
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
        id: "10",
        name: "Consultoria Delta LTDA",
        cnpj: "55.666.777/0001-88",
        status: "in_progress",
        processType: "atualizacao_cedente",
        managerName: "Roberto Ferreira",
        managerId: "4",
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-02-10"),
        groupId: "grp-3",
      },
      {
        id: "11",
        name: "Delta Sistemas S.A.",
        cnpj: "55.666.777/0002-69",
        status: "in_progress",
        processType: "atualizacao_cedente",
        managerName: "Roberto Ferreira",
        managerId: "4",
        createdAt: new Date("2024-01-18"),
        updatedAt: new Date("2024-02-10"),
        groupId: "grp-3",
      },
    ],
  },
];

function needsRenewal(item: { status: string; approvedAt?: Date }): boolean {
  if (item.status !== 'approved' || !item.approvedAt) return false;
  return Date.now() - item.approvedAt.getTime() >= SIX_MONTHS_MS;
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

type ViewMode = 'grid' | 'manager';

export default function CarteiraPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  // Filter groups
  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.companies.some(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.cnpj.includes(searchTerm));
    const matchesStatus = selectedStatus === "all" || group.status === selectedStatus ||
      group.companies.some(c => c.status === selectedStatus);
    return matchesSearch && matchesStatus;
  });

  // Filter standalone companies
  const filteredStandalone = standaloneCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  // For manager view
  const allItems = [
    ...filteredGroups.map(g => ({ type: 'group' as const, data: g, managerName: g.managerName })),
    ...filteredStandalone.map(c => ({ type: 'company' as const, data: c, managerName: c.managerName })),
  ];

  const itemsByManager = allItems.reduce<Record<string, typeof allItems>>((acc, item) => {
    const key = item.managerName;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Carteira Comercial</h1>
          <p className="text-muted-foreground">
            Gerencie as empresas e grupos econômicos da sua carteira
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover" asChild>
          <Link to="/nova-empresa">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cadastro
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
                  placeholder="Buscar por nome, CNPJ ou grupo..."
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
          {filteredGroups.map(group => (
            <GroupCard key={group.id} group={group} />
          ))}
          {filteredStandalone.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(itemsByManager).map(([managerName, items]) => (
            <div key={managerName}>
              <div className="flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-primary" />
                <h2 className="text-lg font-semibold">{managerName}</h2>
                <Badge variant="secondary" className="ml-1">{items.length} item(ns)</Badge>
              </div>
              <div className="space-y-4">
                {items.map(item =>
                  item.type === 'group'
                    ? <GroupCard key={item.data.id} group={item.data as EconomicGroup} />
                    : (
                      <div key={item.data.id} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CompanyCard company={item.data as Company} />
                      </div>
                    )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredGroups.length === 0 && filteredStandalone.length === 0 && (
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

function GroupCard({ group }: { group: EconomicGroup }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const renewal = needsRenewal(group);
  const company = group.companies[currentIndex];
  const total = group.companies.length;

  const prev = () => setCurrentIndex(i => (i - 1 + total) % total);
  const next = () => setCurrentIndex(i => (i + 1) % total);

  return (
    <Card className={`shadow-card hover:shadow-elevated transition-shadow relative overflow-hidden ${renewal ? 'border-warning' : ''}`}>
      {renewal && (
        <div className="bg-warning/10 border-b border-warning/30 px-6 py-2 rounded-t-xl flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">Atualização necessária — aprovado há mais de 6 meses</span>
        </div>
      )}
      <div className="bg-primary/5 border-b border-border px-6 py-1.5 flex items-center gap-2">
        <Users className="h-3.5 w-3.5 text-primary" />
        <span className="text-xs font-semibold text-primary truncate">{group.name}</span>
        <Badge variant="secondary" className="ml-auto text-[10px] px-1.5 py-0">{total} empresa(s)</Badge>
      </div>

      <CardHeader className="pb-3 px-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {total > 1 && (
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={prev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {getProcessTypeIconWithTooltip(company.processType)}
            <CardTitle className="text-lg truncate">{company.name}</CardTitle>
            {total > 1 && (
              <Button size="icon" variant="ghost" className="h-7 w-7 shrink-0" onClick={next}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
          {getStatusBadge(company.status)}
        </div>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground">CNPJ</p>
            <p className="font-mono text-sm">{company.cnpj}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gerente Comercial</p>
            <p className="text-sm font-medium">{group.managerName}</p>
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
          {/* Dots indicator */}
          {total > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {group.companies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 w-2 rounded-full transition-colors ${idx === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                />
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-2">
            <Button size="sm" className="flex-1" asChild>
              <Link to={`/documentos/${company.id}`}>
                <FileText className="h-4 w-4 mr-2" />
                Documentos
              </Link>
            </Button>
            <Button size="sm" variant="outline" className="flex-1" asChild>
              <Link to={`/empresa/${group.id}`}>
                Ver Detalhes
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CompanyCard({ company }: { company: Company }) {
  const renewal = needsRenewal(company);
  return (
    <Card className={`shadow-card hover:shadow-elevated transition-shadow cursor-pointer ${renewal ? 'border-warning' : ''}`}>
      {renewal && (
        <div className="bg-warning/10 border-b border-warning/30 px-6 py-2 rounded-t-xl flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <span className="text-xs font-medium text-warning">Atualização necessária — aprovado há mais de 6 meses</span>
        </div>
      )}
      <CardHeader className="pb-3 px-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            {getProcessTypeIconWithTooltip(company.processType)}
            <CardTitle className="text-lg truncate">{company.name}</CardTitle>
          </div>
          {getStatusBadge(company.status)}
        </div>
      </CardHeader>
      <CardContent className="px-6">
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
