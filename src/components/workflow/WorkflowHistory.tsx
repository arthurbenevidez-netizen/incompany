interface HistoryItem {
  name: string;
  date: string;
  action: string;
}

interface WorkflowHistoryProps {
  items: HistoryItem[];
}

export const WorkflowHistory = ({ items }: WorkflowHistoryProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex-1 min-h-[350px]">
      <h3 className="text-base font-semibold text-foreground text-center mb-4">Histórico</h3>
      <div className="space-y-5">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start">
            <div className="w-3 h-3 rounded-full bg-step-completed mt-1 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-foreground">{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{item.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
