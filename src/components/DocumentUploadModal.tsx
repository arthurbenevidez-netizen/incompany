import { useState } from "react";
import { Upload, X, FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface DocumentUploadModalProps {
  trigger: React.ReactNode;
  documentName: string;
  documentDescription: string;
  required: boolean;
  existingFiles?: Array<{
    id: string;
    fileName: string;
    uploadedAt: Date;
  }>;
  onUpload: (files: File[]) => void;
}

export default function DocumentUploadModal({
  trigger,
  documentName,
  documentDescription,
  required,
  existingFiles = [],
  onUpload
}: DocumentUploadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Selecione pelo menos um arquivo para enviar.",
        variant: "destructive",
      });
      return;
    }

    onUpload(selectedFiles);
    setSelectedFiles([]);
    setIsOpen(false);
    
    toast({
      title: "Documentos enviados",
      description: `${selectedFiles.length} arquivo(s) enviado(s) com sucesso.`,
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            {existingFiles.length > 0 ? 'Substituir' : 'Enviar'} Documento
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Document Info */}
          <div className="p-4 bg-muted/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold">{documentName}</h3>
              {required && (
                <Badge variant="outline" className="text-xs">Obrigatório</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{documentDescription}</p>
          </div>

          {/* Existing Files */}
          {existingFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Arquivos atuais:</h4>
              <div className="space-y-2">
                {existingFiles.map((file) => (
                  <div key={file.id} className="flex items-center gap-3 p-3 bg-muted/10 rounded-lg">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{file.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        Enviado em {file.uploadedAt.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Area */}
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-border hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
            />
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Upload className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Arraste arquivos aqui ou clique para selecionar
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Suporte: PDF, DOC, DOCX, JPG, PNG, XLS, XLSX
                </p>
              </div>
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Arquivos selecionados:</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-primary" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpload} disabled={selectedFiles.length === 0}>
              <Upload className="h-4 w-4 mr-2" />
              {existingFiles.length > 0 ? 'Substituir' : 'Enviar'} Documentos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
