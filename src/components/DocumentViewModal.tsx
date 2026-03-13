import { useState } from "react";
import { Eye, Download, FileText, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentFile {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date;
}

interface DocumentViewModalProps {
  trigger: React.ReactNode;
  documentName: string;
  files: DocumentFile[];
  status?: string;
}

export default function DocumentViewModal({
  trigger,
  documentName,
  files,
  status
}: DocumentViewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const currentFile = files[currentFileIndex];

  const nextFile = () => {
    setCurrentFileIndex((prev) => (prev + 1) % files.length);
  };

  const prevFile = () => {
    setCurrentFileIndex((prev) => (prev - 1 + files.length) % files.length);
  };

  const handleDownload = (file: DocumentFile) => {
    // Simulação de download - em produção seria o link real do arquivo
    const link = document.createElement('a');
    link.href = '#'; // Em produção seria file.fileUrl
    link.download = file.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[80vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              {documentName}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {status && getStatusBadge(status)}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex h-full gap-4">
          {/* File List Sidebar */}
          <div className="w-80 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Arquivos ({files.length})</h3>
            </div>
            
            <div className="space-y-2 max-h-[calc(100%-60px)] overflow-y-auto">
              {files.map((file, index) => (
                <Card 
                  key={file.id} 
                  className={`cursor-pointer transition-colors ${
                    index === currentFileIndex ? 'ring-2 ring-primary' : 'hover:bg-muted/20'
                  }`}
                  onClick={() => setCurrentFileIndex(index)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {file.uploadedAt.toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(file);
                        }}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Document Preview */}
          <div className="flex-1 flex flex-col">
            {/* Navigation */}
            <div className="flex items-center justify-between p-3 border-b">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevFile}
                  disabled={files.length <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextFile}
                  disabled={files.length <= 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentFileIndex + 1} de {files.length}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownload(currentFile)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar
                </Button>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-muted/10 rounded-lg p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <FileText className="h-12 w-12 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{currentFile.fileName}</h3>
                  <p className="text-muted-foreground text-sm">
                    Enviado em {currentFile.uploadedAt.toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="p-4 bg-muted/20 rounded-lg max-w-md">
                  <p className="text-sm text-muted-foreground text-center">
                    <strong>Preview em desenvolvimento</strong><br />
                    Em breve você poderá visualizar documentos PDF, imagens e outros arquivos diretamente aqui.
                  </p>
                </div>
                <Button 
                  onClick={() => handleDownload(currentFile)}
                  className="bg-primary hover:bg-primary-hover"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Baixar Arquivo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}