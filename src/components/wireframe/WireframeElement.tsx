import { WireframeElement } from './types';
import { Image, User } from 'lucide-react';

interface Props {
  element: WireframeElement;
  selected: boolean;
  onUpdate: (el: WireframeElement) => void;
}

export default function WireframeElementComponent({ element: el, selected, onUpdate }: Props) {
  const handleSize = 8;

  const renderContent = () => {
    switch (el.type) {
      case 'text':
        return (
          <div
            contentEditable
            suppressContentEditableWarning
            className="w-full h-full flex items-center outline-none"
            style={{ fontSize: el.fontSize || 16, color: '#1e293b' }}
            onBlur={e => onUpdate({ ...el, text: e.currentTarget.textContent || '' })}
          >
            {el.text}
          </div>
        );
      case 'line':
        return <div className="w-full" style={{ height: 2, backgroundColor: el.fillColor, marginTop: el.height / 2 - 1 }} />;
      case 'image':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 rounded" style={{ borderRadius: el.borderRadius, backgroundColor: el.fillColor, border: `1px dashed ${el.strokeColor}` }}>
            <Image className="h-8 w-8" style={{ color: '#94a3b8' }} />
            <span className="text-xs" style={{ color: '#94a3b8' }}>Image</span>
          </div>
        );
      case 'button':
        return (
          <div className="w-full h-full flex items-center justify-center text-white font-medium" style={{ backgroundColor: el.fillColor, borderRadius: el.borderRadius, fontSize: el.fontSize || 14 }}>
            {el.text || 'Button'}
          </div>
        );
      case 'input':
        return (
          <div className="w-full h-full flex items-center px-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <span className="text-sm" style={{ color: '#94a3b8', fontSize: el.fontSize || 14 }}>{el.text || 'Input...'}</span>
          </div>
        );
      case 'card':
        return (
          <div className="w-full h-full p-4 flex flex-col gap-3" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-3 w-2/3 rounded" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="h-2 w-full rounded" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="h-2 w-5/6 rounded" style={{ backgroundColor: '#f1f5f9' }} />
            <div className="flex-1 rounded" style={{ backgroundColor: '#f8fafc' }} />
          </div>
        );
      case 'navbar':
        return (
          <div className="w-full h-full flex items-center justify-between px-6" style={{ backgroundColor: el.fillColor, borderBottom: `1px solid ${el.strokeColor}` }}>
            <div className="h-6 w-24 rounded" style={{ backgroundColor: '#e2e8f0' }} />
            <div className="flex gap-6">
              {['Home', 'About', 'Contact'].map((t, i) => (
                <span key={i} className="text-xs font-medium" style={{ color: '#64748b' }}>{t}</span>
              ))}
            </div>
            <div className="h-8 w-20 rounded-md flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Sign In</div>
          </div>
        );
      case 'sidebar':
        return (
          <div className="w-full h-full p-4 flex flex-col gap-2" style={{ backgroundColor: el.fillColor, borderRight: `1px solid ${el.strokeColor}` }}>
            <div className="h-8 w-full rounded flex items-center px-3 text-xs font-medium" style={{ backgroundColor: '#e2e8f0', color: '#475569' }}>Dashboard</div>
            {['Analytics', 'Projects', 'Settings', 'Users'].map((t, i) => (
              <div key={i} className="h-8 w-full rounded flex items-center px-3 text-xs" style={{ color: '#94a3b8' }}>{t}</div>
            ))}
          </div>
        );
      case 'hero':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-8" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            <div className="h-6 w-80 rounded" style={{ backgroundColor: '#bfdbfe' }} />
            <div className="h-3 w-96 rounded" style={{ backgroundColor: '#dbeafe' }} />
            <div className="h-3 w-72 rounded" style={{ backgroundColor: '#dbeafe' }} />
            <div className="h-10 w-32 rounded-lg mt-2 flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Get Started</div>
          </div>
        );
      case 'list':
        return (
          <div className="w-full h-full p-3 flex flex-col gap-2" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex items-center gap-3 p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
                <div className="h-6 w-6 rounded-full" style={{ backgroundColor: '#e2e8f0' }} />
                <div className="flex-1">
                  <div className="h-2 w-3/4 rounded mb-1" style={{ backgroundColor: '#e2e8f0' }} />
                  <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: '#f1f5f9' }} />
                </div>
              </div>
            ))}
          </div>
        );
      case 'avatar':
        return (
          <div className="w-full h-full rounded-full flex items-center justify-center" style={{ backgroundColor: el.fillColor, border: `2px solid ${el.strokeColor}` }}>
            <User className="w-1/2 h-1/2" style={{ color: '#94a3b8' }} />
          </div>
        );
      case 'modal':
        return (
          <div className="w-full h-full flex flex-col" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.borderRadius, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: el.strokeColor }}>
              <span className="text-sm font-semibold" style={{ color: '#1e293b' }}>{el.text || 'Modal'}</span>
              <span className="text-lg cursor-pointer" style={{ color: '#94a3b8' }}>×</span>
            </div>
            <div className="flex-1 p-5">
              <div className="h-3 w-full rounded mb-3" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="h-3 w-4/5 rounded mb-3" style={{ backgroundColor: '#f1f5f9' }} />
              <div className="h-3 w-3/5 rounded" style={{ backgroundColor: '#f1f5f9' }} />
            </div>
            <div className="flex justify-end gap-2 px-5 py-3 border-t" style={{ borderColor: el.strokeColor }}>
              <div className="h-8 w-16 rounded flex items-center justify-center text-xs" style={{ border: '1px solid #e2e8f0', color: '#64748b' }}>Cancel</div>
              <div className="h-8 w-16 rounded flex items-center justify-center text-xs text-white" style={{ backgroundColor: '#3b82f6' }}>Save</div>
            </div>
          </div>
        );
      default: // rect, circle
        return (
          <div className="w-full h-full" style={{ backgroundColor: el.fillColor, border: `1px solid ${el.strokeColor}`, borderRadius: el.type === 'circle' ? '50%' : el.borderRadius }} />
        );
    }
  };

  return (
    <div
      className="absolute"
      style={{
        left: el.x,
        top: el.y,
        width: el.width,
        height: el.height,
        opacity: el.opacity,
        outline: selected ? '2px solid hsl(var(--primary))' : 'none',
        outlineOffset: 2,
      }}
    >
      {renderContent()}

      {/* Resize handles */}
      {selected && (
        <>
          {['nw', 'ne', 'sw', 'se'].map(pos => (
            <div
              key={pos}
              className="absolute bg-primary border-2 border-background rounded-sm"
              style={{
                width: handleSize,
                height: handleSize,
                cursor: `${pos}-resize`,
                ...(pos.includes('n') ? { top: -handleSize / 2 } : { bottom: -handleSize / 2 }),
                ...(pos.includes('w') ? { left: -handleSize / 2 } : { right: -handleSize / 2 }),
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
