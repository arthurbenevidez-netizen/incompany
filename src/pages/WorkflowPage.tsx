import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { StepperProgress, WorkflowStep } from "@/components/workflow/StepperProgress";
import { WorkflowInfoPanel } from "@/components/workflow/WorkflowInfoPanel";
import { WorkflowRiskIndicators } from "@/components/workflow/WorkflowRiskIndicators";
import { WorkflowComments } from "@/components/workflow/WorkflowComments";
import { WorkflowHistory } from "@/components/workflow/WorkflowHistory";
import { WorkflowDocuments } from "@/components/workflow/WorkflowDocuments";

// Mock data
const mockWorkflowData: Record<string, {
  companyName: string;
  groupName?: string;
  groupCompanies?: { name: string; cnpj: string }[];
  steps: WorkflowStep[];
  etapa: string;
  responsavel: string;
  criadoEm: string;
  atualizadoEm: string;
  comments: { initials: string; name: string; content: React.ReactNode }[];
  history: { name: string; date: string; action: string }[];
  documents: string[];
  ratings: { credito: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D" | "NA"; compliance: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D" | "NA"; garantia: "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D" | "NA" };
}> = {
  "1": {
    companyName: "Tech Solutions LTDA",
    steps: [
      { label: "Recrutamento", status: "completed" },
      { label: "Formalização", status: "completed" },
      { label: "Comercial", status: "completed" },
      { label: "Diretoria Comercial", status: "current" },
      { label: "Comitê Redator", status: "pending" },
      { label: "Comitê de Crédito", status: "pending" },
      { label: "Cadastro Emissão", status: "pending" },
      { label: "Concluído", status: "pending" },
    ],
    etapa: "Diretoria Comercial",
    responsavel: "João Silva",
    criadoEm: "15/01/2026, 14:30",
    atualizadoEm: "28/03/2026, 09:15",
    ratings: { credito: "A", compliance: "AA", garantia: "BBB" },
    comments: [
      {
        initials: "RF",
        name: "Roberto Ferreira",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Empresa criada no sistema.</p>
            <p>Cadastro inicial realizado. Processo de habilitação em FIDC iniciado.</p>
          </div>
        ),
      },
      {
        initials: "AP",
        name: "Ana Paula Mendes",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Formalização aprovada.</p>
            <p>Documentação societária validada. Todos os documentos obrigatórios entregues.</p>
          </div>
        ),
      },
      {
        initials: "JS",
        name: "João Silva",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Etapa Comercial aprovada.</p>
            <p>Faturamento compatível com a operação solicitada. Encaminhado para Diretoria Comercial.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "João Silva", date: "28/03/2026 09:15", action: "Etapa Comercial Aprovada" },
      { name: "Ana Paula Mendes", date: "20/03/2026 16:40", action: "Etapa Formalização Aprovada" },
      { name: "Roberto Ferreira", date: "10/03/2026 11:22", action: "Etapa Recrutamento Concluída" },
      { name: "Roberto Ferreira", date: "15/01/2026 14:30", action: "Empresa criada no sistema" },
    ],
    documents: [
      "Contrato Social", "Balanço DRE", "Balancete", "Certidão Trabalhista",
      "Comprovante de Endereço", "Declaração de Faturamento", "Endividamento Financeiro",
      "Imposto de Renda", "CNPJ Atualizado",
    ],
  },
  "2": {
    companyName: "Grupo Alpha Holdings",
    groupName: "Grupo Alpha Holdings",
    groupCompanies: [
      { name: "Indústria ABC S.A.", cnpj: "12.345.678/0001-90" },
      { name: "ABC Logística LTDA", cnpj: "12.345.678/0002-71" },
    ],
    steps: [
      { label: "Recrutamento", status: "completed" },
      { label: "Formalização", status: "completed" },
      { label: "Comercial", status: "completed" },
      { label: "Diretoria Comercial", status: "completed" },
      { label: "Comitê Redator", status: "current" },
      { label: "Comitê de Crédito", status: "pending" },
      { label: "Cadastro Emissão", status: "pending" },
      { label: "Concluído", status: "pending" },
    ],
    etapa: "Comitê Redator",
    responsavel: "Fernanda Oliveira",
    criadoEm: "10/12/2025, 08:45",
    atualizadoEm: "27/03/2026, 14:10",
    ratings: { credito: "BB", compliance: "A", garantia: "CCC" },
    comments: [
      {
        initials: "RF",
        name: "Roberto Ferreira",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Grupo criado no sistema.</p>
            <p>Grupo composto por 2 empresas: Indústria ABC S.A. e ABC Logística LTDA.</p>
          </div>
        ),
      },
      {
        initials: "AP",
        name: "Ana Paula Mendes",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Formalização aprovada.</p>
            <p>Documentação societária e estatutária validada para ambas as empresas do grupo.</p>
          </div>
        ),
      },
      {
        initials: "CM",
        name: "Carlos Mendes",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Etapa Comercial aprovada.</p>
            <p>Serasa Indústria ABC: Sem restrições relevantes. Score 780.</p>
          </div>
        ),
      },
      {
        initials: "FO",
        name: "Fernanda Oliveira",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Diretoria Comercial aprovada.</p>
            <p>Operação aprovada pela diretoria. Encaminhado para Comitê Redator.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "Fernanda Oliveira", date: "27/03/2026 14:10", action: "Etapa Diretoria Comercial Aprovada" },
      { name: "Carlos Mendes", date: "15/03/2026 10:30", action: "Etapa Comercial Aprovada" },
      { name: "Ana Paula Mendes", date: "05/02/2026 09:00", action: "Etapa Formalização Aprovada" },
      { name: "Roberto Ferreira", date: "20/01/2026 15:45", action: "Etapa Recrutamento Concluída" },
      { name: "Roberto Ferreira", date: "10/12/2025 08:45", action: "Grupo criado no sistema" },
    ],
    documents: [
      "Estatuto Social", "Ata de Assembleia", "Balanço DRE", "Balancete",
      "Certidão Trabalhista", "Certidão de Casamento", "Comprovante de Endereço",
      "Declaração de Faturamento", "Endividamento Financeiro",
    ],
  },
  "5": {
    companyName: "Distribuidora Nacional LTDA",
    steps: [
      { label: "Recrutamento", status: "completed" },
      { label: "Formalização", status: "completed" },
      { label: "Comercial", status: "current" },
      { label: "Diretoria Comercial", status: "pending" },
      { label: "Comitê Redator", status: "pending" },
      { label: "Comitê de Crédito", status: "pending" },
      { label: "Cadastro Emissão", status: "pending" },
      { label: "Concluído", status: "pending" },
    ],
    etapa: "Comercial",
    responsavel: "Roberto Ferreira",
    criadoEm: "05/02/2026, 10:00",
    atualizadoEm: "25/03/2026, 11:30",
    ratings: { credito: "BBB", compliance: "BBB", garantia: "BB" },
    comments: [
      {
        initials: "AP",
        name: "Ana Paula Mendes",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Empresa criada no sistema.</p>
            <p>Distribuidora com faturamento anual de R$ 45M. Processo de habilitação iniciado.</p>
          </div>
        ),
      },
      {
        initials: "RF",
        name: "Roberto Ferreira",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Formalização aprovada.</p>
            <p>Documentação completa e sem pendências. Encaminhado para etapa Comercial.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "Roberto Ferreira", date: "25/03/2026 11:30", action: "Etapa Formalização Aprovada" },
      { name: "Ana Paula Mendes", date: "10/03/2026 08:15", action: "Etapa Recrutamento Concluída" },
      { name: "Ana Paula Mendes", date: "05/02/2026 10:00", action: "Empresa criada no sistema" },
    ],
    documents: [
      "Contrato Social", "Balanço DRE", "Comprovante de Endereço",
      "Declaração de Faturamento", "CNPJ Atualizado", "Certidão Trabalhista",
    ],
  },
  // New group scenario
  "grp-2": {
    companyName: "Grupo Beta Participações",
    groupName: "Grupo Beta Participações",
    groupCompanies: [
      { name: "Beta Comércio LTDA", cnpj: "55.666.777/0001-88" },
      { name: "Beta Serviços S.A.", cnpj: "55.666.777/0002-69" },
      { name: "Beta Tech LTDA", cnpj: "55.666.777/0003-40" },
    ],
    steps: [
      { label: "Recrutamento", status: "completed" },
      { label: "Formalização", status: "completed" },
      { label: "Comercial", status: "current" },
      { label: "Diretoria Comercial", status: "pending" },
      { label: "Comitê Redator", status: "pending" },
      { label: "Comitê de Crédito", status: "pending" },
      { label: "Cadastro Emissão", status: "pending" },
      { label: "Concluído", status: "pending" },
    ],
    etapa: "Comercial",
    responsavel: "Maria Santos",
    criadoEm: "15/01/2026, 09:00",
    atualizadoEm: "29/03/2026, 16:30",
    ratings: { credito: "A", compliance: "BBB", garantia: "AA" },
    comments: [
      {
        initials: "MS",
        name: "Maria Santos",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Grupo criado no sistema.</p>
            <p>Grupo composto por 3 empresas: Beta Comércio, Beta Serviços e Beta Tech.</p>
          </div>
        ),
      },
      {
        initials: "AP",
        name: "Ana Paula Mendes",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Formalização aprovada para todas as empresas.</p>
            <p>Documentação societária validada. Todas as 3 empresas possuem documentação completa.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "Ana Paula Mendes", date: "29/03/2026 16:30", action: "Etapa Formalização Aprovada" },
      { name: "Maria Santos", date: "20/03/2026 14:00", action: "Etapa Recrutamento Concluída" },
      { name: "Maria Santos", date: "15/01/2026 09:00", action: "Grupo criado no sistema" },
    ],
    documents: [
      "Contrato Social", "Balanço DRE", "Balancete", "Certidão Trabalhista",
      "Comprovante de Endereço", "Declaração de Faturamento", "CNPJ Atualizado",
      "Endividamento Financeiro", "Imposto de Renda",
    ],
  },
};

// Company colors for the group block
const companyDotColors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-purple-500"];

export default function WorkflowPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const data = mockWorkflowData[companyId || "1"] || mockWorkflowData["1"];
  const isGroup = !!data.groupName && !!data.groupCompanies;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-foreground">
                Análise de Documentos: {data.companyName}
              </h1>
              {isGroup && (
                <Badge variant="secondary" className="gap-1">
                  <Users className="h-3 w-3" />
                  Grupo
                </Badge>
              )}
            </div>
            {isGroup && data.groupCompanies && (
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm text-muted-foreground">{data.groupCompanies.length} empresas vinculadas</span>
              </div>
            )}
          </div>
        </div>
        <nav className="text-sm text-muted-foreground">
          Home &gt; Workflow &gt; Análise de Documentos
        </nav>
      </div>

      {/* Group companies block */}
      {isGroup && data.groupCompanies && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold">Empresas do Grupo</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {data.groupCompanies.map((company, i) => (
                <div
                  key={company}
                  className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/20"
                >
                  <div className={`w-3 h-3 rounded-full ${companyDotColors[i % companyDotColors.length]} shrink-0`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{company}</p>
                    <p className="text-xs text-muted-foreground">Empresa {i + 1} de {data.groupCompanies!.length}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stepper + Actions */}
      <div className="bg-card border border-border rounded-lg p-6 flex items-center gap-6">
        <div className="flex-1">
          <StepperProgress steps={data.steps} />
        </div>
        <div className="flex gap-3 shrink-0">
          <Button variant="destructive" className="px-6">
            Reprovar
          </Button>
          <Button className="px-6">
            Aprovar
          </Button>
        </div>
      </div>

      {/* Info Panel */}
      <WorkflowInfoPanel
        etapa={data.etapa}
        responsavel={data.responsavel}
        criadoEm={data.criadoEm}
        atualizadoEm={data.atualizadoEm}
      />

      {/* Risk Indicators */}
      <WorkflowRiskIndicators initialRatings={data.ratings} />

      {/* Comments, History, Documents */}
      <div className="flex gap-5">
        <div className="flex-1 flex gap-5">
          <WorkflowComments comments={data.comments} />
          <WorkflowHistory items={data.history} />
        </div>
        <WorkflowDocuments
          documents={data.documents}
          isGroup={isGroup}
          groupCompanies={data.groupCompanies}
        />
      </div>
    </div>
  );
}
