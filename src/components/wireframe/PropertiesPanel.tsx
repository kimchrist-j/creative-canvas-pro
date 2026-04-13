import { WireframeElement } from './types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

interface Props {
  element: WireframeElement | null;
  onUpdate: (el: WireframeElement) => void;
}

export default function PropertiesPanel({ element, onUpdate }: Props) {
  if (!element) {
    return (
      <div className="p-4 text-center text-muted-foreground text-sm">
        <p className="mt-8">Select an element to edit its properties</p>
      </div>
    );
  }

  const update = (key: string, value: any) => onUpdate({ ...element, [key]: value });

  return (
    <div className="p-4 space-y-4 overflow-y-auto h-full">
      <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Properties</h3>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">X</Label>
            <Input type="number" className="h-8 text-xs" value={element.x} onChange={e => update('x', Number(e.target.value))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Y</Label>
            <Input type="number" className="h-8 text-xs" value={element.y} onChange={e => update('y', Number(e.target.value))} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs">Width</Label>
            <Input type="number" className="h-8 text-xs" value={element.width} onChange={e => update('width', Math.max(20, Number(e.target.value)))} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Height</Label>
            <Input type="number" className="h-8 text-xs" value={element.height} onChange={e => update('height', Math.max(20, Number(e.target.value)))} />
          </div>
        </div>

        {element.text !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Text</Label>
            <Input className="h-8 text-xs" value={element.text} onChange={e => update('text', e.target.value)} />
          </div>
        )}

        {element.fontSize !== undefined && (
          <div className="space-y-1">
            <Label className="text-xs">Font Size</Label>
            <Input type="number" className="h-8 text-xs" value={element.fontSize} onChange={e => update('fontSize', Number(e.target.value))} />
          </div>
        )}

        <div className="space-y-1">
          <Label className="text-xs">Fill Color</Label>
          <div className="flex gap-2">
            <input type="color" value={element.fillColor === 'transparent' ? '#ffffff' : element.fillColor} onChange={e => update('fillColor', e.target.value)} className="h-8 w-8 rounded border border-border cursor-pointer" />
            <Input className="h-8 text-xs flex-1" value={element.fillColor} onChange={e => update('fillColor', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Border Color</Label>
          <div className="flex gap-2">
            <input type="color" value={element.strokeColor === 'transparent' ? '#ffffff' : element.strokeColor} onChange={e => update('strokeColor', e.target.value)} className="h-8 w-8 rounded border border-border cursor-pointer" />
            <Input className="h-8 text-xs flex-1" value={element.strokeColor} onChange={e => update('strokeColor', e.target.value)} />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Border Radius</Label>
          <Slider value={[element.borderRadius]} onValueChange={v => update('borderRadius', v[0])} min={0} max={50} step={1} />
        </div>

        <div className="space-y-1">
          <Label className="text-xs">Opacity</Label>
          <Slider value={[element.opacity * 100]} onValueChange={v => update('opacity', v[0] / 100)} min={10} max={100} step={5} />
        </div>
      </div>
    </div>
  );
}
