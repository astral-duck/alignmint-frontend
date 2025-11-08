import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

interface DraggableComponentProps {
  id: string;
  index: number;
  moveComponent: (dragIndex: number, hoverIndex: number) => void;
  children: React.ReactNode;
  isEditing: boolean;
}

const ItemType = 'DASHBOARD_COMPONENT';

export const DraggableComponent: React.FC<DraggableComponentProps> = ({
  id,
  index,
  moveComponent,
  children,
  isEditing,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ItemType,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: isEditing,
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemType,
    hover(item: { id: string; index: number }) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      moveComponent(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Connect drag and drop refs
  drag(drop(ref));

  return (
    <div
      ref={ref}
      className={`relative transition-all ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isOver ? 'ring-2 ring-blue-500' : ''} ${
        isEditing ? 'cursor-move' : ''
      }`}
    >
      {isEditing && (
        <div className="absolute -left-2 top-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>
      )}
      <div className={isEditing ? 'pointer-events-none' : ''}>{children}</div>
    </div>
  );
};
