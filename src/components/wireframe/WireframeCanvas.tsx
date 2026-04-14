import { useRef, useState, useCallback, useEffect } from 'react';
import { WireframeElement } from './types';
import WireframeElementComponent from './WireframeElement';

interface Props {
  elements: WireframeElement[];
  selectedId: string | null;
  tool: string;
  gridSize: number;
  zoom: number;
  onSelect: (id: string | null) => void;
  onUpdate: (elements: WireframeElement[]) => void;
  onAdd: (type: WireframeElement['type'], x: number, y: number) => void;
  canvasWidth?: number;
  canvasHeight?: number;
}

export default function WireframeCanvas({ elements, selectedId, tool, gridSize, zoom, onSelect, onUpdate, onAdd }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number; type: 'move' | 'resize'; handle?: string } | null>(null);
  const [drawing, setDrawing] = useState<{ startX: number; startY: number; type: WireframeElement['type'] } | null>(null);
  const [drawPreview, setDrawPreview] = useState<{ x: number; y: number; w: number; h: number } | null>(null);

  const snap = (v: number) => Math.round(v / gridSize) * gridSize;

  const getPos = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (e.clientX - rect.left) / zoom, y: (e.clientY - rect.top) / zoom };
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    const pos = getPos(e);

    if (tool !== 'select') {
      setDrawing({ startX: snap(pos.x), startY: snap(pos.y), type: tool as WireframeElement['type'] });
      setDrawPreview({ x: snap(pos.x), y: snap(pos.y), w: 0, h: 0 });
      return;
    }

    // Check element hits (reverse for z-order)
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (pos.x >= el.x && pos.x <= el.x + el.width && pos.y >= el.y && pos.y <= el.y + el.height) {
        onSelect(el.id);

        // Check resize handles
        const handleSize = 8;
        const handles = [
          { name: 'se', x: el.x + el.width - handleSize, y: el.y + el.height - handleSize },
          { name: 'sw', x: el.x, y: el.y + el.height - handleSize },
          { name: 'ne', x: el.x + el.width - handleSize, y: el.y },
          { name: 'nw', x: el.x, y: el.y },
        ];

        for (const h of handles) {
          if (pos.x >= h.x && pos.x <= h.x + handleSize && pos.y >= h.y && pos.y <= h.y + handleSize) {
            setDragging({ id: el.id, offsetX: pos.x, offsetY: pos.y, type: 'resize', handle: h.name });
            return;
          }
        }

        setDragging({ id: el.id, offsetX: pos.x - el.x, offsetY: pos.y - el.y, type: 'move' });
        return;
      }
    }
    onSelect(null);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const pos = getPos(e);

    if (drawing) {
      const x = Math.min(drawing.startX, pos.x);
      const y = Math.min(drawing.startY, pos.y);
      const w = Math.abs(pos.x - drawing.startX);
      const h = Math.abs(pos.y - drawing.startY);
      setDrawPreview({ x, y, w, h });
      return;
    }

    if (!dragging) return;

    const el = elements.find(e => e.id === dragging.id);
    if (!el) return;

    if (dragging.type === 'move') {
      const x = snap(pos.x - dragging.offsetX);
      const y = snap(pos.y - dragging.offsetY);
      onUpdate(elements.map(e => e.id === dragging.id ? { ...e, x: Math.max(0, x), y: Math.max(0, y) } : e));
    } else if (dragging.type === 'resize') {
      let { x, y, width, height } = el;
      const handle = dragging.handle;
      if (handle?.includes('e')) width = snap(Math.max(20, pos.x - x));
      if (handle?.includes('s')) height = snap(Math.max(20, pos.y - y));
      if (handle?.includes('w')) { const newX = snap(pos.x); width = width + (x - newX); x = newX; if (width < 20) { x = x + width - 20; width = 20; } }
      if (handle?.includes('n')) { const newY = snap(pos.y); height = height + (y - newY); y = newY; if (height < 20) { y = y + height - 20; height = 20; } }
      onUpdate(elements.map(e => e.id === dragging.id ? { ...e, x, y, width, height } : e));
    }
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (drawing) {
      const pos = getPos(e);
      const x = Math.min(drawing.startX, snap(pos.x));
      const y = Math.min(drawing.startY, snap(pos.y));
      const w = Math.max(40, Math.abs(snap(pos.x) - drawing.startX));
      const h = Math.max(20, Math.abs(snap(pos.y) - drawing.startY));
      onAdd(drawing.type, x, y);
      // The parent will handle creating the element with proper dimensions
      setDrawing(null);
      setDrawPreview(null);
      return;
    }
    setDragging(null);
  };

  return (
    <div
      ref={canvasRef}
      className="relative bg-background border border-border rounded-lg shadow-sm"
      style={{
        width: 1440,
        height: 900,
        cursor: tool !== 'select' ? 'crosshair' : dragging ? 'grabbing' : 'default',
        transform: `scale(${zoom})`,
        transformOrigin: 'top left',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Grid */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid-sm" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`} fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
          <pattern id="grid-lg" width={gridSize * 5} height={gridSize * 5} patternUnits="userSpaceOnUse">
            <path d={`M ${gridSize * 5} 0 L 0 0 0 ${gridSize * 5}`} fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-sm)" />
        <rect width="100%" height="100%" fill="url(#grid-lg)" />
      </svg>

      {/* Draw preview */}
      {drawPreview && drawPreview.w > 0 && (
        <div className="absolute border-2 border-primary/50 bg-primary/5 rounded pointer-events-none" style={{ left: drawPreview.x, top: drawPreview.y, width: drawPreview.w, height: drawPreview.h }} />
      )}

      {/* Elements */}
      {elements.map(el => (
        <WireframeElementComponent
          key={el.id}
          element={el}
          selected={selectedId === el.id}
          onUpdate={(updated) => onUpdate(elements.map(e => e.id === updated.id ? updated : e))}
        />
      ))}
    </div>
  );
}
