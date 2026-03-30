import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import TodoCard from "./TodoCard";
import DraggableColumn from "./DraggableColumn";
import { useState } from "react"

const columnTitles = {
  active: "🚧 Active",
  review: "👀 Reviewing",
  completed: "✅ Completed",
};

const KanbanBoard = ({
  todos,
  activeId,
  columnOrder,
  handleEdit,
  handleDelete,
  handleDragEnd,
  handleColumnDragEnd,
  setActiveId,
  setColumnOrder,
  dragType,
  setDragType,
}) => {
  const [expandedId, setExpandedId] = useState(null)  // ✅ moved inside component

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToWindowEdges]}
      onDragStart={(event) => {
        const id = event.active.id;
        if (columnOrder.includes(id)) {
          setDragType("column");
        } else {
          setDragType("card");
          setActiveId(id);
        }
      }}
      onDragEnd={(event) => {
        if (dragType === "column") {
          handleColumnDragEnd(event);
        } else {
          handleDragEnd(event);
        }
        setDragType(null);
        setActiveId(null);
      }}
    >
      <div className="grid md:grid-cols-4 gap-4 mt-6">

        {/* Fixed All column */}
        <div className="p-4 rounded-xl border bg-[var(--bg)] border-[var(--border)]">
          <h2 className="font-semibold mb-3 text-center">📋 All</h2>
          {todos.map(item => (
            <div
              key={item.id}
              title={item.todo}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className={`opacity-70 text-sm mb-2 cursor-pointer overflow-hidden transition-all
                ${expandedId === item.id ? "whitespace-normal break-words" : "truncate whitespace-nowrap"}`}
            >
              {item.todo}
            </div>
          ))}
        </div>

        {/* Draggable columns */}
        <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
          {columnOrder.map(colId => (
            <DraggableColumn key={colId} id={colId} title={columnTitles[colId]}>
              <SortableContext
                items={todos.filter(t => t.status === colId).map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {todos.filter(t => t.status === colId).map(item => (
                  <TodoCard
                    key={item.id}
                    item={item}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    activeId={activeId}
                  />
                ))}
              </SortableContext>
            </DraggableColumn>
          ))}
        </SortableContext>

      </div>

      <DragOverlay>
        {activeId && dragType === "card" && (
          <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-lg shadow-xl max-w-[200px] truncate overflow-hidden whitespace-nowrap">
            {todos.find(t => t.id === activeId)?.todo || ""}
          </div>
        )}
      </DragOverlay>

    </DndContext>
  );
};

export default KanbanBoard;