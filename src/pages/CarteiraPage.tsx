import { useState } from "react";
import { Plus, Search, Building2, FileText, Clock, CheckCircle, UserPlus, ShieldAlert, RefreshCw, UserCheck, AlertTriangle } from "lucide-react";
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
    managerName: "João Silva",
    managerId: "1",
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
    managerName: "João Silva",
    managerId: "1",
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
    managerName: "João Silva",
    managerId: "1",
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-05"),
  },
];

function needsRenewal(company: Company): boolean {
  if (company.status !== 'approved' || !company.approvedAt) return false;
  return Date.now() - company.approvedAt.getTime() >= SIX_MONTHS_MS;
}

export default function CarteiraPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-pending-light text-pending">Pendente</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/10 text-primary">Em Análise</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-pending" />;
      case 'in_progress':
        return <FileText className="h-4 w-4 text-primary" />;
      default:
        return <Building2 className="h-4 w-4 text-muted-foreground" />;
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

  const getProcessTypeBadgeElement = (processType: string) => {
    const classes = getProcessTypeBadge(processType);
    const icon = getProcessTypeIcon(processType);
    return (
      <Badge className={`${classes} border text-xs font-medium flex items-center gap-1`}>
        {icon}
        {getProcessTypeLabel(processType)}
      </Badge>
    );
  };

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

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
            <div className="flex gap-2 flex-wrap">
              <Button variant={selectedStatus === "all" ? "default" : "outline"} onClick={() => setSelectedStatus("all")} size="sm">Todas</Button>
              <Button variant={selectedStatus === "pending" ? "default" : "outline"} onClick={() => setSelectedStatus("pending")} size="sm">Pendentes</Button>
              <Button variant={selectedStatus === "in_progress" ? "default" : "outline"} onClick={() => setSelectedStatus("in_progress")} size="sm">Em Análise</Button>
              <Button variant={selectedStatus === "approved" ? "default" : "outline"} onClick={() => setSelectedStatus("approved")} size="sm">Aprovadas</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => {
          const renewal = needsRenewal(company);
          return (
            <Card key={company.id} className={`shadow-card hover:shadow-elevated transition-shadow cursor-pointer ${renewal ? 'border-warning' : ''}`}>
              {renewal && (
                <div className="bg-warning/10 border-b border-warning/30 px-4 py-2 rounded-t-xl flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span className="text-xs font-medium text-warning">Atualização necessária — aprovado há mais de 6 meses</span>
                </div>
              )}
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(company.status)}
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    {getStatusBadge(company.status)}
                    {getProcessTypeBadgeElement(company.processType)}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">CNPJ</p>
                    <p className="font-mono text-sm">{company.cnpj}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Criado em</p>
                    <p className="text-sm">{company.createdAt.toLocaleDateString('pt-BR')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Atualizado em</p>
                    <p className="text-sm">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
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
        })}
      </div>

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
