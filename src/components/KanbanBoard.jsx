import { DndContext, closestCorners, DragOverlay, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import TodoCard from "./TodoCard";
import DraggableColumn from "./DraggableColumn";
import { useState } from "react"

const columnTitles = {
  active: "Active",
  review: "Reviewing",
  completed: "Completed",
};

const KanbanBoard = ({
  todos, activeId, columnOrder, handleEdit, handleDelete,
  handleDragEnd, handleColumnDragEnd, setActiveId,
  setColumnOrder, dragType, setDragType,
}) => {
  const [expandedId, setExpandedId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 15,  // ← increase from 8 to 15
      },
    })
  );
  const columns = {
    active: todos.filter(t => t.status === "active"),
    review: todos.filter(t => t.status === "review"),
    completed: todos.filter(t => t.status === "completed"),
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      modifiers={[restrictToWindowEdges]}
      measuring={{
        droppable: {
          strategy: "always"
        }
      }}
      onDragStart={(event) => {
        const id = event.active.id;
        const isColumn = columnOrder.includes(id);

        if (isColumn) {
          setDragType("column");
        } else {
          setDragType("card");
          setActiveId(id);
        }
      }}
      onDragEnd={(event) => {
        if (dragType === "column") handleColumnDragEnd(event);
        else handleDragEnd(event);
        setDragType(null);
        setActiveId(null);
      }}
    >
      {/* single flex — all 4 columns here, no nesting */}
      <div className="flex gap-3 mt-6 items-start w-full">

        {/* Fixed All column */}
        <div className="flex-1 min-w-0 p-4 rounded-xl border transition hover:shadow-lg
          hover:shadow-purple-500/20 min-h-[100px] bg-purple-500/10 border-purple-500/50">
          <h2 className="font-semibold mb-3 text-center text-purple-400">All</h2>
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

        {/* Draggable 3 columns — NO extra div wrapper inside SortableContext */}
        <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
          {columnOrder.map(colId => (
            <DraggableColumn key={colId} id={colId} title={columnTitles[colId]}>
              <SortableContext
                items={columns[colId].map(t => t.id)}
                strategy={verticalListSortingStrategy}
              >
                {columns[colId].map(item => (
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
          <div className="bg-[var(--card)] border border-[var(--border)] p-3 rounded-lg shadow-xl truncate overflow-hidden whitespace-nowrap">
            {todos.find(t => t.id === activeId)?.todo || ""}
          </div>
        )}
        {activeId && dragType === "column" && (
          <div className="flex-1 p-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm shadow-2xl opacity-90">
            <h2 className="font-semibold mb-3 text-center">{columnTitles[activeId]}</h2>
          </div>
        )}
      </DragOverlay>

    </DndContext>
  );
};

export default KanbanBoard;