import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

const TodoCard = ({ item, handleEdit, handleDelete, activeId }) => {
  const [expanded, setExpanded] = useState(false)  // ← each card has its own

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: item.id === activeId ? 0 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="cursor-grab active:cursor-grabbing bg-[var(--card)] border border-[var(--border)] p-3 rounded-lg mb-2 hover:shadow-lg transition"
    >
      <p
        title={item.title}
        onPointerDown={(e) => e.stopPropagation()}
        onClick={() => setExpanded(prev => !prev)}
        className={`mb-2 text-sm cursor-pointer overflow-hidden transition-all w-full
    ${expanded ? "whitespace-normal break-words" : "truncate whitespace-nowrap"}`}
      >
        {item.title}
      </p>

      <div className="flex justify-between mt-2">
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleEdit(item.id)}
          className="p-2 rounded-lg text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition cursor-pointer"
        >
          <FaEdit />
        </button>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => handleDelete(item.id)}
          className="p-2 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition cursor-pointer"
        >
          <MdDeleteForever />
        </button>
      </div>
    </div>
  );
};

export default TodoCard;