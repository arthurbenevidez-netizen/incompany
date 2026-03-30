import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Upload, FileText, Check, Clock, AlertTriangle, Shield, Building2, Timer, CheckCircle2, Info, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { DocumentCategory, DocumentFile } from "@/types";
import { documentCategories, getObligationLabel, getSectionLabel } from "@/data/documentCategories";
import DocumentUploadModal from "@/components/DocumentUploadModal";
import ClienteOnboardingModal from "@/components/ClienteOnboardingModal";

// Mock data for single company
const mockSingleInvite = {
  companyName: "Tech Solutions LTDA",
  cnpj: "12.345.678/0001-90",
  processType: "cadastro_cedente" as const,
  companySubtype: "ltda" as "ltda" | "sa",
  managerName: "João Silva",
  inviteSentAt: new Date(Date.now() - 3600000),
  inviteExpiresAt: new Date(Date.now() + 82800000),
};

// Mock data for economic group
const mockGroupInvite = {
  groupName: "Grupo Delta Participações",
  processType: "cadastro_cedente" as const,
  companySubtype: "ltda" as "ltda" | "sa",
  managerName: "Maria Santos",
  inviteSentAt: new Date(Date.now() - 7200000),
  inviteExpiresAt: new Date(Date.now() + 79200000),
  members: [
    { id: "delta-1", name: "Delta Comércio Ltda", cnpj: "44.555.666/0001-11" },
    { id: "delta-2", name: "Delta Logística S.A.", cnpj: "44.555.666/0002-02" },
    { id: "delta-3", name: "Delta Serviços Ltda", cnpj: "44.555.666/0003-93" },
  ],
};

interface UploadedDoc {
  categoryId: string;
  files: DocumentFile[];
  savedAt: Date;
  memberId?: string; // for group: which member this doc belongs to
}

type PortalMode = null | 'empresa' | 'grupo';

export default function ClientePortalPage() {
  const { token } = useParams();
  const [portalMode, setPortalMode] = useState<PortalMode>(null);
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
  const [timeRemaining, setTimeRemaining] = useState("");
  const [isExpired, setIsExpired] = useState(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [clienteData, setClienteData] = useState<{ nome: string; cpf: string; razaoSocial: string; cnpj: string } | null>(null);
  const [selectedMemberIndex, setSelectedMemberIndex] = useState(0);

  const data = portalMode === 'grupo' ? {
    companyName: mockGroupInvite.groupName,
    cnpj: mockGroupInvite.members[0].cnpj,
    processType: mockGroupInvite.processType,
    companySubtype: mockGroupInvite.companySubtype,
    managerName: mockGroupInvite.managerName,
    inviteSentAt: mockGroupInvite.inviteSentAt,
    inviteExpiresAt: mockGroupInvite.inviteExpiresAt,
  } : mockSingleInvite;

  // Countdown timer
  useEffect(() => {
    const expiresAt = portalMode === 'grupo' ? mockGroupInvite.inviteExpiresAt : mockSingleInvite.inviteExpiresAt;
    const update = () => {
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();
      if (diff <= 0) {
        setIsExpired(true);
        setTimeRemaining("Expirado");
        return;
      }
      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeRemaining(`${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [portalMode]);

  // Filter categories for this process type
  const relevantCategories = documentCategories.filter(
    (cat) => cat.processType === data.processType
  );
  const filteredCategories = relevantCategories.filter((cat) => {
    if (!cat.subtypeCondition) return true;
    return cat.subtypeCondition === data.companySubtype;
  });

  // Group by section type
  const groupedCategories = filteredCategories.reduce<Record<string, DocumentCategory[]>>(
    (acc, cat) => {
      if (!acc[cat.type]) acc[cat.type] = [];
      acc[cat.type].push(cat);
      return acc;
    },
    {}
  );

  const sectionOrder = ["financeira", "empresa", "socios", "complementar", "analise_estruturacao", "documentacao_sacado", "convenio"];
  const orderedSections = sectionOrder.filter((s) => groupedCategories[s]);

  const currentMemberId = portalMode === 'grupo' ? mockGroupInvite.members[selectedMemberIndex].id : undefined;

  const getUploadedDoc = (categoryId: string) =>
    uploadedDocs.find((d) => d.categoryId === categoryId && d.memberId === currentMemberId);

  const handleUpload = (categoryId: string, files: File[]) => {
    if (isExpired) {
      toast.error("O prazo para envio de documentos expirou.");
      return;
    }
    const newFiles: DocumentFile[] = files.map((f, i) => ({
      id: `${categoryId}-${Date.now()}-${i}`,
      fileName: f.name,
      fileUrl: "#",
      uploadedAt: new Date(),
    }));

    setUploadedDocs((prev) => {
      const existing = prev.find((d) => d.categoryId === categoryId && d.memberId === currentMemberId);
      if (existing) {
        return prev.map((d) =>
          d.categoryId === categoryId && d.memberId === currentMemberId
            ? { ...d, files: [...d.files, ...newFiles], savedAt: new Date() }
            : d
        );
      }
      return [...prev, { categoryId, files: newFiles, savedAt: new Date(), memberId: currentMemberId }];
    });
    toast.success(`Documento enviado com sucesso!`);
  };

  const handleSaveAll = () => {
    if (isExpired) {
      toast.error("O prazo para envio expirou.");
      return;
    }
    setSavedAt(new Date());
    toast.success("Todos os documentos foram salvos com sucesso!");
  };

  // Progress calculation
  const requiredCategories = filteredCategories.filter((c) => c.obligation === "obrigatorio");

  const getProgressForMember = (memberId?: string) => {
    const uploaded = requiredCategories.filter((c) =>
      uploadedDocs.some((d) => d.categoryId === c.id && d.memberId === memberId)
    );
    return requiredCategories.length > 0
      ? Math.round((uploaded.length / requiredCategories.length) * 100)
      : 0;
  };

  const uploadedRequired = requiredCategories.filter((c) => getUploadedDoc(c.id));
  const progress = portalMode === 'grupo'
    ? Math.round(mockGroupInvite.members.reduce((sum, m) => sum + getProgressForMember(m.id), 0) / mockGroupInvite.members.length)
    : getProgressForMember(undefined);

  const currentMemberProgress = portalMode === 'grupo' ? getProgressForMember(currentMemberId) : progress;

  const getObligationBadge = (obligation: string) => {
    switch (obligation) {
      case "obrigatorio":
        return <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs">✅ Obrigatório</Badge>;
      case "condicional":
        return <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">🔀 Condicional</Badge>;
      case "opcional":
        return <Badge className="bg-slate-50 text-slate-500 border border-slate-200 text-xs">📎 Opcional</Badge>;
      default:
        return null;
    }
  };

  const getTimerColor = () => {
    if (isExpired) return "text-destructive";
    const diff = data.inviteExpiresAt.getTime() - Date.now();
    if (diff < 3600000) return "text-destructive";
    if (diff < 10800000) return "text-warning";
    return "text-emerald-600";
  };

  // Mode selection screen
  if (portalMode === null && !showOnboarding && clienteData) {
    return (
      <div className="min-h-screen bg-muted/30">
        {/* Top bar */}
        <div className="bg-background border-b border-border sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">SC</span>
              </div>
              <div>
                <h1 className="font-semibold text-sm">Sistema de Cadastro</h1>
                <p className="text-xs text-muted-foreground">Portal do Cliente</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-12 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Bem-vindo, {clienteData.nome}!</h1>
            <p className="text-muted-foreground text-lg">Selecione o tipo de cadastro para continuar</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Single Company */}
            <Card 
              className="cursor-pointer border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
              onClick={() => setPortalMode('empresa')}
            >
              <CardContent className="py-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Cadastro de Empresa</h2>
                  <p className="text-sm text-muted-foreground">
                    Envie a documentação para uma única empresa. Ideal para cadastros individuais.
                  </p>
                </div>
                <div className="pt-2">
                  <Badge variant="outline" className="text-xs">
                    {mockSingleInvite.companyName}
                  </Badge>
                </div>
                <Button className="w-full mt-2">
                  <Building2 className="h-4 w-4 mr-2" />
                  Iniciar Cadastro
                </Button>
              </CardContent>
            </Card>

            {/* Economic Group */}
            <Card 
              className="cursor-pointer border-2 hover:border-primary/50 transition-all hover:shadow-lg group"
              onClick={() => setPortalMode('grupo')}
            >
              <CardContent className="py-8 flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-bold">Cadastro de Grupo Econômico</h2>
                  <p className="text-sm text-muted-foreground">
                    Envie a documentação de várias empresas vinculadas a um mesmo grupo econômico.
                  </p>
                </div>
                <div className="pt-2 flex flex-wrap gap-1 justify-center">
                  <Badge variant="outline" className="text-xs">{mockGroupInvite.groupName}</Badge>
                  <Badge variant="secondary" className="text-xs">{mockGroupInvite.members.length} empresas</Badge>
                </div>
                <Button className="w-full mt-2">
                  <Users className="h-4 w-4 mr-2" />
                  Iniciar Cadastro do Grupo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <ClienteOnboardingModal
        open={showOnboarding}
        onComplete={(formData) => {
          setClienteData(formData);
          setShowOnboarding(false);
          toast.success(`Bem-vindo, ${formData.nome}!`);
        }}
      />
      {/* Top bar */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {portalMode !== null && (
              <Button variant="ghost" size="sm" onClick={() => setPortalMode(null)} className="mr-1">
                ← Voltar
              </Button>
            )}
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SC</span>
            </div>
            <div>
              <h1 className="font-semibold text-sm">Sistema de Cadastro</h1>
              <p className="text-xs text-muted-foreground">Portal do Cliente</p>
            </div>
          </div>
          <div className={`flex items-center gap-2 font-mono text-lg font-bold ${getTimerColor()}`}>
            <Timer className="h-5 w-5" />
            <span>{timeRemaining}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Expired banner */}
        {isExpired && (
          <Card className="border-destructive bg-destructive/5">
            <CardContent className="py-4 flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div>
                <p className="font-medium text-destructive">Prazo expirado</p>
                <p className="text-sm text-muted-foreground">
                  O prazo para envio de documentos expirou. Entre em contato com seu gerente comercial para solicitar um novo convite.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Company/Group info + progress */}
        <Card>
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row gap-6 justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {portalMode === 'grupo' ? (
                    <Users className="h-5 w-5 text-primary" />
                  ) : (
                    <Building2 className="h-5 w-5 text-primary" />
                  )}
                  <h2 className="text-xl font-bold">{data.companyName}</h2>
                  {portalMode === 'grupo' && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Users className="h-3 w-3" />
                      Grupo Econômico
                    </Badge>
                  )}
                </div>
                {portalMode !== 'grupo' && (
                  <p className="text-sm text-muted-foreground">CNPJ: {data.cnpj}</p>
                )}
                {portalMode === 'grupo' && (
                  <p className="text-sm text-muted-foreground">
                    {mockGroupInvite.members.length} empresas vinculadas
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Gerente Comercial: <span className="font-medium text-foreground">{data.managerName}</span>
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Convite enviado em {data.inviteSentAt.toLocaleDateString("pt-BR")} às {data.inviteSentAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              <div className="space-y-3 min-w-[200px]">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">
                      {portalMode === 'grupo' ? 'Progresso Geral' : 'Progresso'}
                    </span>
                    <span className="text-sm font-bold text-primary">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-3" />
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  {portalMode === 'grupo' ? (
                    <>
                      <p>Progresso médio de {mockGroupInvite.members.length} empresas</p>
                      <p>{uploadedDocs.length} documentos enviados no total</p>
                    </>
                  ) : (
                    <>
                      <p>{uploadedRequired.length} de {requiredCategories.length} obrigatórios enviados</p>
                      <p>{uploadedDocs.length} de {filteredCategories.length} documentos no total</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Group member selector */}
        {portalMode === 'grupo' && (
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Selecione a empresa para enviar documentos</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mockGroupInvite.members.map((member, index) => {
                  const memberProgress = getProgressForMember(member.id);
                  const memberDocsCount = uploadedDocs.filter(d => d.memberId === member.id).length;
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedMemberIndex(index)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all text-sm ${
                        index === selectedMemberIndex
                          ? 'border-primary bg-primary/5 text-primary font-medium shadow-sm'
                          : 'border-border hover:border-primary/30 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Building2 className="h-3.5 w-3.5" />
                      <div className="text-left">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-xs opacity-70">{member.cnpj}</p>
                      </div>
                      <Badge variant="outline" className={`ml-2 text-xs px-1.5 py-0 ${memberProgress === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}`}>
                        {memberProgress}%
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current member info (group only) */}
        {portalMode === 'grupo' && (
          <div className="flex items-center gap-3 px-1">
            <Building2 className="h-4 w-4 text-primary" />
            <span className="font-semibold">{mockGroupInvite.members[selectedMemberIndex].name}</span>
            <span className="text-sm text-muted-foreground">— CNPJ: {mockGroupInvite.members[selectedMemberIndex].cnpj}</span>
            <div className="flex-1" />
            <span className="text-sm text-muted-foreground">
              Progresso: <span className="font-bold text-primary">{currentMemberProgress}%</span>
            </span>
          </div>
        )}

        {/* Instructions */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="py-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-primary">Como funciona</p>
              <p className="text-muted-foreground">
                {portalMode === 'grupo' ? (
                  <>Selecione cada empresa do grupo acima e envie os documentos correspondentes. Documentos marcados como <strong>Obrigatório</strong> devem ser enviados para todas as empresas. Após completar todas, clique em <strong>"Salvar e Finalizar"</strong>.</>
                ) : (
                  <>Envie os documentos listados abaixo conforme a obrigatoriedade indicada. Documentos marcados como <strong>Obrigatório</strong> devem ser enviados para que o cadastro seja considerado completo. Após enviar todos os documentos, clique em <strong>"Salvar e Finalizar"</strong>.</>
                )}
              </p>
              <p className={`font-medium ${getTimerColor()}`}>
                Você tem até {data.inviteExpiresAt.toLocaleDateString("pt-BR")} às {data.inviteExpiresAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })} para concluir o envio.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Document sections */}
        {orderedSections.map((sectionType) => {
          const cats = groupedCategories[sectionType];
          return (
            <div key={sectionType} className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {getSectionLabel(sectionType)}
              </h3>
              <div className="space-y-3">
                {cats.map((cat) => {
                  const uploaded = getUploadedDoc(cat.id);
                  return (
                    <Card key={cat.id} className={`transition-all duration-200 ${uploaded ? "border-emerald-200 bg-emerald-50/30" : ""}`}>
                      <CardContent className="py-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {uploaded ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                              ) : (
                                <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="font-medium text-sm">{cat.name}</span>
                              {getObligationBadge(cat.obligation)}
                            </div>
                            <p className="text-xs text-muted-foreground pl-6">{cat.description}</p>

                            {cat.observations && cat.observations.length > 0 && (
                              <div className="pl-6 space-y-1">
                                {cat.observations.map((obs, i) => (
                                  <p key={i} className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 inline-block mr-1">
                                    ⚠️ {obs}
                                  </p>
                                ))}
                              </div>
                            )}

                            {cat.link && (
                              <a
                                href={cat.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="pl-6 text-xs text-primary hover:underline inline-flex items-center gap-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                                Acessar portal
                              </a>
                            )}

                            {uploaded && (
                              <div className="pl-6 space-y-1">
                                {uploaded.files.map((f) => (
                                  <div key={f.id} className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded px-2 py-1.5">
                                    <Check className="h-3 w-3" />
                                    <span className="font-medium">{f.fileName}</span>
                                    <span className="text-emerald-500">
                                      — {f.uploadedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="flex-shrink-0">
                            <DocumentUploadModal
                              trigger={
                                <Button
                                  size="sm"
                                  variant={uploaded ? "outline" : "default"}
                                  disabled={isExpired}
                                  className={uploaded ? "" : "bg-primary hover:bg-primary/90"}
                                >
                                  <Upload className="h-3.5 w-3.5 mr-1.5" />
                                  {uploaded ? "Adicionar" : "Enviar"}
                                </Button>
                              }
                              documentName={cat.name}
                              documentDescription={cat.description}
                              required={cat.obligation === "obrigatorio"}
                              existingFiles={uploaded?.files || []}
                              onUpload={(files) => handleUpload(cat.id, files)}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Footer actions */}
        <Card className="border-t-4 border-t-primary">
          <CardContent className="py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted-foreground">
                {savedAt ? (
                  <span className="text-emerald-600 font-medium flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4" />
                    Último salvamento: {savedAt.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                ) : (
                  "Nenhum salvamento realizado ainda."
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSavedAt(new Date());
                    toast.success("Progresso salvo! Você pode continuar depois.");
                  }}
                  disabled={isExpired || uploadedDocs.length === 0}
                >
                  Salvar Rascunho
                </Button>
                <Button
                  onClick={handleSaveAll}
                  disabled={isExpired || uploadedDocs.length === 0}
                  className="bg-primary hover:bg-primary/90"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Salvar e Finalizar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
