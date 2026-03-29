import { Plus, Eye, ChevronDown } from "lucide-react";

interface WorkflowDocumentsProps {
  documents: string[];
}

export const WorkflowDocuments = ({ documents }: WorkflowDocumentsProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 w-[280px] shrink-0">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-foreground">Documentos</h3>
        <button className="w-8 h-8 rounded-md border border-border flex items-center justify-center hover:bg-accent transition-colors">
          <Plus className="w-4 h-4 text-foreground" />
        </button>
      </div>
      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc}
            className="flex items-center justify-between px-3 py-2.5 border border-border rounded-md hover:bg-accent transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground">{doc}</span>
              <Eye className="w-3.5 h-3.5 text-success" />
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
};
