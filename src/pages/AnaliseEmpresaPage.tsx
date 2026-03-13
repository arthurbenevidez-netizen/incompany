import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle, AlertTriangle, Calendar, User, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Company } from "@/types";

// Mock data - mesmo da AnalisePage mas com detalhes extras
const mockCompanies: Company[] = [
  {
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
    documentsTotal: 8,
    requestedDocuments: [
      "Balanço Atualizado",
      "Balancete Atualizado", 
      "Comprovante de Regularidade Fiscal"
    ],
    requestDate: new Date("2024-01-18"),
    requestMessage: "Prezado cliente, solicitamos a complementação dos documentos financeiros para dar continuidade à análise do cadastro. Por favor, encaminhe os documentos atualizados conforme listado."
  },
  {
    id: "2", 
    name: "Indústria ABC S.A.",
    cnpj: "98.765.432/0001-10",
    status: "pending",
    processType: "risco_sacado",
    managerName: "Maria Santos",
    managerId: "2",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-18"),
    documentsPending: 5,
    documentsTotal: 10,
  },
  {
    id: "3",
    name: "Comércio XYZ LTDA",
    cnpj: "11.222.333/0001-44",
    status: "awaiting_review",
    processType: "atualizacao_cadastro",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
    documentsPending: 2,
    documentsTotal: 6,
  },
];

export default function AnaliseEmpresaPage() {
  const { companyId } = useParams();
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  
  const company = mockCompanies.find(c => c.id === companyId);

  if (!company) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analise">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Análise
            </Link>
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

  const getProcessTypeName = (type: string) => {
    switch (type) {
      case 'cadastro_cedente':
        return 'Cadastro Cedente';
      case 'risco_sacado':
        return 'Risco Sacado';
      case 'atualizacao_cadastro':
        return 'Atualização de Cadastro';
      default:
        return type;
    }
  };

  const handleReprovar = (companyId: string, notes: string) => {
    console.log("Reprovando empresa:", companyId, "Notas:", notes);
    // Implementar lógica de reprovação
  };

  const handleAprovar = (companyId: string, notes: string) => {
    console.log("Aprovando empresa:", companyId, "Comentários:", notes);
    // Implementar lógica de aprovação
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/analise">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Análise
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Análise de Cadastro</h1>
            <p className="text-muted-foreground">
              Detalhes do processo de análise
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Reprovar */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => setReviewNotes("")}
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
                  <label className="text-sm font-medium mb-2 block">
                    Motivo da reprovação:
                  </label>
                  <Textarea
                    placeholder="Descreva o motivo da reprovação do cadastro..."
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="destructive"
                    onClick={() => handleReprovar(company.id, reviewNotes)}
                  >
                    Reprovar Cadastro
                  </Button>
                  <Button variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Aprovar */}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="bg-success hover:bg-success/90 text-success-foreground"
                onClick={() => setApprovalNotes("")}
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
                  <label className="text-sm font-medium mb-2 block">
                    Comentários sobre a aprovação:
                  </label>
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
                    onClick={() => handleAprovar(company.id, approvalNotes)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Cadastro
                  </Button>
                  <Button variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Company Info Card */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-6 w-6 text-primary" />
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <p className="text-muted-foreground font-mono text-sm">{company.cnpj}</p>
              </div>
            </div>
            {getStatusBadge(company.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
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
              <p className="text-sm text-muted-foreground">Documentos</p>
              <p className="text-sm">
                <span className="text-destructive font-medium">{company.documentsPending || 0}</span> pendentes de{" "}
                <span className="font-medium">{company.documentsTotal || 0}</span> total
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Criado em</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm">{company.createdAt.toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requested Documents Card - só mostra se houver documentação solicitada */}
      {company.requestedDocuments && company.requestedDocuments.length > 0 && (
        <Card className="shadow-card border-warning">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <Clock className="h-5 w-5" />
              Documentação Solicitada
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Solicitada em {company.requestDate?.toLocaleDateString('pt-BR')} às {company.requestDate?.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {company.requestMessage && (
              <div>
                <h4 className="font-medium mb-2">Mensagem enviada:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                  {company.requestMessage}
                </p>
              </div>
            )}
            
            <div>
              <h4 className="font-medium mb-2">Documentos solicitados:</h4>
              <div className="space-y-2">
                {company.requestedDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-warning" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Timeline - placeholder para futuras implementações */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Histórico do Processo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Processo iniciado</p>
                <p className="text-sm text-muted-foreground">{company.createdAt.toLocaleDateString('pt-BR')} - Cadastro criado por {company.managerName}</p>
              </div>
            </div>
            
            {company.requestedDocuments && (
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                <div>
                  <p className="font-medium">Documentação solicitada</p>
                  <p className="text-sm text-muted-foreground">
                    {company.requestDate?.toLocaleDateString('pt-BR')} - Solicitados {company.requestedDocuments.length} documentos
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-muted rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-muted-foreground">Aguardando análise</p>
                <p className="text-sm text-muted-foreground">Processo em andamento</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}