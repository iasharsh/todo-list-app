import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Column from "./Column";

const DraggableColumn = ({ id, title, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Column
        id={id}
        title={
          <span {...listeners} {...attributes} className="cursor-grab active:cursor-grabbing">
            {title}
          </span>
        }
      >
        {children}
      </Column>
    </div>
  );
};

export default DraggableColumn;