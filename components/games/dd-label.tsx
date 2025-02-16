import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';

const DraggableLabel: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'label', // Define the type of the draggable item
    item: { name: 'Label' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  // Assign the drag function to the ref
  drag(ref);

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
        padding: '10px',
        border: '1px solid black',
      }}
    >
      Drag me
    </div>
  );
};

export default DraggableLabel;
