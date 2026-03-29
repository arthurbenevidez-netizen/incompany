import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { EmpresaForm } from "@/components/forms/EmpresaForm";
import { SocioPFForm } from "@/components/forms/SocioPFForm";
import { SocioPJForm } from "@/components/forms/SocioPJForm";
import { ProcuradorForm } from "@/components/forms/ProcuradorForm";
import { toast } from "@/hooks/use-toast";
import { 
  Plus, Building2, User, Users, Briefcase, ArrowLeft, 
  Clock, CheckCircle2, PlayCircle, Pause, FileText,
  RefreshCcw, UserPlus, ArrowRight
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ProcessType } from "@/types";

// Types for the recruitment queue
type RecruitmentStatus = 'aguardando' | 'em_andamento' | 'pausado' | 'finalizado';

interface RecruitmentItem {
  id: string;
  companyName: string;
  cnpj: string;
  processType: ProcessType;
  managerName: string;
  approvedAt: Date;
  status: RecruitmentStatus;
  progress: number; // 0-100
  lastUpdated: Date;
  assignedTo?: string;
  notes?: string;
  stepsCompleted: number;
  totalSteps: number;
  startedAt?: Date;
  finishedAt?: Date;
}

// Mock data - companies approved in Análise de Cadastro
const mockRecruitmentQueue: RecruitmentItem[] = [
  {
    id: "rec-1",
    companyName: "Tech Solutions Ltda",
    cnpj: "12.345.678/0001-90",
    processType: "cadastro_cedente",
    managerName: "Carlos Silva",
    approvedAt: new Date(2024, 2, 20),
    status: "em_andamento",
    progress: 65,
    lastUpdated: new Date(2024, 2, 25),
    assignedTo: "Ana Souza",
    stepsCompleted: 4,
    totalSteps: 6,
    startedAt: new Date(2024, 2, 21),
  },
  {
    id: "rec-2",
    companyName: "Comércio Digital S.A.",
    cnpj: "98.765.432/0001-10",
    processType: "cadastro_cedente",
    managerName: "Maria Santos",
    approvedAt: new Date(2024, 2, 22),
    status: "aguardando",
    progress: 0,
    lastUpdated: new Date(2024, 2, 22),
    stepsCompleted: 0,
    totalSteps: 5,
  },
  {
    id: "rec-3",
    companyName: "Indústria Nacional Ltda",
    cnpj: "11.222.333/0001-44",
    processType: "atualizacao_cedente",
    managerName: "Carlos Silva",
    approvedAt: new Date(2024, 2, 18),
    status: "pausado",
    progress: 40,
    lastUpdated: new Date(2024, 2, 23),
    assignedTo: "Pedro Lima",
    notes: "Aguardando documentação complementar do sócio",
    stepsCompleted: 2,
    totalSteps: 5,
    startedAt: new Date(2024, 2, 19),
  },
  {
    id: "rec-4",
    companyName: "Logística Express Ltda",
    cnpj: "55.666.777/0001-88",
    processType: "cadastro_sacado",
    managerName: "Maria Santos",
    approvedAt: new Date(2024, 2, 15),
    status: "finalizado",
    progress: 100,
    lastUpdated: new Date(2024, 2, 26),
    assignedTo: "Ana Souza",
    stepsCompleted: 4,
    totalSteps: 4,
    startedAt: new Date(2024, 2, 16),
    finishedAt: new Date(2024, 2, 26),
  },
  {
    id: "rec-5",
    companyName: "Construtora Horizonte S.A.",
    cnpj: "33.444.555/0001-22",
    processType: "risco_sacado",
    managerName: "Carlos Silva",
    approvedAt: new Date(2024, 2, 24),
    status: "aguardando",
    progress: 0,
    lastUpdated: new Date(2024, 2, 24),
    stepsCompleted: 0,
    totalSteps: 6,
  },
  {
    id: "rec-6",
    companyName: "Serviços Integrados Ltda",
    cnpj: "77.888.999/0001-66",
    processType: "cadastro_cedente",
    managerName: "Maria Santos",
    approvedAt: new Date(2024, 2, 19),
    status: "em_andamento",
    progress: 30,
    lastUpdated: new Date(2024, 2, 26),
    assignedTo: "Pedro Lima",
    stepsCompleted: 2,
    totalSteps: 7,
    startedAt: new Date(2024, 2, 20),
  },
  {
    id: "rec-7",
    companyName: "Metalúrgica Progresso Ltda",
    cnpj: "88.999.111/0001-33",
    processType: "cadastro_cedente",
    managerName: "Roberto Ferreira",
    approvedAt: new Date(2024, 2, 10),
    status: "finalizado",
    progress: 100,
    lastUpdated: new Date(2024, 2, 18),
    assignedTo: "Ana Souza",
    stepsCompleted: 5,
    totalSteps: 5,
    startedAt: new Date(2024, 2, 11),
    finishedAt: new Date(2024, 2, 18),
  },
  {
    id: "rec-8",
    companyName: "Agro Safra S.A.",
    cnpj: "99.111.222/0001-44",
    processType: "risco_sacado",
    managerName: "Fernanda Oliveira",
    approvedAt: new Date(2024, 2, 12),
    status: "finalizado",
    progress: 100,
    lastUpdated: new Date(2024, 2, 22),
    assignedTo: "Pedro Lima",
    stepsCompleted: 6,
    totalSteps: 6,
    startedAt: new Date(2024, 2, 13),
    finishedAt: new Date(2024, 2, 22),
  },
  {
    id: "rec-9",
    companyName: "Energia Verde Ltda",
    cnpj: "10.222.333/0001-55",
    processType: "atualizacao_cedente",
    managerName: "Fernanda Oliveira",
    approvedAt: new Date(2024, 2, 25),
    status: "aguardando",
    progress: 0,
    lastUpdated: new Date(2024, 2, 25),
    stepsCompleted: 0,
    totalSteps: 5,
  },
  {
    id: "rec-10",
    companyName: "Transportes União Ltda",
    cnpj: "20.333.444/0001-66",
    processType: "cadastro_sacado",
    managerName: "Roberto Ferreira",
    approvedAt: new Date(2024, 2, 23),
    status: "em_andamento",
    progress: 50,
    lastUpdated: new Date(2024, 2, 27),
    assignedTo: "Ana Souza",
    stepsCompleted: 3,
    totalSteps: 6,
    startedAt: new Date(2024, 2, 24),
  },
  {
    id: "rec-11",
    companyName: "Farmacêutica Saúde Ltda",
    cnpj: "30.444.555/0001-77",
    processType: "cadastro_cedente",
    managerName: "Ana Paula Mendes",
    approvedAt: new Date(2024, 2, 8),
    status: "finalizado",
    progress: 100,
    lastUpdated: new Date(2024, 2, 14),
    assignedTo: "Pedro Lima",
    stepsCompleted: 4,
    totalSteps: 4,
    startedAt: new Date(2024, 2, 9),
    finishedAt: new Date(2024, 2, 14),
  },
  {
    id: "rec-12",
    companyName: "Têxtil Nordeste S.A.",
    cnpj: "40.555.666/0001-88",
    processType: "cadastro_cedente",
    managerName: "Ana Paula Mendes",
    approvedAt: new Date(2024, 2, 26),
    status: "aguardando",
    progress: 0,
    lastUpdated: new Date(2024, 2, 26),
    stepsCompleted: 0,
    totalSteps: 7,
  },
];

// === Document/Form types (kept from original) ===
interface DocumentBlock {
  id: string;
  name: string;
  uploaded: boolean;
}

interface Person {
  id: string;
  name: string;
  documents: DocumentBlock[];
  hasSpouse?: boolean;
  spouseDocuments?: DocumentBlock[];
}

interface EntityBlock {
  id: string;
  name: string;
  type: 'empresa' | 'socio_pf' | 'socio_pj' | 'procurador';
  documents?: DocumentBlock[];
  people?: Person[];
}

type FormStep = {
  type: 'documents' | 'empresa' | 'socio_pf' | 'socio_pj' | 'procurador';
  entityId?: string;
  personId?: string;
  personName?: string;
  hasSpouse?: boolean;
};

const getProcessTypeLabel = (type: ProcessType) => {
  switch (type) {
    case 'cadastro_cedente': return 'Cadastro de Cedente';
    case 'atualizacao_cedente': return 'Atualização de Cedente';
    case 'risco_sacado': return 'Risco Sacado';
    case 'cadastro_sacado': return 'Cadastro de Sacado';
  }
};

const getProcessIcon = (type: ProcessType) => {
  switch (type) {
    case 'cadastro_cedente': return <UserPlus className="h-4 w-4" />;
    case 'atualizacao_cedente': return <RefreshCcw className="h-4 w-4" />;
    case 'risco_sacado': return <FileText className="h-4 w-4" />;
    case 'cadastro_sacado': return <UserPlus className="h-4 w-4" />;
  }
};

const getStatusConfig = (status: RecruitmentStatus) => {
  switch (status) {
    case 'aguardando':
      return { label: 'Aguardando', icon: <Clock className="h-3.5 w-3.5" />, className: 'bg-amber-100 text-amber-800 border-amber-200' };
    case 'em_andamento':
      return { label: 'Em Andamento', icon: <PlayCircle className="h-3.5 w-3.5" />, className: 'bg-blue-100 text-blue-800 border-blue-200' };
    case 'pausado':
      return { label: 'Pausado', icon: <Pause className="h-3.5 w-3.5" />, className: 'bg-orange-100 text-orange-800 border-orange-200' };
    case 'finalizado':
      return { label: 'Finalizado', icon: <CheckCircle2 className="h-3.5 w-3.5" />, className: 'bg-green-100 text-green-800 border-green-200' };
  }
};

export default function RecrutamentoPage() {
  const [activeTab, setActiveTab] = useState<string>("aguardando");
  const [selectedCompany, setSelectedCompany] = useState<RecruitmentItem | null>(null);
  const [queue, setQueue] = useState(mockRecruitmentQueue);

  // === Form state (from original) ===
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formSteps, setFormSteps] = useState<FormStep[]>([{ type: 'documents' }]);
  const [entities, setEntities] = useState<EntityBlock[]>([]);

  const initializeEntities = () => {
    setEntities([
      {
        id: "empresa-1",
        name: "Empresa",
        type: "empresa",
        documents: [
          { id: "doc-1", name: "Contrato Social", uploaded: false },
          { id: "doc-2", name: "Cartão CNPJ", uploaded: false },
          { id: "doc-3", name: "Balanço Patrimonial", uploaded: false },
        ],
      },
      {
        id: "socio-pf-block",
        name: "Sócio PF",
        type: "socio_pf",
        people: [
          {
            id: "socio-pf-1",
            name: "Sócio PF 1",
            documents: [
              { id: "doc-4", name: "RG/CPF/CNH", uploaded: false },
              { id: "doc-5", name: "Comprovante de Residência", uploaded: false },
              { id: "doc-6", name: "Declaração de IR", uploaded: false },
            ],
            hasSpouse: false,
          },
        ],
      },
      {
        id: "socio-pj-block",
        name: "Sócio PJ",
        type: "socio_pj",
        people: [
          {
            id: "socio-pj-1",
            name: "Sócio PJ 1",
            documents: [
              { id: "doc-7", name: "Contrato Social", uploaded: false },
              { id: "doc-8", name: "Cartão CNPJ", uploaded: false },
              { id: "doc-9", name: "Balanço Patrimonial", uploaded: false },
            ],
          },
        ],
      },
      {
        id: "procurador-block",
        name: "Procurador",
        type: "procurador",
        people: [
          {
            id: "procurador-1",
            name: "Procurador 1",
            documents: [
              { id: "doc-10", name: "RG/CPF/CNH", uploaded: false },
              { id: "doc-11", name: "Procuração", uploaded: false },
              { id: "doc-12", name: "Comprovante de Residência", uploaded: false },
            ],
            hasSpouse: false,
          },
        ],
      },
    ]);
    setCurrentStepIndex(0);
    setFormSteps([{ type: 'documents' }]);
  };

  const handleOpenCompany = (item: RecruitmentItem) => {
    setSelectedCompany(item);
    initializeEntities();
    // Update status to em_andamento if aguardando
    if (item.status === 'aguardando') {
      setQueue(q => q.map(r => r.id === item.id ? { ...r, status: 'em_andamento' as RecruitmentStatus, lastUpdated: new Date() } : r));
    }
  };

  const handleBackToQueue = () => {
    setSelectedCompany(null);
    setCurrentStepIndex(0);
    setFormSteps([{ type: 'documents' }]);
  };

  const handlePauseItem = (id: string) => {
    setQueue(q => q.map(r => r.id === id ? { ...r, status: 'pausado' as RecruitmentStatus, lastUpdated: new Date() } : r));
    toast({ title: "Processo pausado", description: "O recrutamento foi pausado e pode ser retomado a qualquer momento." });
  };

  const handleResumeItem = (id: string) => {
    setQueue(q => q.map(r => r.id === id ? { ...r, status: 'em_andamento' as RecruitmentStatus, lastUpdated: new Date() } : r));
    toast({ title: "Processo retomado", description: "O recrutamento foi retomado." });
  };

  const handleFinalizeItem = (id: string) => {
    setQueue(q => q.map(r => r.id === id ? { ...r, status: 'finalizado' as RecruitmentStatus, progress: 100, stepsCompleted: r.totalSteps, lastUpdated: new Date() } : r));
    toast({ title: "Recrutamento finalizado!", description: "O cadastro foi concluído com sucesso." });
    setSelectedCompany(null);
  };

  // Filter queue by tab
  const filteredQueue = queue.filter(item => {
    if (activeTab === 'aguardando') return item.status === 'aguardando';
    if (activeTab === 'em_andamento') return item.status === 'em_andamento' || item.status === 'pausado';
    if (activeTab === 'finalizado') return item.status === 'finalizado';
    return true;
  });

  const counts = {
    aguardando: queue.filter(i => i.status === 'aguardando').length,
    em_andamento: queue.filter(i => i.status === 'em_andamento' || i.status === 'pausado').length,
    finalizado: queue.filter(i => i.status === 'finalizado').length,
  };

  // === Entity/form helpers (kept from original) ===
  const addPersonToBlock = (blockId: string, type: 'socio_pf' | 'socio_pj' | 'procurador') => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        const newCount = entity.people.length + 1;
        const newPerson: Person = {
          id: `${type}-${Date.now()}`,
          name: `${entity.name} ${newCount}`,
          documents: type === 'socio_pf' ? [
            { id: `doc-pf-${newCount}-1`, name: "RG/CPF/CNH", uploaded: false },
            { id: `doc-pf-${newCount}-2`, name: "Comprovante de Residência", uploaded: false },
            { id: `doc-pf-${newCount}-3`, name: "Declaração de IR", uploaded: false },
          ] : type === 'socio_pj' ? [
            { id: `doc-pj-${newCount}-1`, name: "Contrato Social", uploaded: false },
            { id: `doc-pj-${newCount}-2`, name: "Cartão CNPJ", uploaded: false },
            { id: `doc-pj-${newCount}-3`, name: "Balanço Patrimonial", uploaded: false },
          ] : [
            { id: `doc-proc-${newCount}-1`, name: "RG/CPF/CNH", uploaded: false },
            { id: `doc-proc-${newCount}-2`, name: "Procuração", uploaded: false },
            { id: `doc-proc-${newCount}-3`, name: "Comprovante de Residência", uploaded: false },
          ],
          hasSpouse: (type === 'socio_pf' || type === 'procurador') ? false : undefined,
        };
        return { ...entity, people: [...entity.people, newPerson] };
      }
      return entity;
    }));
  };

  const removePerson = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return { ...entity, people: entity.people.filter(p => p.id !== personId) };
      }
      return entity;
    }));
  };

  const addSpouse = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return {
          ...entity,
          people: entity.people.map(person => {
            if (person.id === personId) {
              return {
                ...person,
                hasSpouse: true,
                spouseDocuments: [
                  { id: `spouse-${personId}-1`, name: "RG/CPF/CNH", uploaded: false },
                  { id: `spouse-${personId}-2`, name: "Comprovante de Residência", uploaded: false },
                  { id: `spouse-${personId}-3`, name: "Certidão de Casamento", uploaded: false },
                ],
              };
            }
            return person;
          }),
        };
      }
      return entity;
    }));
  };

  const removeSpouse = (blockId: string, personId: string) => {
    setEntities(entities.map(entity => {
      if (entity.id === blockId && entity.people) {
        return {
          ...entity,
          people: entity.people.map(person => {
            if (person.id === personId) {
              return { ...person, hasSpouse: false, spouseDocuments: undefined };
            }
            return person;
          }),
        };
      }
      return entity;
    }));
  };

  const getIcon = (type: EntityBlock['type']) => {
    switch (type) {
      case 'empresa': return <Building2 className="h-5 w-5" />;
      case 'socio_pf': return <User className="h-5 w-5" />;
      case 'socio_pj': return <Building2 className="h-5 w-5" />;
      case 'procurador': return <Briefcase className="h-5 w-5" />;
    }
  };

  const canHaveSpouse = (type: EntityBlock['type']) => type === 'socio_pf' || type === 'procurador';

  const calculateProgress = (entity: EntityBlock) => {
    let total = 0, uploaded = 0;
    if (entity.documents) entity.documents.forEach(doc => { total++; if (doc.uploaded) uploaded++; });
    if (entity.people) entity.people.forEach(person => {
      person.documents.forEach(doc => { total++; if (doc.uploaded) uploaded++; });
      if (person.spouseDocuments) person.spouseDocuments.forEach(doc => { total++; if (doc.uploaded) uploaded++; });
    });
    return { uploaded, total };
  };

  const generateFormSteps = () => {
    const steps: FormStep[] = [{ type: 'documents' }];
    entities.forEach(entity => {
      if (entity.type === 'empresa') {
        steps.push({ type: 'empresa', entityId: entity.id });
      } else if (entity.people) {
        entity.people.forEach(person => {
          steps.push({
            type: entity.type as any,
            entityId: entity.id,
            personId: person.id,
            personName: person.name,
            hasSpouse: person.hasSpouse,
          });
        });
      }
    });
    setFormSteps(steps);
  };

  const handleContinue = () => {
    if (currentStepIndex === 0) {
      generateFormSteps();
      setCurrentStepIndex(1);
    } else if (currentStepIndex < formSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      if (selectedCompany) {
        handleFinalizeItem(selectedCompany.id);
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex(currentStepIndex - 1);
  };

  const handleFormSubmit = (data: any) => {
    console.log("Form data:", data);
    handleContinue();
  };

  const handleSaveAndPause = () => {
    if (selectedCompany) {
      handlePauseItem(selectedCompany.id);
      setSelectedCompany(null);
    }
  };

  // === Render form steps (when inside a company) ===
  if (selectedCompany) {
    const currentStep = formSteps[currentStepIndex];

    if (currentStep?.type === 'empresa') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackToQueue}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-3xl font-bold">Dados da Empresa</h1>
              <p className="text-muted-foreground">{selectedCompany.companyName} — Preencha as informações da empresa</p>
            </div>
          </div>
          <EmpresaForm onSubmit={handleFormSubmit} onBack={handleBack} />
        </div>
      );
    }

    if (currentStep?.type === 'socio_pf') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackToQueue}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-3xl font-bold">Dados do Sócio PF</h1>
              <p className="text-muted-foreground">{selectedCompany.companyName}</p>
            </div>
          </div>
          <SocioPFForm personName={currentStep.personName || "Sócio PF"} hasSpouse={currentStep.hasSpouse || false} onSubmit={handleFormSubmit} onBack={handleBack} />
        </div>
      );
    }

    if (currentStep?.type === 'socio_pj') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackToQueue}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-3xl font-bold">Dados do Sócio PJ</h1>
              <p className="text-muted-foreground">{selectedCompany.companyName}</p>
            </div>
          </div>
          <SocioPJForm personName={currentStep.personName || "Sócio PJ"} onSubmit={handleFormSubmit} onBack={handleBack} />
        </div>
      );
    }

    if (currentStep?.type === 'procurador') {
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBackToQueue}><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-3xl font-bold">Dados do Procurador</h1>
              <p className="text-muted-foreground">{selectedCompany.companyName}</p>
            </div>
          </div>
          <ProcuradorForm personName={currentStep.personName || "Procurador"} hasSpouse={currentStep.hasSpouse || false} onSubmit={handleFormSubmit} onBack={handleBack} />
        </div>
      );
    }

    // Document organization step (step 0)
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={handleBackToQueue}><ArrowLeft className="h-5 w-5" /></Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{selectedCompany.companyName}</h1>
            <p className="text-muted-foreground">
              {getProcessTypeLabel(selectedCompany.processType)} — Organize e envie a documentação necessária
            </p>
          </div>
          <Button variant="outline" onClick={handleSaveAndPause}>
            <Pause className="h-4 w-4 mr-2" />
            Salvar e Pausar
          </Button>
        </div>

        {/* Document blocks */}
        <div className="space-y-4">
          {entities.map((entity) => (
            <Card key={entity.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getIcon(entity.type)}
                    <CardTitle className="text-lg">{entity.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-3 min-w-[120px]">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="text-xs text-muted-foreground text-right">
                        {calculateProgress(entity).uploaded}/{calculateProgress(entity).total}
                      </div>
                      <Progress 
                        value={calculateProgress(entity).total > 0 
                          ? (calculateProgress(entity).uploaded / calculateProgress(entity).total) * 100 
                          : 0
                        } 
                        className="h-2"
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {entity.type === 'empresa' && entity.documents && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {entity.documents.map((doc) => (
                      <Card key={doc.id} className="border-dashed">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{doc.name}</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                              </p>
                            </div>
                            <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {entity.people && entity.people.map((person, index) => (
                  <div key={person.id} className="space-y-4">
                    {index > 0 && <div className="border-t pt-4" />}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{person.name}</h3>
                      <div className="flex items-center gap-2">
                        {canHaveSpouse(entity.type) && !person.hasSpouse && (
                          <Button variant="outline" size="sm" onClick={() => addSpouse(entity.id, person.id)}>
                            <Users className="h-4 w-4 mr-2" />Adicionar Cônjuge
                          </Button>
                        )}
                        {entity.people && entity.people.length > 1 && (
                          <Button variant="ghost" size="sm" onClick={() => removePerson(entity.id, person.id)}>Remover</Button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {person.documents.map((doc) => (
                        <Card key={doc.id} className="border-dashed">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{doc.name}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                                </p>
                              </div>
                              <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {person.hasSpouse && person.spouseDocuments && (
                      <Collapsible defaultOpen>
                        <div className="border-t pt-4 space-y-4">
                          <div className="flex items-center justify-between">
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Users className="h-4 w-4 mr-2" />Documentos do Cônjuge
                              </Button>
                            </CollapsibleTrigger>
                            <Button variant="ghost" size="sm" onClick={() => removeSpouse(entity.id, person.id)}>Remover Cônjuge</Button>
                          </div>
                          <CollapsibleContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                              {person.spouseDocuments.map((doc) => (
                                <Card key={doc.id} className="border-dashed">
                                  <CardContent className="p-4">
                                    <div className="flex items-center justify-between">
                                      <div className="flex-1">
                                        <h4 className="font-medium text-sm">{doc.name}</h4>
                                        <p className="text-xs text-muted-foreground mt-1">
                                          {doc.uploaded ? "Documento enviado" : "Nenhum documento enviado"}
                                        </p>
                                      </div>
                                      <Button variant="ghost" size="icon"><Plus className="h-4 w-4" /></Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    )}
                  </div>
                ))}

                {entity.type !== 'empresa' && (
                  <Button variant="outline" onClick={() => addPersonToBlock(entity.id, entity.type as 'socio_pf' | 'socio_pj' | 'procurador')} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />Adicionar {entity.name}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleSaveAndPause}>
            <Pause className="h-4 w-4 mr-2" />Salvar e Pausar
          </Button>
          <Button size="lg" className="px-8" onClick={handleContinue}>
            Continuar <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // === Queue view ===
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recrutamento</h1>
        <p className="text-muted-foreground mt-2">
          Fila de finalização de cadastro — empresas aprovadas na Análise de Cadastro
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-amber-100">
              <Clock className="h-5 w-5 text-amber-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.aguardando}</p>
              <p className="text-sm text-muted-foreground">Aguardando Início</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-blue-100">
              <PlayCircle className="h-5 w-5 text-blue-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.em_andamento}</p>
              <p className="text-sm text-muted-foreground">Em Andamento / Pausados</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="p-3 rounded-full bg-green-100">
              <CheckCircle2 className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="text-2xl font-bold">{counts.finalizado}</p>
              <p className="text-sm text-muted-foreground">Finalizados</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="aguardando">Aguardando ({counts.aguardando})</TabsTrigger>
          <TabsTrigger value="em_andamento">Em Andamento ({counts.em_andamento})</TabsTrigger>
          <TabsTrigger value="finalizado">Finalizados ({counts.finalizado})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Gerente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progresso</TableHead>
                    <TableHead>Atualizado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredQueue.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Nenhuma empresa nesta fila
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQueue.map((item) => {
                      const statusConfig = getStatusConfig(item.status);
                      return (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{item.companyName}</p>
                              <p className="text-xs text-muted-foreground">{item.cnpj}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Tooltip>
                              <TooltipTrigger>{getProcessIcon(item.processType)}</TooltipTrigger>
                              <TooltipContent>{getProcessTypeLabel(item.processType)}</TooltipContent>
                            </Tooltip>
                          </TableCell>
                          <TableCell className="text-sm">{item.managerName}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={statusConfig.className}>
                              <span className="flex items-center gap-1.5">
                                {statusConfig.icon}
                                {statusConfig.label}
                              </span>
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 min-w-[120px]">
                              <Progress value={item.progress} className="h-2 flex-1" />
                              <span className="text-xs text-muted-foreground whitespace-nowrap">
                                {item.stepsCompleted}/{item.totalSteps}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {item.lastUpdated.toLocaleDateString('pt-BR')}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {item.status === 'pausado' && (
                                <Button variant="outline" size="sm" onClick={() => handleResumeItem(item.id)}>
                                  <PlayCircle className="h-4 w-4 mr-1" />Retomar
                                </Button>
                              )}
                              {item.status !== 'finalizado' && (
                                <Button size="sm" onClick={() => handleOpenCompany(item)}>
                                  {item.status === 'aguardando' ? 'Iniciar' : 'Continuar'}
                                  <ArrowRight className="h-4 w-4 ml-1" />
                                </Button>
                              )}
                              {item.status === 'finalizado' && (
                                <Button variant="outline" size="sm" onClick={() => handleOpenCompany(item)}>
                                  Visualizar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
