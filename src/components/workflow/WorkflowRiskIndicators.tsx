import { useState } from "react";
import { Shield, FileCheck, Lock, Pencil } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type RatingLevel = "AAA" | "AA" | "A" | "BBB" | "BB" | "B" | "CCC" | "CC" | "C" | "D" | "NA";

const ratingConfig: Record<RatingLevel, { classification: string; colorClass: string; bgClass: string; borderClass: string }> = {
  AAA: { classification: "Segura", colorClass: "text-success", bgClass: "bg-success/10", borderClass: "border-success/30" },
  AA:  { classification: "Segura", colorClass: "text-success", bgClass: "bg-success/10", borderClass: "border-success/30" },
  A:   { classification: "Segura", colorClass: "text-success", bgClass: "bg-success/10", borderClass: "border-success/30" },
  BBB: { classification: "Neutra", colorClass: "text-muted-foreground", bgClass: "bg-muted", borderClass: "border-border" },
  BB:  { classification: "Neutra", colorClass: "text-muted-foreground", bgClass: "bg-muted", borderClass: "border-border" },
  B:   { classification: "Neutra", colorClass: "text-muted-foreground", bgClass: "bg-muted", borderClass: "border-border" },
  CCC: { classification: "Atenção", colorClass: "text-destructive", bgClass: "bg-destructive/10", borderClass: "border-destructive/30" },
  CC:  { classification: "Atenção", colorClass: "text-destructive", bgClass: "bg-destructive/10", borderClass: "border-destructive/30" },
  C:   { classification: "Atenção", colorClass: "text-destructive", bgClass: "bg-destructive/10", borderClass: "border-destructive/30" },
  D:   { classification: "Atenção", colorClass: "text-destructive", bgClass: "bg-destructive/10", borderClass: "border-destructive/30" },
  NA:  { classification: "Não avaliado", colorClass: "text-foreground", bgClass: "bg-foreground/10", borderClass: "border-foreground/30" },
};

const allRatings: RatingLevel[] = ["AAA", "AA", "A", "BBB", "BB", "B", "CCC", "CC", "C", "D", "NA"];

interface RiskCardProps {
  label: string;
  icon: React.ElementType;
  rating: RatingLevel;
}

const RiskCard = ({ label, icon: Icon, rating }: RiskCardProps) => {
  const config = ratingConfig[rating];
  return (
    <div className="flex-1 bg-card border border-border rounded-lg p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-md ${config.bgClass} flex items-center justify-center`}>
            <Icon className={`w-4 h-4 ${config.colorClass}`} />
          </div>
          <h4 className="text-sm font-semibold text-foreground">{label}</h4>
          <span className={`text-2xl font-bold ${config.colorClass}`}>{rating === "NA" ? "X" : rating}</span>
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${config.bgClass} ${config.borderClass} ${config.colorClass}`}>
          {config.classification}
        </span>
      </div>
      <div className="flex gap-0.5">
        {allRatings.filter(r => r !== "NA").map((r) => {
          const isActive = rating !== "NA" && r === rating;
          const rc = ratingConfig[r];
          return (
            <div
              key={r}
              className={`h-2 flex-1 rounded-sm transition-all ${
                rating === "NA" ? "bg-muted-foreground/10"
                : isActive ? `${rc.colorClass === "text-success" ? "bg-success" : rc.colorClass === "text-destructive" ? "bg-destructive" : "bg-muted-foreground"} scale-y-150`
                : rc.colorClass === "text-success" ? "bg-success/25"
                : rc.colorClass === "text-destructive" ? "bg-destructive/25"
                : "bg-muted-foreground/20"
              }`}
              title={r}
            />
          );
        })}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-success">AAA</span>
        <span className="text-[10px] text-muted-foreground">B</span>
        <span className="text-[10px] text-destructive">D</span>
      </div>
    </div>
  );
};

const RatingSelect = ({ label, value, onChange }: { label: string; value: RatingLevel; onChange: (v: RatingLevel) => void }) => (
  <div className="flex items-center justify-between gap-4">
    <span className="text-sm font-medium text-foreground">{label}</span>
    <Select value={value} onValueChange={(v) => onChange(v as RatingLevel)}>
      <SelectTrigger className="w-24 h-8 text-sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {allRatings.map((r) => {
          const rc = ratingConfig[r];
          return (
            <SelectItem key={r} value={r}>
              <span className={rc.colorClass}>{r === "NA" ? "— N/A" : r}</span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  </div>
);

interface IndicatorState {
  credito: RatingLevel;
  compliance: RatingLevel;
  garantia: RatingLevel;
}

interface WorkflowRiskIndicatorsProps {
  initialRatings?: IndicatorState;
}

export const WorkflowRiskIndicators = ({ initialRatings }: WorkflowRiskIndicatorsProps) => {
  const [ratings, setRatings] = useState<IndicatorState>(initialRatings || {
    credito: "BB",
    compliance: "A",
    garantia: "CCC",
  });

  const updateRating = (key: keyof IndicatorState) => (value: RatingLevel) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const cards = [
    { key: "credito" as const, label: "Crédito", icon: Shield },
    { key: "compliance" as const, label: "Compliance", icon: FileCheck },
    { key: "garantia" as const, label: "Garantia", icon: Lock },
  ];

  return (
    <div className="flex gap-5">
      {cards.map(({ key, label, icon }) => (
        <Popover key={key}>
          <PopoverTrigger asChild>
            <div className="flex-1 relative group cursor-pointer">
              <RiskCard label={label} icon={icon} rating={ratings[key]} />
              <div className="absolute inset-0 rounded-lg bg-foreground/0 group-hover:bg-foreground/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="bg-card border border-border rounded-md px-3 py-1.5 shadow-sm flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">Editar ratings</span>
                </div>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-4" align="start">
            <h4 className="text-sm font-semibold text-foreground mb-3">Editar Indicadores</h4>
            <div className="space-y-3">
              {cards.map(({ key: k, label: l }) => (
                <RatingSelect key={k} label={l} value={ratings[k]} onChange={updateRating(k)} />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      ))}
    </div>
  );
};
