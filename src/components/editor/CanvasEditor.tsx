/**
 * Canvas Editor Component
 */
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { canvasEditor } from '../../core/canvas';
import { useAppStore } from '../../stores/app';

export const CanvasEditor: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [initialized, setInitialized] = useState(false);
  const [selectedTool, setSelectedTool] = useState('select');
  
  const { canvas: canvasState, setCanvas, document } = useAppStore();
  
  useEffect(() => {
    if (canvasRef.current && !initialized) {
      canvasEditor.init('canvas-editor', 800, 600);
      setInitialized(true);
    }
    
    return () => {
      if (initialized) {
        canvasEditor.dispose();
      }
    };
  }, [initialized]);
  
  const handleUndo = useCallback(() => {
    canvasEditor.undo();
    setCanvas({
      canUndo: canvasEditor.canUndo(),
      canRedo: canvasEditor.canRedo()
    });
  }, [setCanvas]);
  
  const handleRedo = useCallback(() => {
    canvasEditor.redo();
    setCanvas({
      canUndo: canvasEditor.canUndo(),
      canRedo: canvasEditor.canRedo()
    });
  }, [setCanvas]);
  
  const handleAddText = useCallback(() => {
    canvasEditor.addText('New text', {
      left: 100,
      top: 100,
      fontSize: 24,
      fill: '#000000'
    });
  }, []);
  
  const handleDelete = useCallback(() => {
    canvasEditor.deleteSelection();
    setCanvas({
      canUndo: canvasEditor.canUndo(),
      canRedo: canvasEditor.canRedo()
    });
  }, [setCanvas]);
  
  const handleExportPNG = useCallback(() => {
    const dataUrl = canvasEditor.exportToPNG();
    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = dataUrl;
    link.click();
  }, []);
  
  const tools = [
    { id: 'select', icon: '↖', label: 'Select' },
    { id: 'text', icon: 'T', label: 'Text' },
    { id: 'rect', icon: '□', label: 'Rectangle' },
    { id: 'circle', icon: '○', label: 'Circle' }
  ];
  
  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b overflow-x-auto">
        {/* Tools */}
        <div className="flex items-center gap-1 border-r pr-2">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                selectedTool === tool.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-white hover:bg-gray-50'
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>
        
        {/* Edit actions */}
        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={handleUndo}
            disabled={!canvasState.canUndo}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Undo
          </button>
          <button
            onClick={handleRedo}
            disabled={!canvasState.canRedo}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Redo
          </button>
          <button
            onClick={handleDelete}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            Delete
          </button>
        </div>
        
        {/* Add elements */}
        <div className="flex items-center gap-1 border-r pr-2">
          <button
            onClick={handleAddText}
            className="px-3 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            + Text
          </button>
        </div>
        
        {/* View options */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCanvas({ zoom: canvasState.zoom + 0.1 })}
            className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            Zoom +
          </button>
          <span className="text-sm px-2">
            {Math.round(canvasState.zoom * 100)}%
          </span>
          <button
            onClick={() => setCanvas({ zoom: canvasState.zoom - 0.1 })}
            className="px-2 py-1 text-sm bg-white border rounded hover:bg-gray-50"
          >
            Zoom -
          </button>
          <button
            onClick={() => setCanvas({ showGrid: !canvasState.showGrid })}
            className={`px-3 py-1 text-sm border rounded ${
              canvasState.showGrid ? 'bg-blue-100' : 'bg-white hover:bg-gray-50'
            }`}
          >
            Grid
          </button>
        </div>
        
        {/* Export */}
        <div className="ml-auto">
          <button
            onClick={handleExportPNG}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
          >
            Export PNG
          </button>
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-200 p-4">
        <div
          className="relative mx-auto"
          style={{
            width: 800 * canvasState.zoom,
            height: 600 * canvasState.zoom
          }}
        >
          {/* Grid */}
          {canvasState.showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                  linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          )}
          
          <canvas
            id="canvas-editor"
            ref={canvasRef}
            className="border shadow-lg bg-white"
            style={{
              transform: `scale(${canvasState.zoom})`,
              transformOrigin: 'top left'
            }}
          />
        </div>
      </div>
    </div>
  );
};
