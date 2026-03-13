import { useState } from "react";
import { Upload, FileText, Check, X, Clock, AlertTriangle, Eye, UserPlus, ShieldAlert, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCategory, DocumentWithFiles, DocumentFile } from "@/types";
import { documentCategories, getProcessTypeLabel } from "@/data/documentCategories";
import { useParams } from "react-router-dom";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import DocumentViewModal from "@/components/DocumentViewModal";

// Mock data for companies
const mockCompanies = {
  "1": { name: "Tech Solutions LTDA", processType: "cadastro_cedente" },
  "2": { name: "Indústria ABC S.A.", processType: "risco_sacado" },
  "3": { name: "Comércio XYZ LTDA", processType: "atualizacao_cedente" },
};

const mockDocuments: DocumentWithFiles[] = [
  {
    id: "1",
    companyId: "1",
    name: "Balanço e DRE 2022",
    type: "financeira",
    category: "Balanço e DRE 2022",
    status: "approved",
    files: [
      {
        id: "f1",
        fileName: "balanco_dre_2022.pdf",
        fileUrl: "#",
        uploadedAt: new Date("2024-01-15")
      }
    ],
    reviewedAt: new Date("2024-01-16"),
    reviewerId: "admin1"
  },
  {
    id: "2",
    companyId: "1",
    name: "Contrato Social + Última Alteração",
    type: "empresa",
    category: "Contrato Social + Última Alteração",
    status: "pending",
    files: [
      {
        id: "f2",
        fileName: "contrato_social_completo.pdf",
        fileUrl: "#",
        uploadedAt: new Date("2024-01-15")
      }
    ]
  },
  {
    id: "3",
    companyId: "1",
    name: "RG/CPF ou CNH",
    type: "socios",
    category: "RG/CPF ou CNH",
    status: "needs_replacement",
    files: [
      {
        id: "f3",
        fileName: "cpf_socio1.pdf",
        fileUrl: "#",
        uploadedAt: new Date("2024-01-14")
      },
      {
        id: "f4",
        fileName: "cpf_socio2.pdf",
        fileUrl: "#",
        uploadedAt: new Date("2024-01-18")
      },
      {
        id: "f5",
        fileName: "rg_socio1.pdf",
        fileUrl: "#",
        uploadedAt: new Date("2024-01-18")
      }
    ],
    reviewedAt: new Date("2024-01-16"),
    reviewerNotes: "Favor enviar documento mais legível do sócio 1.",
    reviewerId: "admin1"
  }
];

export default function DocumentosPage() {
  const { id } = useParams();
  const companyId = id || "1";
  const company = mockCompanies[companyId] || mockCompanies["1"];
  const [activeTab, setActiveTab] = useState("empresa");

  const handleDocumentUpload = (categoryName: string, files: File[]) => {
    // Implementar lógica de upload
    console.log(`Uploading ${files.length} files for category: ${categoryName}`);
    // Aqui seria feita a integração com o backend
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="h-4 w-4 text-success" />;
      case 'rejected':
        return <X className="h-4 w-4 text-destructive" />;
      case 'needs_replacement':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'needs_replacement':
        return <Badge className="bg-warning-light text-warning">Requer Substituição</Badge>;
      case 'pending':
      default:
        return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
    }
  };

  const getDocumentsByType = (type: string) => {
    return documentCategories.filter(cat => 
      cat.type === type && cat.processType === company.processType
    );
  };

  const getUploadedDocument = (categoryName: string) => {
    return mockDocuments.find(doc => doc.category === categoryName);
  };

  const calculateProgress = () => {
    const relevantCategories = documentCategories.filter(cat => 
      cat.processType === company.processType
    );
    const totalRequired = relevantCategories.filter(cat => cat.required).length;
    const approvedRequired = mockDocuments.filter(doc => 
      doc.status === 'approved' && 
      relevantCategories.find(cat => cat.name === doc.category)?.required
    ).length;
    return totalRequired > 0 ? Math.round((approvedRequired / totalRequired) * 100) : 0;
  };

  const getProcessIcon = (processType: string) => {
    switch (processType) {
      case 'cadastro_cedente':
        return <UserPlus className="h-5 w-5 text-blue-600" />;
      case 'risco_sacado':
        return <ShieldAlert className="h-5 w-5 text-red-600" />;
      case 'atualizacao_cedente':
        return <RefreshCw className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            {getProcessIcon(company.processType)}
            <h1 className="text-2xl font-bold">Documentos - {company.name}</h1>
          </div>
          <p className="text-muted-foreground">
            Processo: <span className="font-medium">{getProcessTypeLabel(company.processType)}</span>
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Progresso do Cadastro</p>
            <div className="flex items-center gap-2">
              <Progress value={calculateProgress()} className="w-32" />
              <span className="text-sm font-medium">{calculateProgress()}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="empresa">Documentos da Empresa</TabsTrigger>
          <TabsTrigger value="socios">Documentos dos Sócios</TabsTrigger>
          <TabsTrigger value="financeira">Documentos Financeiros</TabsTrigger>
        </TabsList>

        <TabsContent value="empresa" className="space-y-4">
          <DocumentSection 
            title="Documentos da Empresa"
            categories={getDocumentsByType("empresa")}
            getUploadedDocument={getUploadedDocument}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            onDocumentUpload={handleDocumentUpload}
          />
        </TabsContent>

        <TabsContent value="socios" className="space-y-4">
          <DocumentSection 
            title="Documentos dos Sócios"
            categories={getDocumentsByType("socios")}
            getUploadedDocument={getUploadedDocument}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            onDocumentUpload={handleDocumentUpload}
          />
        </TabsContent>

        <TabsContent value="financeira" className="space-y-4">
          <DocumentSection 
            title="Documentos Financeiros"
            categories={getDocumentsByType("financeira")}
            getUploadedDocument={getUploadedDocument}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            onDocumentUpload={handleDocumentUpload}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

interface DocumentSectionProps {
  title: string;
  categories: DocumentCategory[];
  getUploadedDocument: (categoryName: string) => DocumentWithFiles | undefined;
  getStatusIcon: (status: string) => JSX.Element;
  getStatusBadge: (status: string) => JSX.Element;
  onDocumentUpload: (categoryName: string, files: File[]) => void;
}

function DocumentSection({ 
  title, 
  categories, 
  getUploadedDocument, 
  getStatusIcon, 
  getStatusBadge,
  onDocumentUpload
}: DocumentSectionProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {categories.map((category) => {
          const uploadedDoc = getUploadedDocument(category.name);
          
          return (
            <Card key={category.id} className="shadow-card">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.required && (
                        <Badge variant="outline" className="text-xs">Obrigatório</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    
                    {uploadedDoc ? (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          {uploadedDoc.files.map((file, index) => (
                            <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{file.fileName}</p>
                                <p className="text-xs text-muted-foreground">
                                  Enviado em {file.uploadedAt.toLocaleDateString('pt-BR')}
                                </p>
                              </div>
                              {index === uploadedDoc.files.length - 1 && (
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(uploadedDoc.status)}
                                  {getStatusBadge(uploadedDoc.status)}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="text-xs text-muted-foreground">
                          {uploadedDoc.files.length} arquivo{uploadedDoc.files.length > 1 ? 's' : ''} enviado{uploadedDoc.files.length > 1 ? 's' : ''}
                        </div>
                        
                        {uploadedDoc.status === 'needs_replacement' && uploadedDoc.reviewerNotes && (
                          <div className="p-3 bg-warning-light rounded-lg">
                            <p className="text-sm text-warning-foreground">
                              <strong>Observações:</strong> {uploadedDoc.reviewerNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground mb-3">
                          Nenhum documento enviado
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <DocumentUploadModal
                    trigger={
                      <Button size="sm" className="bg-primary hover:bg-primary-hover">
                        <Upload className="h-4 w-4 mr-2" />
                        {uploadedDoc ? 'Substituir' : 'Enviar'} Documento
                      </Button>
                    }
                    documentName={category.name}
                    documentDescription={category.description}
                    required={category.required}
                    existingFiles={uploadedDoc?.files || []}
                    onUpload={(files) => onDocumentUpload(category.name, files)}
                  />
                  {uploadedDoc && (
                    <DocumentViewModal
                      trigger={
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </Button>
                      }
                      documentName={category.name}
                      files={uploadedDoc.files}
                      status={uploadedDoc.status}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}