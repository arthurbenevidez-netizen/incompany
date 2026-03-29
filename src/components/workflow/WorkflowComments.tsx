interface Comment {
  initials: string;
  name: string;
  content: React.ReactNode;
}

interface WorkflowCommentsProps {
  comments: Comment[];
}

export const WorkflowComments = ({ comments }: WorkflowCommentsProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 flex-1 min-h-[350px]">
      <h3 className="text-base font-semibold text-foreground text-center mb-4">Comentários</h3>
      <div className="space-y-5">
        {comments.map((comment, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-9 h-9 rounded-full bg-step-completed flex items-center justify-center shrink-0">
              <span className="text-primary-foreground text-xs font-semibold">{comment.initials}</span>
            </div>
            <div className="space-y-1 text-sm text-foreground">
              <p className="font-semibold">{comment.name}</p>
              <div className="text-muted-foreground">{comment.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
