import { useState, useEffect } from "react";
import { MessageSquare, FileText, Edit3, CheckCircle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Company } from "@/types";
import { documentCategories, getProcessTypeLabel } from "@/data/documentCategories";

interface DocumentType {
  id: string;
  name: string;
  category: string;
  obligation: string;
  isPending: boolean;
  description?: string;
}

const getAvailableDocuments = (processType: string): DocumentType[] => {
  return documentCategories
    .filter(doc => doc.processType === processType)
    .map(doc => ({
      id: doc.id,
      name: doc.name,
      category: doc.type,
      obligation: doc.obligation,
      isPending: true,
      description: doc.description
    }));
};

interface DocumentRequestModalProps {
  company: Company;
  onRequest: (companyId: string, selectedDocuments: string[], notes: string) => void;
}

export function DocumentRequestModal({ company, onRequest }: DocumentRequestModalProps) {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const availableDocuments = getAvailableDocuments(company.processType);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'empresa': return 'Documentos da Empresa';
      case 'socios': return 'Documentos dos Sócios';
      case 'financeira': return 'Documentos Financeiros';
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'empresa': return 'bg-primary/10 text-primary border-primary/20';
      case 'socios': return 'bg-info/10 text-info border-info/20';
      case 'financeira': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const generateMessage = () => {
    if (selectedDocuments.length === 0) {
      return "Prezado(a), para prosseguir com a análise do cadastro, necessitamos dos seguintes documentos:";
    }

    const selectedDocs = availableDocuments.filter(doc => selectedDocuments.includes(doc.id));
    const groupedByCategory = selectedDocs.reduce((acc, doc) => {
      if (!acc[doc.category]) acc[doc.category] = [];
      acc[doc.category].push(doc.name);
      return acc;
    }, {} as Record<string, string[]>);

    let message = "Prezado(a), para prosseguir com a análise do cadastro, necessitamos dos seguintes documentos:\n\n";

    Object.entries(groupedByCategory).forEach(([category, docs]) => {
      message += `📋 ${getCategoryLabel(category)}:\n`;
      docs.forEach(docName => {
        message += `• ${docName}\n`;
      });
      message += "\n";
    });

    message += "Por favor, envie os documentos através do sistema o mais breve possível.\n\n";
    message += "Atenciosamente,\nEquipe de Análise de Cadastro";

    return message;
  };

  useEffect(() => {
    if (!isEditingEmail) {
      setEmailTemplate(generateMessage());
    }
  }, [selectedDocuments, isEditingEmail]);

  const handleDocumentToggle = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    );
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === availableDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(availableDocuments.map(doc => doc.id));
    }
  };

  const handleRequest = () => {
    onRequest(company.id, selectedDocuments, emailTemplate);
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setOpen(false);
    setSelectedDocuments([]);
    setEmailTemplate("");
    setIsEditingEmail(false);
  };

  useEffect(() => {
    if (open) {
      setSelectedDocuments([]);
      setEmailTemplate("");
      setIsEditingEmail(false);
      setShowConfirmation(false);
    }
  }, [open]);

  const documentsByCategory = availableDocuments.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, DocumentType[]>);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-warning hover:bg-warning/90 text-warning-foreground"
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Solicitar Documentação
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        {showConfirmation ? (
          <div className="flex flex-col items-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <Mail className="h-8 w-8 text-success" />
            </div>
            <h3 className="text-xl font-semibold text-center">E-mail Enviado com Sucesso!</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              A solicitação de {selectedDocuments.length} documento{selectedDocuments.length !== 1 ? 's' : ''} foi enviada para <strong>{company.name}</strong>.
            </p>
            <div className="bg-muted/50 rounded-lg p-4 w-full max-w-md">
              <p className="text-xs text-muted-foreground mb-2">Documentos solicitados:</p>
              <ul className="space-y-1">
                {availableDocuments
                  .filter(doc => selectedDocuments.includes(doc.id))
                  .map(doc => (
                    <li key={doc.id} className="text-sm flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-success" />
                      {doc.name}
                    </li>
                  ))}
              </ul>
            </div>
            <Button onClick={handleCloseConfirmation} className="mt-4">
              Fechar
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Solicitar Documentação - {company.name}</DialogTitle>
              <p className="text-sm text-muted-foreground">
                Selecione os documentos que precisam ser enviados - {getProcessTypeLabel(company.processType)}
              </p>
            </DialogHeader>

            <div className="space-y-6">
              <div className="p-3 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">{company.name}</p>
                <p className="text-sm text-muted-foreground">CNPJ: {company.cnpj}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Documentos Disponíveis ({availableDocuments.length})</h4>
                  <Button variant="outline" size="sm" onClick={handleSelectAll}>
                    {selectedDocuments.length === availableDocuments.length ? "Desmarcar Todos" : "Selecionar Todos"}
                  </Button>
                </div>

                {Object.entries(documentsByCategory).map(([category, docs]) => (
                  <Card key={category} className="border-l-4 border-l-muted">
                    <CardContent className="pt-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="secondary" className={getCategoryColor(category)}>
                          {getCategoryLabel(category)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {docs.filter(doc => selectedDocuments.includes(doc.id)).length}/{docs.length}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {docs.map((doc) => (
                          <div key={doc.id} className="flex items-center space-x-3">
                            <Checkbox
                              id={`doc-${doc.id}`}
                              checked={selectedDocuments.includes(doc.id)}
                              onCheckedChange={() => handleDocumentToggle(doc.id)}
                            />
                            <label
                              htmlFor={`doc-${doc.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  {doc.name}
                                  {doc.obligation === 'obrigatorio' && (
                                    <Badge variant="destructive" className="text-xs px-1 py-0">
                                      Obrigatório
                                    </Badge>
                                  )}
                                  {doc.obligation === 'condicional' && (
                                    <Badge className="text-xs px-1 py-0 bg-amber-100 text-amber-700 border-amber-200">
                                      Condicional
                                    </Badge>
                                  )}
                                </div>
                                {doc.description && (
                                  <p className="text-xs text-muted-foreground ml-6">
                                    {doc.description}
                                  </p>
                                )}
                              </div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Modelo do e-mail ({selectedDocuments.length} documento{selectedDocuments.length !== 1 ? 's' : ''} selecionado{selectedDocuments.length !== 1 ? 's' : ''}):
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (isEditingEmail) {
                        setIsEditingEmail(false);
                        setEmailTemplate(generateMessage());
                      } else {
                        setIsEditingEmail(true);
                        setEmailTemplate(generateMessage());
                      }
                    }}
                  >
                    <Edit3 className="h-3 w-3 mr-1" />
                    {isEditingEmail ? "Restaurar modelo" : "Editar modelo"}
                  </Button>
                </div>

                {isEditingEmail ? (
                  <Textarea
                    value={emailTemplate}
                    onChange={(e) => setEmailTemplate(e.target.value)}
                    rows={10}
                    className="font-mono text-sm"
                    placeholder="Edite o modelo do e-mail..."
                  />
                ) : (
                  <div className="p-3 bg-muted/50 rounded-lg border text-sm whitespace-pre-line max-h-40 overflow-y-auto">
                    {emailTemplate || generateMessage()}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-border">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleRequest}
                  disabled={selectedDocuments.length === 0}
                  className="bg-warning hover:bg-warning/90 text-warning-foreground"
                >
                  Solicitar Documentação ({selectedDocuments.length})
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
