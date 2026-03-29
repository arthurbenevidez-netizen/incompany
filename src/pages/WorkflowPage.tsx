import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepperProgress, WorkflowStep } from "@/components/workflow/StepperProgress";
import { WorkflowInfoPanel } from "@/components/workflow/WorkflowInfoPanel";
import { WorkflowRiskIndicators } from "@/components/workflow/WorkflowRiskIndicators";
import { WorkflowComments } from "@/components/workflow/WorkflowComments";
import { WorkflowHistory } from "@/components/workflow/WorkflowHistory";
import { WorkflowDocuments } from "@/components/workflow/WorkflowDocuments";

// Mock data - em produção viria do backend
const mockWorkflowData: Record<string, {
  companyName: string;
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
        initials: "JS",
        name: "João Silva",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Empresa aprovada na análise de cadastro.</p>
            <p>Todos os documentos obrigatórios foram entregues e validados. Faturamento compatível com a operação solicitada.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "João Silva", date: "28/03/2026 09:15", action: "Etapa Comercial Aprovada" },
      { name: "Ana Paula Mendes", date: "20/03/2026 16:40", action: "Etapa Formalização Aprovada" },
      { name: "Roberto Ferreira", date: "10/03/2026 11:22", action: "Etapa Recrutamento Concluída" },
    ],
    documents: [
      "Contrato Social", "Balanço DRE", "Balancete", "Certidão Trabalhista",
      "Comprovante de Endereço", "Declaração de Faturamento", "Endividamento Financeiro",
      "Imposto de Renda", "CNPJ Atualizado",
    ],
  },
  "2": {
    companyName: "Indústria ABC S.A.",
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
        initials: "FO",
        name: "Fernanda Oliveira",
        content: (
          <div className="space-y-2">
            <p className="font-semibold text-foreground">Grupo composto por 2 empresas:</p>
            <div className="space-y-1">
              <p>Indústria ABC S.A.</p>
              <p>CNPJ: 98.765.432/0001-10</p>
              <p className="pt-1">ABC Logística LTDA</p>
              <p>CNPJ: 98.765.432/0002-00</p>
            </div>
            <p className="pt-2">
              <span className="font-semibold text-foreground">Serasa Indústria ABC:</span>{" "}
              Sem restrições relevantes. Score 780.
            </p>
          </div>
        ),
      },
    ],
    history: [
      { name: "Fernanda Oliveira", date: "27/03/2026 14:10", action: "Etapa Diretoria Comercial Aprovada" },
      { name: "Carlos Mendes", date: "15/03/2026 10:30", action: "Etapa Comercial Aprovada" },
      { name: "Ana Paula Mendes", date: "05/02/2026 09:00", action: "Etapa Formalização Aprovada" },
      { name: "Roberto Ferreira", date: "20/01/2026 15:45", action: "Etapa Recrutamento Concluída" },
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
        initials: "RF",
        name: "Roberto Ferreira",
        content: (
          <div className="space-y-2">
            <p>Empresa com faturamento anual de R$ 45M. Documentação completa e sem pendências.</p>
          </div>
        ),
      },
    ],
    history: [
      { name: "Roberto Ferreira", date: "25/03/2026 11:30", action: "Etapa Formalização Aprovada" },
      { name: "Ana Paula Mendes", date: "10/03/2026 08:15", action: "Etapa Recrutamento Concluída" },
    ],
    documents: [
      "Contrato Social", "Balanço DRE", "Comprovante de Endereço",
      "Declaração de Faturamento", "CNPJ Atualizado", "Certidão Trabalhista",
    ],
  },
};

export default function WorkflowPage() {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const data = mockWorkflowData[companyId || "1"] || mockWorkflowData["1"];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">
            Análise de Documentos: {data.companyName}
          </h1>
        </div>
        <nav className="text-sm text-muted-foreground">
          Home &gt; Workflow &gt; Análise de Documentos
        </nav>
      </div>

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
        <WorkflowDocuments documents={data.documents} />
      </div>
    </div>
  );
}
