import { BarChart3, FileText, Building2, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function CadastroPage() {
  // Mock data para dashboard
  const stats = {
    totalEmpresas: 156,
    pendentesAnalise: 23,
    aprovadas: 98,
    rejeitadas: 12,
    documentosPendentes: 67,
  };

  const recentCompanies = [
    {
      id: "1",
      name: "Tech Solutions LTDA",
      cnpj: "12.345.678/0001-90",
      status: "pending",
      documentsCount: 8,
      completedDocuments: 5,
      submittedAt: new Date("2024-01-20"),
    },
    {
      id: "2",
      name: "Indústria ABC S.A.",
      cnpj: "98.765.432/0001-10", 
      status: "needs_review",
      documentsCount: 12,
      completedDocuments: 10,
      submittedAt: new Date("2024-01-19"),
    },
    {
      id: "3",
      name: "Comércio XYZ LTDA",
      cnpj: "11.222.333/0001-44",
      status: "approved",
      documentsCount: 10,
      completedDocuments: 10,
      submittedAt: new Date("2024-01-18"),
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovada</Badge>;
      case 'pending':
        return <Badge className="bg-pending-light text-pending">Pendente Análise</Badge>;
      case 'needs_review':
        return <Badge className="bg-warning-light text-warning">Requer Revisão</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCompletionPercentage = (completed: number, total: number) => {
    return Math.round((completed / total) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard de Cadastro</h1>
        <p className="text-muted-foreground">
          Visão geral dos processos de cadastro e análise de documentos
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Empresas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="text-2xl font-bold">{stats.totalEmpresas}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes Análise
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-pending" />
              <span className="text-2xl font-bold text-pending">{stats.pendentesAnalise}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Aprovadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <span className="text-2xl font-bold text-success">{stats.aprovadas}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejeitadas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <span className="text-2xl font-bold text-destructive">{stats.rejeitadas}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Docs Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-warning" />
              <span className="text-2xl font-bold text-warning">{stats.documentosPendentes}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Companies */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Empresas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentCompanies.map((company) => (
              <div key={company.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/20 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold">{company.name}</h3>
                    {getStatusBadge(company.status)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    CNPJ: {company.cnpj}
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Progresso:</span>
                      <Progress 
                        value={getCompletionPercentage(company.completedDocuments, company.documentsCount)} 
                        className="w-24 h-2"
                      />
                      <span className="text-sm font-medium">
                        {company.completedDocuments}/{company.documentsCount}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Enviado em {company.submittedAt.toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors">
                    Analisar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}