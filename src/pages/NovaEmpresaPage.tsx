import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Save, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const gerentes = [
  { id: "1", name: "João Silva" },
  { id: "2", name: "Maria Santos" },
  { id: "3", name: "Carlos Oliveira" },
];

export default function NovaEmpresaPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    razaoSocial: "",
    cnpj: "",
    gerenteId: "",
    emailConvite: "",
    mensagemConvite: "Olá! Sua empresa foi cadastrada no sistema M7 Crédito. Clique no link abaixo para começar o processo de cadastro:",
  });
  const [enviarConvite, setEnviarConvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    // Simular criação da empresa
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Gerar ID da nova empresa (simulado)
    const novaEmpresaId = Date.now().toString();

    if (enviarConvite && formData.emailConvite) {
      // Simular envio de convite
      console.log(`Convite enviado para: ${formData.emailConvite}`);
    }

    // Redirecionar para documentos da nova empresa
    navigate(`/documentos/${novaEmpresaId}`);
  };

  const isFormValid = formData.razaoSocial && formData.cnpj && formData.gerenteId;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/carteira">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Nova Empresa</h1>
          <p className="text-muted-foreground">Cadastre uma nova empresa na carteira comercial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações da Empresa */}
          <div className="lg:col-span-2">
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
                  <Label htmlFor="gerente">
                    Gerente Responsável <span className="text-destructive">*</span>
                  </Label>
                  <Select value={formData.gerenteId} onValueChange={(value) => handleInputChange("gerenteId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gerente responsável" />
                    </SelectTrigger>
                    <SelectContent>
                      {gerentes.map((gerente) => (
                        <SelectItem key={gerente.id} value={gerente.id}>
                          {gerente.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Convite por Email */}
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

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate("/carteira")}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={!isFormValid || isLoading}
            className="bg-gradient-primary hover:bg-primary-hover"
          >
            {isLoading ? (
              "Criando..."
            ) : (
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