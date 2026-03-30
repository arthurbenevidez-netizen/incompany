import { useState } from "react";
import { Plus, Eye, ChevronDown, ChevronUp, FileText, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ChevronLeft, ChevronRight, X } from "lucide-react";

interface DocumentItem {
  id: string;
  fileName: string;
  companyName: string;
  uploadedAt: Date;
}

interface DocumentType {
  name: string;
  items: DocumentItem[];
}

interface WorkflowDocumentsProps {
  documents: string[];
  isGroup?: boolean;
  groupCompanies?: string[];
}

// Generate mock document items for a document type
const generateDocItems = (docName: string, companies: string[]): DocumentItem[] => {
  return companies.map((company, i) => ({
    id: `${docName}-${i}`,
    fileName: `${docName.replace(/\s/g, '_')}_${company.replace(/\s/g, '_')}.pdf`,
    companyName: company,
    uploadedAt: new Date(2026, 2, 10 + i),
  }));
};

// Company color mapping for visual flags
const companyColors = [
  { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" },
  { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
];

export const WorkflowDocuments = ({ documents, isGroup, groupCompanies }: WorkflowDocumentsProps) => {
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'single' | 'unified'>('single');
  const [previewDocType, setPreviewDocType] = useState<string>("");
  const [previewItems, setPreviewItems] = useState<DocumentItem[]>([]);
  const [currentPreviewIndex, setCurrentPreviewIndex] = useState(0);

  const companies = isGroup && groupCompanies ? groupCompanies : ["Empresa"];

  const getCompanyColor = (companyName: string) => {
    const index = companies.indexOf(companyName);
    return companyColors[index % companyColors.length];
  };

  const docTypes: DocumentType[] = documents.map(doc => ({
    name: doc,
    items: isGroup ? generateDocItems(doc, companies) : [{
      id: `${doc}-0`,
      fileName: `${doc.replace(/\s/g, '_')}.pdf`,
      companyName: "Empresa",
      uploadedAt: new Date(2026, 2, 15),
    }],
  }));

  const toggleExpand = (docName: string) => {
    setExpandedDoc(prev => prev === docName ? null : docName);
  };

  const handlePreviewSingle = (item: DocumentItem, docName: string) => {
    setPreviewMode('single');
    setPreviewDocType(docName);
    setPreviewItems([item]);
    setCurrentPreviewIndex(0);
    setPreviewOpen(true);
  };

  const handlePreviewUnified = (docType: DocumentType) => {
    setPreviewMode('unified');
    setPreviewDocType(docType.name);
    setPreviewItems(docType.items);
    setCurrentPreviewIndex(0);
    setPreviewOpen(true);
  };

  return (
    <>
      <div className="bg-card border border-border rounded-lg p-5 w-[320px] shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Documentos</h3>
          <button className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors">
            <Plus className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Company legend (group only) */}
        {isGroup && groupCompanies && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground mb-2">Empresas do grupo</p>
            {groupCompanies.map((company, i) => {
              const color = companyColors[i % companyColors.length];
              return (
                <div key={company} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                  <span className="text-xs text-foreground">{company}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="space-y-1.5">
          {docTypes.map((docType) => {
            const isExpanded = expandedDoc === docType.name;
            return (
              <div key={docType.name}>
                <div
                  className="flex items-center justify-between px-3 py-2.5 border border-border rounded-md hover:bg-accent transition-colors cursor-pointer"
                  onClick={() => isGroup ? toggleExpand(docType.name) : handlePreviewSingle(docType.items[0], docType.name)}
                >
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm text-foreground truncate">{docType.name}</span>
                    {isGroup && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 shrink-0">
                        {docType.items.length}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {isGroup && (
                      <button
                        className="w-6 h-6 rounded flex items-center justify-center hover:bg-primary/10 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewUnified(docType);
                        }}
                        title="Visualizar todos os documentos deste tipo"
                      >
                        <Eye className="w-3.5 h-3.5 text-primary" />
                      </button>
                    )}
                    {!isGroup && (
                      <Eye className="w-3.5 h-3.5 text-primary" />
                    )}
                    {isGroup && (
                      isExpanded
                        ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                        : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* Expanded items for group */}
                {isGroup && isExpanded && (
                  <div className="ml-3 mt-1 space-y-1 border-l-2 border-border pl-3">
                    {docType.items.map((item) => {
                      const color = getCompanyColor(item.companyName);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-md hover:bg-accent transition-colors cursor-pointer text-sm"
                          onClick={() => handlePreviewSingle(item, docType.name)}
                        >
                          <div className={`w-2 h-2 rounded-full ${color.dot} shrink-0`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium truncate">{item.fileName}</p>
                            <p className={`text-[10px] ${color.text}`}>{item.companyName}</p>
                          </div>
                          <Eye className="w-3 h-3 text-muted-foreground shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl h-[80vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                {previewDocType}
                {previewMode === 'unified' && (
                  <Badge variant="secondary" className="text-xs">Visão Unificada</Badge>
                )}
              </DialogTitle>
              <Button variant="ghost" size="sm" onClick={() => setPreviewOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex h-full gap-4">
            {/* File List Sidebar */}
            <div className="w-80 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Arquivos ({previewItems.length})</h3>
              </div>
              
              <div className="space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
                {previewItems.map((file, index) => {
                  const color = isGroup ? getCompanyColor(file.companyName) : null;
                  return (
                    <Card 
                      key={file.id} 
                      className={`cursor-pointer transition-colors ${
                        index === currentPreviewIndex ? 'ring-2 ring-primary' : 'hover:bg-muted/20'
                      }`}
                      onClick={() => setCurrentPreviewIndex(index)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-3">
                          {color && <div className={`w-2.5 h-2.5 rounded-full ${color.dot} shrink-0`} />}
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{file.fileName}</p>
                            {isGroup && (
                              <p className={`text-xs ${color?.text || 'text-muted-foreground'}`}>
                                {file.companyName}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              {file.uploadedAt.toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Document Preview */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between p-3 border-b">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPreviewIndex(i => (i - 1 + previewItems.length) % previewItems.length)} disabled={previewItems.length <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPreviewIndex(i => (i + 1) % previewItems.length)} disabled={previewItems.length <= 1}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentPreviewIndex + 1} de {previewItems.length}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>

              <div className="flex-1 bg-muted/10 rounded-lg p-8 flex items-center justify-center">
                {previewItems[currentPreviewIndex] && (() => {
                  const item = previewItems[currentPreviewIndex];
                  const color = isGroup ? getCompanyColor(item.companyName) : null;
                  return (
                    <div className="text-center space-y-4">
                      <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                        <FileText className="h-12 w-12 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{item.fileName}</h3>
                        {isGroup && color && (
                          <div className="flex items-center justify-center gap-2 mt-1">
                            <div className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                            <span className={`text-sm font-medium ${color.text}`}>{item.companyName}</span>
                          </div>
                        )}
                        <p className="text-muted-foreground text-sm mt-1">
                          Enviado em {item.uploadedAt.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="p-4 bg-muted/20 rounded-lg max-w-md">
                        <p className="text-sm text-muted-foreground text-center">
                          <strong>Preview em desenvolvimento</strong><br />
                          Em breve você poderá visualizar documentos PDF, imagens e outros arquivos diretamente aqui.
                        </p>
                      </div>
                      <Button className="bg-primary hover:bg-primary/90">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar Arquivo
                      </Button>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
