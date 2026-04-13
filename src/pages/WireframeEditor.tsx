import { useState, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Download, Save, Loader2, Square, Circle, Type, Minus, MousePointer, Image, Menu, X, ZoomIn, ZoomOut, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface WireframeElement {
  id: string;
  type: 'rect' | 'circle' | 'text' | 'line' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  text?: string;
  color: string;
}

export default function WireframeEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [elements, setElements] = useState<WireframeElement[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [title, setTitle] = useState('My Wireframe');
  const [downloading, setDownloading] = useState(false);
  const [dragging, setDragging] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const addElement = (type: WireframeElement['type']) => {
    const el: WireframeElement = {
      id: Date.now().toString(),
      type,
      x: 100 + Math.random() * 200,
      y: 100 + Math.random() * 200,
      width: type === 'line' ? 200 : type === 'circle' ? 80 : 160,
      height: type === 'line' ? 2 : type === 'circle' ? 80 : type === 'text' ? 40 : 100,
      text: type === 'text' ? 'Text here' : undefined,
      color: '#e2e8f0',
    };
    setElements([...elements, el]);
    setSelectedElement(el.id);
    setSelectedTool('select');
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (selectedTool !== 'select') {
      addElement(selectedTool as WireframeElement['type']);
      return;
    }
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicking on an element
    for (let i = elements.length - 1; i >= 0; i--) {
      const el = elements[i];
      if (x >= el.x && x <= el.x + el.width && y >= el.y && y <= el.y + el.height) {
        setSelectedElement(el.id);
        setDragging({ id: el.id, offsetX: x - el.x, offsetY: y - el.y });
        return;
      }
    }
    setSelectedElement(null);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragging.offsetX;
    const y = e.clientY - rect.top - dragging.offsetY;
    setElements(elements.map(el => el.id === dragging.id ? { ...el, x, y } : el));
  };

  const handleCanvasMouseUp = () => setDragging(null);

  const deleteSelected = () => {
    if (!selectedElement) return;
    setElements(elements.filter(el => el.id !== selectedElement));
    setSelectedElement(null);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      // Check download count
      const { data: profile } = await supabase.from('profiles').select('free_downloads_used').eq('user_id', user!.id).single();
      if (profile && profile.free_downloads_used >= 1) {
        window.open('https://checkout.fapshi.com/link/30934367', '_blank');
        setDownloading(false);
        return;
      }

      const el = canvasRef.current;
      if (!el) return;
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
      const pdf = new jsPDF('l', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${title}.pdf`);

      await supabase.from('profiles').update({ free_downloads_used: (profile?.free_downloads_used || 0) + 1 }).eq('user_id', user!.id);
      toast({ title: 'Downloaded!', description: 'Wireframe exported as PDF.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setDownloading(false);
  };

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'image', icon: Image, label: 'Placeholder' },
  ];

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <Input value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-0 w-40 md:w-60" />
        </div>
        <div className="flex items-center gap-2">
          {selectedElement && (
            <Button variant="ghost" size="sm" onClick={deleteSelected}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline ml-1">Download</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Tools */}
        <aside className="w-14 border-r border-border bg-background flex flex-col items-center py-3 gap-1 shrink-0">
          {tools.map(tool => (
            <button
              key={tool.id}
              onClick={() => setSelectedTool(tool.id)}
              className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${selectedTool === tool.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-hover'}`}
              title={tool.label}
            >
              <tool.icon className="h-4 w-4" />
            </button>
          ))}
        </aside>

        {/* Canvas */}
        <main className="flex-1 overflow-auto bg-surface p-8">
          <div
            ref={canvasRef}
            className="bg-background border border-border rounded-lg shadow-sm relative"
            style={{ width: 1200, height: 800, cursor: selectedTool !== 'select' ? 'crosshair' : 'default' }}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
          >
            {/* Grid */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {elements.map(el => (
              <div
                key={el.id}
                className={`absolute ${selectedElement === el.id ? 'ring-2 ring-foreground' : ''}`}
                style={{ left: el.x, top: el.y, width: el.width, height: el.height }}
              >
                {el.type === 'rect' && <div className="w-full h-full border-2 border-foreground/30 bg-secondary rounded" />}
                {el.type === 'circle' && <div className="w-full h-full border-2 border-foreground/30 bg-secondary rounded-full" />}
                {el.type === 'text' && (
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    className="w-full h-full flex items-center text-sm text-foreground outline-none"
                    onBlur={e => setElements(elements.map(item => item.id === el.id ? { ...item, text: e.currentTarget.textContent || '' } : item))}
                  >
                    {el.text}
                  </div>
                )}
                {el.type === 'line' && <div className="w-full border-t-2 border-foreground/30 mt-[50%]" />}
                {el.type === 'image' && (
                  <div className="w-full h-full border-2 border-dashed border-foreground/20 bg-secondary/50 rounded flex items-center justify-center">
                    <Image className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
