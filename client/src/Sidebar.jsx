import React from 'react';
import { useDnD } from './components/DnDContext';

export default () => {
  const [_, setType] = useDnD();

  const onDragStart = (event, nodeType) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the right.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'Extract')} draggable>
        Extract
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Transform')} draggable>
        Transform
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'Load')} draggable>
        Load
      </div>
    </aside>
  );
};
