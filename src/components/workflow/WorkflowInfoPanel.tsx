interface WorkflowInfoPanelProps {
  etapa: string;
  responsavel: string;
  criadoEm: string;
  atualizadoEm: string;
}

export const WorkflowInfoPanel = ({ etapa, responsavel, criadoEm, atualizadoEm }: WorkflowInfoPanelProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-sm">
          <span className="font-semibold text-foreground">Etapa:</span>{" "}
          <span className="text-muted-foreground">{etapa}</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold text-foreground">Responsável:</span>{" "}
          <span className="text-muted-foreground">{responsavel}</span>
        </p>
      </div>
      <div className="space-y-1 text-right">
        <p className="text-sm">
          <span className="font-semibold text-foreground">Criado em:</span>{" "}
          <span className="text-muted-foreground">{criadoEm}</span>
        </p>
        <p className="text-sm">
          <span className="font-semibold text-foreground">Atualizado em:</span>{" "}
          <span className="text-muted-foreground">{atualizadoEm}</span>
        </p>
      </div>
    </div>
  );
};
