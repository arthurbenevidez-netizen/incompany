import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface GroupOptionalNoticeProps {
  context?: "documentos" | "variaveis" | "ambos";
  className?: string;
}

/**
 * Banner informativo exibido nos fluxos de Grupo Econômico,
 * indicando que envios/preenchimentos no nível do grupo são opcionais
 * e não bloqueiam aprovação.
 */
export function GroupOptionalNotice({ context = "ambos", className = "" }: GroupOptionalNoticeProps) {
  const subject =
    context === "documentos"
      ? "envio de documentos"
      : context === "variaveis"
      ? "preenchimento de variáveis"
      : "envio de documentos e preenchimento de variáveis";

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border border-info/20 bg-info/5 p-3 ${className}`}
    >
      <Info className="h-4 w-4 text-info mt-0.5 shrink-0" />
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-muted text-muted-foreground text-xs">
            Opcional
          </Badge>
          <span className="text-sm font-medium">Cadastro do Grupo Econômico</span>
        </div>
        <p className="text-xs text-muted-foreground">
          O {subject} no nível do grupo é opcional e, em geral, não é uma ação executada pelo
          usuário. Não bloqueia a aprovação — as validações ocorrem por empresa membro.
        </p>
      </div>
    </div>
  );
}
