import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Building2, Save, Send, FileText, Clock, Plus, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { documentCategories, processTypeOptions, getProcessTypeLabel } from "@/data/documentCategories";
import { ProcessType } from "@/types";

// Mock existing groups
const existingGroups = [
  { id: "grp-1", name: "Grupo Alpha Holdings" },
  { id: "grp-2", name: "Grupo Beta Participações" },
];

interface CompanyEntry {
  id: string;
  razaoSocial: string;
  cnpj: string;
}

export default function NovaEmpresaPage() {
  const navigate = useNavigate();
  const [cadastroMode, setCadastroMode] = useState<'individual' | 'grupo'>('individual');
  const [formData, setFormData] = useState({
    razaoSocial: "",
    cnpj: "",
    processType: "" as string,
    emailConvite: "",
    mensagemConvite: "Olá! Sua empresa foi cadastrada no Sistema de Cadastro. Clique no link abaixo para começar o processo de cadastro:",
  });

  // Individual company group linking
  const [vincularGrupo, setVincularGrupo] = useState(false);
  const [individualGroupId, setIndividualGroupId] = useState("");
  const [passaWorkflow, setPassaWorkflow] = useState<'sim' | 'nao' | ''>('');

  // Group-specific state
  const [groupMode, setGroupMode] = useState<'novo' | 'existente'>('novo');
  const [groupName, setGroupName] = useState("");
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [groupCompanies, setGroupCompanies] = useState<CompanyEntry[]>([
    { id: "gc-1", razaoSocial: "", cnpj: "" },
  ]);

  const [enviarConvite, setEnviarConvite] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCompanyId, setSavedCompanyId] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCNPJ = (value: string) => {
    const cleanValue = value.replace(/\D/g, '');
    return cleanValue.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      '$1.$2.$3/$4-$5'
    );
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleInputChange("cnpj", formatCNPJ(e.target.value));
  };

  const addGroupCompany = () => {
    setGroupCompanies(prev => [...prev, { id: `gc-${Date.now()}`, razaoSocial: "", cnpj: "" }]);
  };

  const removeGroupCompany = (id: string) => {
    if (groupCompanies.length > 1) {
      setGroupCompanies(prev => prev.filter(c => c.id !== id));
    }
  };

  const updateGroupCompany = (id: string, field: 'razaoSocial' | 'cnpj', value: string) => {
    setGroupCompanies(prev => prev.map(c =>
      c.id === id ? { ...c, [field]: field === 'cnpj' ? formatCNPJ(value) : value } : c
    ));
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

  const isFormValid = cadastroMode === 'individual'
    ? formData.razaoSocial && formData.cnpj && formData.processType
    : formData.processType && (groupMode === 'existente' ? selectedGroupId : groupName) && groupCompanies.every(c => c.razaoSocial && c.cnpj);

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
            <h1 className="text-2xl font-bold">
              {cadastroMode === 'grupo' ? 'Grupo Econômico Cadastrado' : 'Empresa Cadastrada'}
            </h1>
            <p className="text-muted-foreground">
              {cadastroMode === 'grupo'
                ? `${groupMode === 'novo' ? groupName : 'Grupo existente'} — ${getProcessTypeLabel(formData.processType)}`
                : `${formData.razaoSocial} — ${getProcessTypeLabel(formData.processType)}`
              }
            </p>
          </div>
        </div>

        <Card className="shadow-card border-success/30 bg-success-light">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-2">
              {cadastroMode === 'grupo' ? (
                <Users className="h-5 w-5 text-success" />
              ) : (
                <Building2 className="h-5 w-5 text-success" />
              )}
              <h3 className="font-semibold text-success">
                {cadastroMode === 'grupo' ? 'Grupo econômico salvo com sucesso!' : 'Empresa salva com sucesso!'}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground">
              {cadastroMode === 'grupo'
                ? `O grupo com ${groupCompanies.length} empresa(s) foi cadastrado. Um único fluxo de aprovação será criado para todo o grupo.`
                : 'O cadastro foi enviado para análise. Abaixo estão os documentos pendentes do checklist.'
              }
            </p>
            {cadastroMode === 'grupo' && (
              <div className="mt-3 space-y-1">
                {groupCompanies.map(c => (
                  <div key={c.id} className="text-sm flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-medium">{c.razaoSocial}</span>
                    <span className="text-muted-foreground font-mono text-xs">{c.cnpj}</span>
                  </div>
                ))}
              </div>
            )}
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
          <h1 className="text-2xl font-bold">Novo Cadastro</h1>
          <p className="text-muted-foreground">Cadastre uma empresa individual ou um grupo econômico</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Mode selection */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Tipo de Cadastro</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={cadastroMode} onValueChange={(v) => setCadastroMode(v as 'individual' | 'grupo')} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="individual" id="individual" />
                <Label htmlFor="individual" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  Empresa Individual
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="grupo" id="grupo" />
                <Label htmlFor="grupo" className="flex items-center gap-2 cursor-pointer">
                  <Users className="h-4 w-4" />
                  Grupo Econômico
                </Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {cadastroMode === 'individual' ? (
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

                  <Separator />

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vincularGrupo"
                      checked={vincularGrupo}
                      onCheckedChange={(checked) => {
                        setVincularGrupo(checked as boolean);
                        if (!checked) {
                          setIndividualGroupId("");
                          setPassaWorkflow('');
                        }
                      }}
                    />
                    <Label htmlFor="vincularGrupo" className="text-sm cursor-pointer">
                      Vincular a um grupo econômico existente
                    </Label>
                  </div>

                  {vincularGrupo && (
                    <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                      <div className="space-y-2">
                        <Label>Grupo Econômico <span className="text-destructive">*</span></Label>
                        <Select value={individualGroupId} onValueChange={setIndividualGroupId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingGroups.map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {individualGroupId && (
                        <div className="space-y-3">
                          <Label>A empresa passará pelo Workflow? <span className="text-destructive">*</span></Label>
                          <RadioGroup value={passaWorkflow} onValueChange={(v) => setPassaWorkflow(v as 'sim' | 'nao')} className="flex gap-4">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="sim" id="workflow-sim" />
                              <Label htmlFor="workflow-sim" className="cursor-pointer">Sim</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="nao" id="workflow-nao" />
                              <Label htmlFor="workflow-nao" className="cursor-pointer">Não</Label>
                            </div>
                          </RadioGroup>
                          <p className="text-xs text-muted-foreground">
                            {passaWorkflow === 'sim'
                              ? 'A empresa será incluída no fluxo de aprovação do grupo.'
                              : passaWorkflow === 'nao'
                              ? 'A empresa será vinculada ao grupo, mas não passará pelo workflow de aprovação.'
                              : 'Defina se a empresa precisa passar pelo fluxo de aprovação do grupo.'}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Group info */}
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Grupo Econômico
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <RadioGroup value={groupMode} onValueChange={(v) => setGroupMode(v as 'novo' | 'existente')} className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="novo" id="novo-grupo" />
                        <Label htmlFor="novo-grupo" className="cursor-pointer">Criar Novo Grupo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="existente" id="existente-grupo" />
                        <Label htmlFor="existente-grupo" className="cursor-pointer">Vincular a Grupo Existente</Label>
                      </div>
                    </RadioGroup>

                    {groupMode === 'novo' ? (
                      <div className="space-y-2">
                        <Label>Nome do Grupo <span className="text-destructive">*</span></Label>
                        <Input
                          placeholder="Ex: Grupo Alpha Holdings"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label>Grupo Existente <span className="text-destructive">*</span></Label>
                        <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            {existingGroups.map(g => (
                              <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Tipo de Processo <span className="text-destructive">*</span></Label>
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

                {/* Companies in the group */}
                <Card className="shadow-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        Empresas do Grupo
                      </CardTitle>
                      <Badge variant="secondary">{groupCompanies.length} empresa(s)</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {groupCompanies.map((company, index) => (
                      <div key={company.id} className="p-4 border border-border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">Empresa {index + 1}</span>
                          {groupCompanies.length > 1 && (
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeGroupCompany(company.id)}>
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <Label className="text-xs">Razão Social <span className="text-destructive">*</span></Label>
                            <Input
                              placeholder="Razão Social"
                              value={company.razaoSocial}
                              onChange={(e) => updateGroupCompany(company.id, 'razaoSocial', e.target.value)}
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">CNPJ <span className="text-destructive">*</span></Label>
                            <Input
                              placeholder="00.000.000/0000-00"
                              value={company.cnpj}
                              maxLength={18}
                              onChange={(e) => updateGroupCompany(company.id, 'cnpj', e.target.value)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button type="button" variant="outline" className="w-full" onClick={addGroupCompany}>
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Empresa ao Grupo
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Todas as empresas do grupo passarão por um único fluxo de aprovação.
                    </p>
                  </CardContent>
                </Card>
              </>
            )}

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
                        {doc.obligation === 'obrigatorio' && <Badge variant="outline" className="text-xs ml-auto">Obrigatório</Badge>}
                        {doc.obligation === 'condicional' && <Badge variant="outline" className="text-xs ml-auto bg-amber-50 text-amber-700 border-amber-200">Condicional</Badge>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    {pendingDocs.length} documentos obrigatórios serão solicitados após o cadastro.
                    {cadastroMode === 'grupo' && ' Documentos serão solicitados para cada empresa do grupo.'}
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
                {cadastroMode === 'grupo' ? 'Criar Grupo' : 'Criar Empresa'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
