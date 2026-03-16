import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Save, Send, FileText, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { documentCategories, processTypeOptions, getProcessTypeLabel } from "@/data/documentCategories";
import { ProcessType } from "@/types";

export default function NovaEmpresaPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    razaoSocial: "",
    cnpj: "",
    processType: "" as string,
    emailConvite: "",
    mensagemConvite: "Olá! Sua empresa foi cadastrada no sistema M7 Crédito. Clique no link abaixo para começar o processo de cadastro:",
  });
  const [enviarConvite, setEnviarConvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCompanyId, setSavedCompanyId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    const formattedValue = cleanValue.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
    return formattedValue;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    handleInputChange("cnpj", formatted);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const novaEmpresaId = Date.now().toString();
    setSavedCompanyId(novaEmpresaId);
    setIsSaved(true);

    if (enviarConvite && formData.emailConvite) {
      console.log(`Convite enviado para: ${formData.emailConvite}`);
    }

    setIsLoading(false);
  };

  const pendingDocs = formData.processType
    ? documentCategories.filter(doc => doc.processType === formData.processType && doc.obligation === 'obrigatorio')
    : [];

  const isFormValid = formData.razaoSocial && formData.cnpj && formData.processType;

  if (isSaved && savedCompanyId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/carteira">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar à Carteira
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Empresa Cadastrada</h1>
            <p className="text-muted-foreground">
              {formData.razaoSocial} — {getProcessTypeLabel(formData.processType)}
            </p>
          </div>
        </div>

        <Card className="shadow-card border-success/30 bg-success-light">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-5 w-5 text-success" />
              <h3 className="font-semibold text-success">Empresa salva com sucesso!</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              O cadastro foi enviado para análise. Abaixo estão os documentos pendentes do checklist.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              Documentos Pendentes ({pendingDocs.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingDocs.map((doc) => (
                <div key={doc.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <FileText className="h-4 w-4 text-warning mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{doc.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {doc.type === 'empresa' ? 'Empresa' : doc.type === 'socios' ? 'Sócios' : 'Financeiro'}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{doc.description}</p>
                  </div>
                  <Badge className="bg-pending-light text-pending text-xs">Pendente</Badge>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <Button className="bg-gradient-primary hover:bg-primary-hover" asChild>
                <Link to={`/documentos/${savedCompanyId}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Enviar Documentos
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/carteira">Voltar à Carteira</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Nova Empresa</h1>
          <p className="text-muted-foreground">Cadastre uma nova empresa na sua carteira comercial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="razaoSocial">
                    Razão Social <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="razaoSocial"
                    placeholder="Ex: Tech Solutions LTDA"
                    value={formData.razaoSocial}
                    onChange={(e) => handleInputChange("razaoSocial", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">
                    CNPJ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={formData.cnpj}
                    onChange={handleCNPJChange}
                    maxLength={18}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processType">
                    Tipo de Processo <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.processType} onValueChange={(value) => handleInputChange("processType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de processo" />
                    </SelectTrigger>
                    <SelectContent>
                      {processTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Preview do Checklist */}
            {formData.processType && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4" />
                    Checklist de Documentos — {getProcessTypeLabel(formData.processType)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pendingDocs.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-2 text-sm p-2 bg-muted/30 rounded">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span>{doc.name}</span>
                        {doc.required && <Badge variant="outline" className="text-xs ml-auto">Obrigatório</Badge>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {pendingDocs.length} documentos obrigatórios serão solicitados após o cadastro.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Convite por Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="enviarConvite"
                    checked={enviarConvite}
                    onCheckedChange={(checked) => setEnviarConvite(checked as boolean)}
                  />
                  <Label htmlFor="enviarConvite" className="text-sm">
                    Enviar convite por email
                  </Label>
                </div>

                {enviarConvite && (
                  <div className="space-y-4 pt-2">
                    <Separator />
                    <div className="space-y-2">
                      <Label htmlFor="emailConvite">Email do destinatário</Label>
                      <Input
                        id="emailConvite"
                        type="email"
                        placeholder="contato@empresa.com"
                        value={formData.emailConvite}
                        onChange={(e) => handleInputChange("emailConvite", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensagemConvite">Mensagem</Label>
                      <Textarea
                        id="mensagemConvite"
                        value={formData.mensagemConvite}
                        onChange={(e) => handleInputChange("mensagemConvite", e.target.value)}
                        rows={4}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate("/carteira")}>
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            {isLoading ? "Criando..." : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Criar Empresa
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
