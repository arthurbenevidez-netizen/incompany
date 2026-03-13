import { useState } from "react";
import { Search, Building2, Clock, CheckCircle, AlertTriangle, Eye, MessageSquare, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DocumentRequestModal } from "@/components/DocumentRequestModal";
import { Company } from "@/types";
import { Link } from "react-router-dom";

// Mock data - empresas que precisam de análise
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

export default function AnalisePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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
      case 'pending':
      case 'in_progress':
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

  const filteredCompanies = mockCompanies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.cnpj.includes(searchTerm) ||
                         company.managerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || company.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSoliciatarDocumentacao = (companyId: string, selectedDocuments: string[], message: string) => {
    console.log("Solicitando documentação para empresa:", companyId);
    console.log("Documentos selecionados:", selectedDocuments);
    console.log("Mensagem:", message);
    // Implementar lógica de solicitação de documentação
    // Aqui você pode enviar email, criar notificação, etc.
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Análise de Cadastro</h1>
          <p className="text-muted-foreground">
            Analise empresas e seus documentos para aprovação de cadastro
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por empresa, CNPJ ou gerente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedStatus === "all" ? "default" : "outline"}
                onClick={() => setSelectedStatus("all")}
                size="sm"
              >
                Todas
              </Button>
              <Button
                variant={selectedStatus === "pending" ? "default" : "outline"}
                onClick={() => setSelectedStatus("pending")}
                size="sm"
              >
                Pendentes
              </Button>
              <Button
                variant={selectedStatus === "in_progress" ? "default" : "outline"}
                onClick={() => setSelectedStatus("in_progress")}
                size="sm"
              >
                Em Análise
              </Button>
              <Button
                variant={selectedStatus === "awaiting_review" ? "default" : "outline"}
                onClick={() => setSelectedStatus("awaiting_review")}
                size="sm"
              >
                Aguardando Revisão
              </Button>
              <Button
                variant={selectedStatus === "approved" ? "default" : "outline"}
                onClick={() => setSelectedStatus("approved")}
                size="sm"
              >
                Aprovadas
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies List */}
      <div className="space-y-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="shadow-card hover:shadow-elevated transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <Building2 className="h-5 w-5 text-primary" />
                      <h3 className="font-semibold text-lg">{company.name}</h3>
                      {getStatusBadge(company.status)}
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
                        <p className="text-sm text-muted-foreground">Atualizado em</p>
                        <p className="text-sm">{company.updatedAt.toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>

                    {/* Documentação Solicitada - só mostra se houver */}
                    {company.requestedDocuments && company.requestedDocuments.length > 0 && (
                      <div className="bg-warning/5 border border-warning/20 rounded-md p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="h-4 w-4 text-warning" />
                          <span className="text-sm font-medium text-warning">
                            Documentação Solicitada em {company.requestDate?.toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Documentos: {company.requestedDocuments.join(", ")}
                        </div>
                      </div>
                    )}
                  </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-border">
                {/* Solicitar Documentação */}
                <DocumentRequestModal 
                  company={company}
                  onRequest={handleSoliciatarDocumentacao}
                />

                {/* Reprovar */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      variant="destructive"
                      onClick={() => {
                        setSelectedCompany(company);
                        setReviewNotes("");
                      }}
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
                        <p className="font-medium">{selectedCompany?.name} - {selectedCompany?.cnpj}</p>
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
                          onClick={() => {
                            if (selectedCompany) {
                              handleReprovar(selectedCompany.id, reviewNotes);
                            }
                          }}
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
                      onClick={() => {
                        setSelectedCompany(company);
                        setApprovalNotes("");
                      }}
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
                        <p className="font-medium">{selectedCompany?.name} - {selectedCompany?.cnpj}</p>
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
                          onClick={() => {
                            if (selectedCompany) {
                              handleAprovar(selectedCompany.id, approvalNotes);
                            }
                          }}
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

                {/* Visualizar - na extremidade */}
                <Button size="sm" variant="outline" asChild className="ml-auto">
                  <Link to={`/analise/${company.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma empresa encontrada</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Tente ajustar os filtros de busca" : "Não há empresas pendentes de análise"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}