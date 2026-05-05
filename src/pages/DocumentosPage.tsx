import { useState } from "react";
import { Upload, FileText, Check, X, Clock, AlertTriangle, Eye, Users, Building2, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { getProcessTypeIconComponent } from "@/utils/processTypeUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentCategory, DocumentWithFiles, DocumentFile, EconomicGroup, Company } from "@/types";
import { documentCategories, getProcessTypeLabel } from "@/data/documentCategories";
import { useParams, Link } from "react-router-dom";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import DocumentViewModal from "@/components/DocumentViewModal";
import { GroupOptionalNotice } from "@/components/GroupOptionalNotice";

// Mock data for standalone companies
const mockCompanies: Record<string, { name: string; processType: string }> = {
  "1": { name: "Tech Solutions LTDA", processType: "cadastro_cedente" },
  "2": { name: "Indústria ABC S.A.", processType: "risco_sacado" },
  "3": { name: "Comércio XYZ LTDA", processType: "atualizacao_cedente" },
  "6": { name: "ABC Logística LTDA", processType: "cadastro_cedente" },
  "7": { name: "XYZ Distribuidora LTDA", processType: "risco_sacado" },
  "8": { name: "XYZ Transportes S.A.", processType: "risco_sacado" },
  "10": { name: "Consultoria Delta LTDA", processType: "atualizacao_cedente" },
  "11": { name: "Delta Sistemas S.A.", processType: "atualizacao_cedente" },
};

// Mock groups
const mockGroups: { id: string; name: string; companies: { id: string; name: string; cnpj: string; processType: string; documentsPending: number; documentsTotal: number }[] }[] = [
  {
    id: "grp-1",
    name: "Grupo Alpha Holdings",
    companies: [
      { id: "2", name: "Indústria ABC S.A.", cnpj: "98.765.432/0001-10", processType: "cadastro_cedente", documentsPending: 4, documentsTotal: 12 },
      { id: "6", name: "ABC Logística LTDA", cnpj: "98.765.432/0002-00", processType: "cadastro_cedente", documentsPending: 2, documentsTotal: 9 },
    ],
  },
  {
    id: "grp-2",
    name: "Grupo Beta Participações",
    companies: [
      { id: "3", name: "Comércio XYZ LTDA", cnpj: "11.222.333/0001-44", processType: "risco_sacado", documentsPending: 0, documentsTotal: 8 },
      { id: "7", name: "XYZ Distribuidora LTDA", cnpj: "11.222.333/0002-25", processType: "risco_sacado", documentsPending: 0, documentsTotal: 10 },
      { id: "8", name: "XYZ Transportes S.A.", cnpj: "11.222.333/0003-06", processType: "risco_sacado", documentsPending: 1, documentsTotal: 9 },
    ],
  },
  {
    id: "grp-3",
    name: "Grupo Inovação Tech",
    companies: [
      { id: "10", name: "Consultoria Delta LTDA", cnpj: "55.666.777/0001-88", processType: "atualizacao_cedente", documentsPending: 5, documentsTotal: 11 },
      { id: "11", name: "Delta Sistemas S.A.", cnpj: "55.666.777/0002-69", processType: "atualizacao_cedente", documentsPending: 3, documentsTotal: 9 },
    ],
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
      { id: "f5", fileName: "rg_socio1.pdf", fileUrl: "#", uploadedAt: new Date("2024-01-18") },
    ],
    reviewedAt: new Date("2024-01-16"),
    reviewerNotes: "Favor enviar documento mais legível do sócio 1.",
    reviewerId: "admin1"
  }
];

export default function DocumentosPage() {
  const { companyId: paramId } = useParams();
  const id = paramId || "1";

  // Check if it's a group
  const group = mockGroups.find(g => g.id === id);

  if (group) {
    return <GroupDocumentosView group={group} />;
  }

  const company = mockCompanies[id] || mockCompanies["1"];
  return <SingleCompanyDocumentos companyId={id} companyName={company.name} processType={company.processType} />;
}

// ─── Group Documents View ────────────────────────────────────
interface GroupCompany {
  id: string;
  name: string;
  cnpj: string;
  processType: string;
  documentsPending: number;
  documentsTotal: number;
}

function GroupDocumentosView({ group }: { group: { id: string; name: string; companies: GroupCompany[] } }) {
  const [selectedCompanyIndex, setSelectedCompanyIndex] = useState(0);
  const selectedCompany = group.companies[selectedCompanyIndex];

  return (
    <div className="space-y-6">
      {/* Group Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira"><ArrowLeft className="h-4 w-4 mr-2" />Voltar</Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-2xl font-bold">Documentos - {group.name}</h1>
            <Badge variant="secondary">{group.companies.length} empresas</Badge>
          </div>
          <p className="text-muted-foreground">Gerencie documentos de todas as empresas do grupo</p>
        </div>
      </div>

      <GroupOptionalNotice context="documentos" />

      {/* Company Selector - Horizontal Pills */}
      <Card className="shadow-card">
        <CardContent className="pt-6 pb-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">Selecione a empresa</p>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {group.companies.map((company, idx) => {
              const approved = (company.documentsTotal || 0) - (company.documentsPending || 0);
              const pct = company.documentsTotal ? Math.round((approved / company.documentsTotal) * 100) : 0;
              const isSelected = idx === selectedCompanyIndex;

              return (
                <button
                  key={company.id}
                  onClick={() => setSelectedCompanyIndex(idx)}
                  className={`flex-shrink-0 rounded-xl border-2 p-4 text-left transition-all min-w-[220px] ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className={`h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-semibold truncate">{company.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-2">{company.cnpj}</p>
                  <div className="flex items-center gap-2">
                    <Progress value={pct} className="h-1.5 flex-1" />
                    <span className={`text-xs font-medium ${pct === 100 ? 'text-success' : 'text-muted-foreground'}`}>
                      {pct}%
                    </span>
                  </div>
                  {pct === 100 && (
                    <Badge className="bg-success/10 text-success text-xs mt-2">Completo</Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected Company Documents */}
      <SingleCompanyDocumentos
        companyId={selectedCompany.id}
        companyName={selectedCompany.name}
        processType={selectedCompany.processType}
        isGroupContext
        groupProgress={{
          companies: group.companies.map(c => ({
            name: c.name,
            approved: (c.documentsTotal || 0) - (c.documentsPending || 0),
            total: c.documentsTotal || 0,
          }))
        }}
      />
    </div>
  );
}

// ─── Single Company Documents ────────────────────────────────
interface SingleCompanyDocumentosProps {
  companyId: string;
  companyName: string;
  processType: string;
  isGroupContext?: boolean;
  groupProgress?: {
    companies: { name: string; approved: number; total: number }[];
  };
}

function SingleCompanyDocumentos({ companyId, companyName, processType, isGroupContext, groupProgress }: SingleCompanyDocumentosProps) {
  const [activeTab, setActiveTab] = useState("empresa");

  const handleDocumentUpload = (categoryName: string, files: File[]) => {
    console.log(`Uploading ${files.length} files for ${companyName}, category: ${categoryName}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <Check className="h-4 w-4 text-success" />;
      case 'rejected': return <X className="h-4 w-4 text-destructive" />;
      case 'needs_replacement': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-success-light text-success">Aprovado</Badge>;
      case 'rejected': return <Badge className="bg-destructive-light text-destructive">Rejeitado</Badge>;
      case 'needs_replacement': return <Badge className="bg-warning-light text-warning">Requer Substituição</Badge>;
      default: return <Badge className="bg-muted text-muted-foreground">Pendente</Badge>;
    }
  };

  const getDocumentsByType = (type: string) =>
    documentCategories.filter(cat => cat.type === type && cat.processType === processType);

  const getUploadedDocument = (categoryName: string) =>
    mockDocuments.find(doc => doc.category === categoryName);

  const calculateProgress = () => {
    const relevantCategories = documentCategories.filter(cat => cat.processType === processType);
    const totalRequired = relevantCategories.filter(cat => cat.obligation === 'obrigatorio').length;
    const approvedRequired = mockDocuments.filter(doc =>
      doc.status === 'approved' && relevantCategories.find(cat => cat.name === doc.category)?.obligation === 'obrigatorio'
    ).length;
    return totalRequired > 0 ? Math.round((approvedRequired / totalRequired) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header - only show for standalone */}
      {!isGroupContext && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              {getProcessTypeIconComponent(processType, "md")}
              <h1 className="text-2xl font-bold">Documentos - {companyName}</h1>
            </div>
            <p className="text-muted-foreground">
              Processo: <span className="font-medium">{getProcessTypeLabel(processType)}</span>
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
      )}

      {/* Company-level progress bar for group context */}
      {isGroupContext && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getProcessTypeIconComponent(processType, "md")}
            <div>
              <h2 className="text-lg font-semibold">{companyName}</h2>
              <p className="text-sm text-muted-foreground">
                Processo: {getProcessTypeLabel(processType)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Progress value={calculateProgress()} className="w-32" />
            <span className="text-sm font-medium">{calculateProgress()}%</span>
          </div>
        </div>
      )}

      {/* Document Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="empresa">Documentos da Empresa</TabsTrigger>
          <TabsTrigger value="socios">Documentos dos Sócios</TabsTrigger>
          <TabsTrigger value="financeira">Documentos Financeiros</TabsTrigger>
        </TabsList>

        {["empresa", "socios", "financeira"].map(type => (
          <TabsContent key={type} value={type} className="space-y-4">
            <DocumentSection
              title={type === "empresa" ? "Documentos da Empresa" : type === "socios" ? "Documentos dos Sócios" : "Documentos Financeiros"}
              categories={getDocumentsByType(type)}
              getUploadedDocument={getUploadedDocument}
              getStatusIcon={getStatusIcon}
              getStatusBadge={getStatusBadge}
              onDocumentUpload={handleDocumentUpload}
            />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

// ─── Document Section ────────────────────────────────────────
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
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>

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
                        <p className="text-sm text-muted-foreground mb-3">Nenhum documento enviado</p>
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
                    required={category.obligation === 'obrigatorio'}
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
