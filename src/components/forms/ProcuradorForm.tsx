import { SocioPFForm } from "./SocioPFForm";

interface ProcuradorFormProps {
  personName: string;
  hasSpouse: boolean;
  onSubmit: (data: any) => void;
  onBack?: () => void;
}

export function ProcuradorForm({ personName, hasSpouse, onSubmit, onBack }: ProcuradorFormProps) {
  // Procurador usa os mesmos campos que Sócio PF
  return (
    <SocioPFForm
      personName={personName}
      hasSpouse={hasSpouse}
      onSubmit={onSubmit}
      onBack={onBack}
    />
  );
}
