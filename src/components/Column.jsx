import { useDroppable } from "@dnd-kit/core";

const Column = ({ id, title, children, borderClass, bgClass, glowClass }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 rounded-xl border transition hover:shadow-lg
        min-h-[100px]
        ${isOver ? "scale-[1.02] brightness-110" : ""}
        ${borderClass}
        ${bgClass}
        ${glowClass}`}
    >
      <h2 className="font-semibold mb-3 text-center">{title}</h2>
      {children}
    </div>
  );
};

export default Column;