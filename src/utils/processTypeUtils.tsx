import { UserPlus, RefreshCw, ShieldAlert, UserCheck, FileText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getProcessTypeLabel, getProcessTypeBadge } from "@/data/documentCategories";

export const getProcessTypeIconComponent = (processType: string, size: "sm" | "md" = "sm") => {
  const cls = size === "sm" ? "h-4 w-4" : "h-5 w-5";
  switch (processType) {
    case 'cadastro_cedente':
      return <UserPlus className={`${cls} text-blue-600`} />;
    case 'atualizacao_cedente':
      return <RefreshCw className={`${cls} text-green-600`} />;
    case 'risco_sacado':
      return <ShieldAlert className={`${cls} text-red-600`} />;
    case 'cadastro_sacado':
      return <UserCheck className={`${cls} text-purple-600`} />;
    default:
      return <FileText className={`${cls} text-muted-foreground`} />;
  }
};

export const getProcessTypeIconWithTooltip = (processType: string, size: "sm" | "md" = "sm") => {
  const classes = getProcessTypeBadge(processType);
  const icon = getProcessTypeIconComponent(processType, size);
  const label = getProcessTypeLabel(processType);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`${classes} border rounded-full p-1.5 flex items-center justify-center shrink-0`}>
            {icon}
          </div>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export const getProcessTypeBadgeElement = (processType: string) => {
  const classes = getProcessTypeBadge(processType);
  const icon = getProcessTypeIconComponent(processType);
  return (
    <Badge className={`${classes} border text-xs font-medium flex items-center gap-1`}>
      {icon}
      {getProcessTypeLabel(processType)}
    </Badge>
  );
};
