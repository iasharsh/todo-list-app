import { useDroppable } from "@dnd-kit/core";

const Column = ({ id, title, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border transition
    min-h-[100px]
    ${isOver ? "bg-blue-500/10 scale-[1.02]" : "bg-[var(--bg)]"}
    border-[var(--border)]`}
    >
      <h2 className="font-semibold mb-3 text-center">{title}</h2>
      {children}
    </div>
  );
};

export default Column;