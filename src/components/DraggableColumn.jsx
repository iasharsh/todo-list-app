import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./Column";

const columnStyles = {
  active: {
    border: "border-blue-500/50",
    bg: "bg-blue-500/10",
    header: "text-blue-400",
    glow: "hover:shadow-blue-500/20",
  },
  review: {
    border: "border-yellow-500/50",
    bg: "bg-yellow-500/10",
    header: "text-yellow-400",
    glow: "hover:shadow-yellow-500/20",
  },
  completed: {
    border: "border-green-500/50",
    bg: "bg-green-500/10",
    header: "text-green-400",
    glow: "hover:shadow-green-500/20",
  },
}

const DraggableColumn = ({ id, title, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    flexShrink: 0,
    width: "md:345px 200px",
  };

  const styles = columnStyles[id] || {
    border: "border-[var(--border)]",
    bg: "bg-[var(--bg)]",
    header: "text-[var(--text)]",
    glow: "",
  }

  return (
    <div ref={setNodeRef} style={style}>
      <Column
        id={id}
        title={
          <span
            {...listeners}
            {...attributes}
            className={`cursor-grab active:cursor-grabbing font-semibold ${styles.header}`}
          >
            {title}
          </span>
        }
        borderClass={styles.border}
        bgClass={styles.bg}
        glowClass={styles.glow}
      >
        {/* <div onPointerDown={(e) => e.stopPropagation()}>
          {children}
        </div> */}
        {children}
      </Column>
    </div>
  );
};

export default DraggableColumn;