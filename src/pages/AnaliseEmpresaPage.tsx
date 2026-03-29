import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Building2, CheckCircle, AlertTriangle, Calendar, User, FileText, Clock, Check, X, Eye, Upload } from "lucide-react";
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
    requestMessage: "Prezado cliente, solicitamos a complementação dos documentos financeiros para dar continuidade à análise do cadastro."
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
    processType: "atualizacao_cedente",
    managerName: "Pedro Costa",
    managerId: "3",
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-22"),
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
    documentsPending: 0,
    documentsTotal: 8,
  },
];

const mockDocuments: DocumentWithFiles[] = [
  {
    id: "1", companyId: "1", name: "Balanço e DRE 2022", type: "financeira",
    category: "Balanço e DRE 2022", status: "approved",
    files: [{ id: "f1", fileName: "balanco_dre_2022.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-15") }],
    reviewedAt: new Date("2024-01-16"), reviewerId: "admin1"
  },
  {
    id: "2", companyId: "1", name: "Contrato Social + Última Alteração", type: "empresa",
    category: "Contrato Social + Última Alteração", status: "pending",
    files: [{ id: "f2", fileName: "contrato_social_completo.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-15") }]
  },
  {
    id: "3", companyId: "1", name: "RG/CPF ou CNH", type: "socios",
    category: "RG/CPF ou CNH", status: "needs_replacement",
    files: [
      { id: "f3", fileName: "cpf_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-14") },
      { id: "f4", fileName: "cpf_socio2.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") },
      { id: "f5", fileName: "rg_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") }
    ],
    reviewedAt: new Date("2024-01-16"),
    reviewerNotes: "Favor enviar documento mais legível do sócio 1.",
    reviewerId: "admin1"
  },
  {
    id: "4", companyId: "1", name: "Balanço e DRE 2023", type: "financeira",
    category: "Balanço e DRE 2023", status: "approved",
    files: [{ id: "f6", fileName: "balanco_dre_2023.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-16") }],
    reviewedAt: new Date("2024-01-17"), reviewerId: "admin1"
  },
  {
    id: "5", companyId: "1", name: "Comprovante de Endereço", type: "socios",
    category: "Comprovante de Endereço", status: "pending",
    files: [{ id: "f7", fileName: "comprovante_endereco_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") }]
  },
];

export default function AnaliseEmpresaPage() {
  const { companyId } = useParams();
  const [reviewNotes, setReviewNotes] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");
  const [activeTab, setActiveTab] = useState("empresa");

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

  const getDocStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-success" />;
      case 'rejected':
        return <X className="h-4 w-4 text-destructive" />;
      case 'needs_replacement':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getDocStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'needs_replacement':
        return <Badge className="bg-warning-light text-warning">Requer Substituição</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
    }
  };

  const getProcessTypeName = (type: string) => getProcessTypeLabel(type);

  const getProcessIcon = (processType: string) => getProcessTypeIconComponent(processType, "md");

  const handleReprovar = (id: string, notes: string) => {
    console.log("Reprovando empresa:", id, "Notas:", notes);
  };

  const handleAprovar = (id: string, notes: string) => {
    console.log("Aprovando empresa:", id, "Comentários:", notes);
  };

  const getDocumentsByType = (type: string) => {
    return documentCategories.filter(cat =>
      cat.type === type && cat.processType === company.processType
    );
  };

  const getUploadedDocument = (categoryName: string) => {
    return mockDocuments.find(doc => doc.category === categoryName && doc.companyId === company.id);
  };

  const calculateProgress = () => {
    const relevantCategories = documentCategories.filter(cat =>
      cat.processType === company.processType
    );
    const totalRequired = relevantCategories.filter(cat => cat.obligation === 'obrigatorio').length;
    const approvedRequired = mockDocuments.filter(doc =>
      doc.companyId === company.id &&
      doc.status === 'approved' &&
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
            <p className="text-muted-foreground">Detalhes do processo de análise</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" variant="destructive" onClick={() => setReviewNotes("")}>
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
                  <Button variant="destructive" onClick={() => handleReprovar(company.id, reviewNotes)}>
                    Reprovar Cadastro
                  </Button>
                  <Button variant="outline">Cancelar</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => setApprovalNotes("")}>
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
                  <Button className="bg-success hover:bg-success/90 text-success-foreground" onClick={() => handleAprovar(company.id, approvalNotes)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Aprovar Cadastro
                  </Button>
                  <Button variant="outline">Cancelar</Button>
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
              {getProcessIcon(company.processType)}
              <div>
                <CardTitle className="text-xl">{company.name}</CardTitle>
                <p className="text-muted-foreground font-mono text-sm">{company.cnpj}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {getStatusBadge(company.status)}
            </div>
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

      {/* Documents Section */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Documentos Enviados
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Visualize e analise todos os documentos enviados pela empresa
          </p>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              {docTabs.map(tab => (
                <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
              ))}
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
                  {category.obligation === 'obrigatorio' && (
                    <Badge variant="outline" className="text-xs">Obrigatório</Badge>
                  )}
                  {category.obligation === 'condicional' && (
                    <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Condicional</Badge>
                  )}
                  {category.obligation === 'opcional' && (
                    <Badge variant="outline" className="text-xs bg-slate-50 text-slate-500 border-slate-200">Opcional</Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2">{category.description}</p>

                {uploadedDoc ? (
                  <div className="space-y-2">
                    {uploadedDoc.files.map((file) => (
                      <div key={file.id} className="flex items-center gap-3 p-2 bg-muted/20 rounded-md">
                        <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{file.fileName}</p>
                          <p className="text-xs text-muted-foreground">
                            {file.uploadedAt.toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    ))}

                    {uploadedDoc.status === 'needs_replacement' && uploadedDoc.reviewerNotes && (
                      <div className="p-2 bg-warning-light rounded-md">
                        <p className="text-xs text-warning-foreground">
                          <strong>Obs:</strong> {uploadedDoc.reviewerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                    <Clock className="h-3.5 w-3.5" />
                    Nenhum documento enviado
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4 shrink-0">
                {uploadedDoc ? (
                  <>
                    {getDocStatusIcon(uploadedDoc.status)}
                    {getDocStatusBadge(uploadedDoc.status)}
                    <DocumentViewModal
                      trigger={
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="h-4 w-4" />
                        </Button>
                      }
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
