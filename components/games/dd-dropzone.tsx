import React, { useRef } from 'react';
import { useDrop } from 'react-dnd';

const DropZone: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);

  // Set up the drop target
  const [{ isOver }, connectDropTarget] = useDrop(() => ({
    accept: 'label', // The type of draggable item it will accept
    drop: (item: { name: string }) => {
      console.log(`Dropped item: ${item.name}`);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  // Use the connectDropTarget function to link the drop target to the ref
  connectDropTarget(ref);

  return (
    <div
      ref={ref}
      style={{
        padding: '20px',
        width: '300px',
        height: '300px',
        backgroundColor: isOver ? 'lightgreen' : 'lightgray',
        border: '2px dashed black',
      }}
    >
      Drop items here
    </div>
  );
};

export default DropZone;
