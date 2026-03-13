import { Building2, FileText, BarChart3, TrendingUp, Clock, CheckCircle, AlertTriangle, Users, UserPlus, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { getProcessTypeLabel, getProcessTypeBadge } from "@/data/documentCategories";

// Mock data para métricas
const metricsData = {
  totalEmpresas: 156,
  empresasAtivas: 143,
  pendentesAnalise: 23,
  aprovadosUltimoMes: 45,
  taxaAprovacao: 87,
  tempoMedioAnalise: 3.2,
};

const recentCompanies = [
  {
    id: "1",
    name: "Tech Solutions LTDA",
    cnpj: "12.345.678/0001-90",
    status: "in_progress",
    processType: "cadastro_cedente",
    managerName: "João Silva",
    updatedAt: new Date("2024-01-20"),
    documentsPending: 3,
    documentsTotal: 9,
  },
  {
    id: "2", 
    name: "Indústria ABC S.A.",
    cnpj: "98.765.432/0001-10",
    status: "pending",
    processType: "risco_sacado",
    managerName: "Maria Santos",
    updatedAt: new Date("2024-01-18"),
    documentsPending: 7,
    documentsTotal: 9,
  },
  {
    id: "3",
    name: "Comércio XYZ LTDA",
    cnpj: "11.222.333/0001-44",
    status: "approved",
    processType: "atualizacao_cadastro",
    managerName: "Pedro Costa",
    updatedAt: new Date("2024-01-22"),
    documentsPending: 0,
    documentsTotal: 9,
  },
];

const pendingAnalysis = [
  {
    id: "1",
    companyName: "Tech Startup LTDA",
    documentsCount: 12,
    priority: "high",
    waitingDays: 5,
  },
  {
    id: "2",
    companyName: "Inovação Brasil S.A.",
    documentsCount: 8,
    priority: "medium",
    waitingDays: 2,
  },
  {
    id: "3",
    companyName: "Comércio Digital LTDA",
    documentsCount: 15,
    priority: "low",
    waitingDays: 1,
  },
];

export default function HomePage() {
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">Alta</Badge>;
      case 'medium':
        return <Badge className="bg-warning-light text-warning">Média</Badge>;
      case 'low':
        return <Badge variant="secondary">Baixa</Badge>;
      default:
        return <Badge variant="secondary">{priority}</Badge>;
    }
  };

  const getProcessTypeIconComponent = (processType: string) => {
    switch (processType) {
      case 'cadastro_cedente':
        return <UserPlus className="h-4 w-4 text-blue-600" />;
      case 'risco_sacado':
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      case 'atualizacao_cadastro':
        return <RefreshCw className="h-4 w-4 text-green-600" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getProcessTypeBadgeElement = (processType: string) => {
    const classes = getProcessTypeBadge(processType);
    const icon = getProcessTypeIconComponent(processType);
    return (
      <Badge className={`${classes} border text-xs font-medium flex items-center gap-1`}>
        {icon}
        {getProcessTypeLabel(processType)}
      </Badge>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-xl p-8 text-primary-foreground">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo ao M7 Crédito</h1>
            <p className="text-primary-foreground/80 text-lg">
              Gerencie sua carteira comercial e análises de cadastro de forma integrada
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" asChild>
              <Link to="/nova-empresa">
                <Building2 className="h-4 w-4 mr-2" />
                Nova Empresa
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card hover:shadow-elevated transition-shadow hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Empresas</p>
                <p className="text-3xl font-bold text-primary">{metricsData.totalEmpresas}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes Análise</p>
                <p className="text-3xl font-bold text-warning">{metricsData.pendentesAnalise}</p>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Taxa de Aprovação</p>
                <p className="text-3xl font-bold text-success">{metricsData.taxaAprovacao}%</p>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-elevated transition-shadow hover-scale">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio (dias)</p>
                <p className="text-3xl font-bold text-primary">{metricsData.tempoMedioAnalise}</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Seções Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Carteira Comercial */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Carteira Comercial
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/carteira">Ver Todas</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCompanies.map((company) => (
                <div key={company.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-sm">{company.name}</h4>
                      {getStatusBadge(company.status)}
                      {getProcessTypeBadgeElement(company.processType)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      CNPJ: {company.cnpj} • Gerente: {company.managerName}
                    </p>
                    <div className="flex items-center gap-4 mb-2">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          {company.documentsTotal - company.documentsPending}/{company.documentsTotal} docs
                        </span>
                      </div>
                      <Progress 
                        value={((company.documentsTotal - company.documentsPending) / company.documentsTotal) * 100} 
                        className="w-20 h-2" 
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Última atualização: {company.updatedAt.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/empresa/${company.id}`}>
                      Ver
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Análise de Cadastro */}
        <div className="space-y-6">
          <Card className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Análise de Cadastro
              </CardTitle>
              <Button variant="outline" size="sm" asChild>
                <Link to="/analise">Ver Todas</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {pendingAnalysis.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg hover:bg-muted/40 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium text-sm">{item.companyName}</h4>
                      {getPriorityBadge(item.priority)}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        <span>{item.documentsCount} documentos</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{item.waitingDays} dia{item.waitingDays > 1 ? 's' : ''} aguardando</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to={`/analise/${item.id}`}>
                      Analisar
                    </Link>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Ações Rápidas */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-auto p-6 flex flex-col gap-2 hover-scale" asChild>
              <Link to="/nova-empresa">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="font-medium">Nova Empresa</span>
                <span className="text-xs text-muted-foreground">Cadastrar nova empresa</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-6 flex flex-col gap-2 hover-scale" asChild>
              <Link to="/analise">
                <FileText className="h-8 w-8 text-primary" />
                <span className="font-medium">Análise Pendente</span>
                <span className="text-xs text-muted-foreground">Revisar documentos</span>
              </Link>
            </Button>

            <Button variant="outline" className="h-auto p-6 flex flex-col gap-2 hover-scale" asChild>
              <Link to="/carteira">
                <BarChart3 className="h-8 w-8 text-primary" />
                <span className="font-medium">Relatórios</span>
                <span className="text-xs text-muted-foreground">Ver métricas detalhadas</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}