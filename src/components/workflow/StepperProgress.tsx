import { Check, FileText, ClipboardCheck } from "lucide-react";

export interface WorkflowStep {
  label: string;
  status: "completed" | "current" | "pending";
}

interface StepperProgressProps {
  steps: WorkflowStep[];
}

export const StepperProgress = ({ steps }: StepperProgressProps) => {
  return (
    <div className="flex items-center justify-center gap-0 w-full">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                step.status === "completed"
                  ? "bg-step-completed border-step-completed"
                  : step.status === "current"
                  ? "border-step-current bg-card"
                  : "border-step-pending bg-card"
              }`}
            >
              {step.status === "completed" ? (
                <Check className="w-5 h-5 text-primary-foreground" />
              ) : step.status === "current" ? (
                <FileText className="w-4 h-4 text-step-current" />
              ) : (
                <ClipboardCheck className="w-4 h-4 text-step-pending" />
              )}
            </div>
            <span
              className={`mt-2 text-xs font-medium text-center max-w-[90px] ${
                step.status === "completed" || step.status === "current"
                  ? "text-step-completed"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-10 h-0.5 mt-[-20px] ${
                step.status === "completed" ? "bg-step-completed" : "bg-step-pending"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
