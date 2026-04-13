import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft, Download, Loader2, MousePointer, Square, Circle, Type, Minus, Image,
  Undo2, Redo2, ZoomIn, ZoomOut, Trash2, Copy, Layers, PanelRight,
  RectangleHorizontal, LayoutDashboard, SidebarIcon, PanelTop, List, UserCircle, Dialog
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { WireframeElement, ELEMENT_DEFAULTS } from '@/components/wireframe/types';
import WireframeCanvas from '@/components/wireframe/WireframeCanvas';
import PropertiesPanel from '@/components/wireframe/PropertiesPanel';

const TOOLS = [
  { section: 'Basic', items: [
    { id: 'select', icon: MousePointer, label: 'Select (V)' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'image', icon: Image, label: 'Image Placeholder' },
  ]},
  { section: 'Components', items: [
    { id: 'button', icon: RectangleHorizontal, label: 'Button' },
    { id: 'input', icon: PanelTop, label: 'Input Field' },
    { id: 'card', icon: LayoutDashboard, label: 'Card' },
    { id: 'navbar', icon: PanelTop, label: 'Navigation Bar' },
    { id: 'sidebar', icon: SidebarIcon, label: 'Sidebar' },
    { id: 'hero', icon: Layers, label: 'Hero Section' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'avatar', icon: UserCircle, label: 'Avatar' },
    { id: 'modal', icon: Dialog, label: 'Modal' },
  ]},
];

export default function WireframeEditor() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const [elements, setElements] = useState<WireframeElement[]>([]);
  const [selectedTool, setSelectedTool] = useState('select');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('My Wireframe');
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [showProps, setShowProps] = useState(true);

  // Undo/Redo
  const [history, setHistory] = useState<WireframeElement[][]>([[]]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const pushHistory = useCallback((newEls: WireframeElement[]) => {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newEls);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setElements(newEls);
  }, [history, historyIdx]);

  const undo = () => {
    if (historyIdx > 0) {
      setHistoryIdx(historyIdx - 1);
      setElements(history[historyIdx - 1]);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      setHistoryIdx(historyIdx + 1);
      setElements(history[historyIdx + 1]);
    }
  };

  const addElement = (type: WireframeElement['type'], x?: number, y?: number) => {
    const defaults = ELEMENT_DEFAULTS[type] || {};
    const el: WireframeElement = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      type,
      x: x ?? 100 + Math.random() * 200,
      y: y ?? 100 + Math.random() * 200,
      width: defaults.width || 160,
      height: defaults.height || 100,
      text: defaults.text,
      fillColor: defaults.fillColor || '#e2e8f0',
      strokeColor: defaults.strokeColor || '#94a3b8',
      borderRadius: defaults.borderRadius ?? 8,
      opacity: 1,
      locked: false,
      fontSize: defaults.fontSize,
    };
    pushHistory([...elements, el]);
    setSelectedId(el.id);
    setSelectedTool('select');
  };

  const deleteSelected = () => {
    if (!selectedId) return;
    pushHistory(elements.filter(e => e.id !== selectedId));
    setSelectedId(null);
  };

  const duplicateSelected = () => {
    const el = elements.find(e => e.id === selectedId);
    if (!el) return;
    const copy = { ...el, id: Date.now().toString(), x: el.x + 20, y: el.y + 20 };
    pushHistory([...elements, copy]);
    setSelectedId(copy.id);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('free_downloads_used').eq('user_id', user!.id).single();
      if (profile && profile.free_downloads_used >= 1) {
        window.open('https://checkout.fapshi.com/link/30934367', '_blank');
        setDownloading(false);
        return;
      }
      const el = canvasWrapperRef.current?.querySelector('.relative') as HTMLElement;
      if (!el) return;
      const origTransform = el.style.transform;
      el.style.transform = 'scale(1)';
      const canvas = await html2canvas(el, { scale: 2, backgroundColor: '#ffffff' });
      el.style.transform = origTransform;
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

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedId && !(e.target as HTMLElement).isContentEditable) deleteSelected(); }
    if (e.key === 'v') setSelectedTool('select');
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); duplicateSelected(); }
  }, [selectedId, elements, historyIdx]);

  const selectedElement = elements.find(e => e.id === selectedId) || null;

  return (
    <div className="h-screen flex flex-col bg-background" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <Input value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-0 w-40 md:w-60" />
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={historyIdx === 0} title="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={historyIdx >= history.length - 1} title="Redo (Ctrl+Y)">
            <Redo2 className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          {selectedId && (
            <>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={duplicateSelected} title="Duplicate (Ctrl+D)">
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={deleteSelected} title="Delete">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
              <div className="h-4 w-px bg-border mx-1" />
            </>
          )}
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowProps(!showProps)} title="Properties Panel">
            <PanelRight className="h-4 w-4" />
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline ml-1">Export</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <aside className="w-52 border-r border-border bg-background overflow-y-auto shrink-0">
          {TOOLS.map(section => (
            <div key={section.section}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1">{section.section}</p>
              <div className="grid grid-cols-3 gap-1 px-2 pb-2">
                {section.items.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-center ${selectedTool === tool.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'}`}
                    title={tool.label}
                  >
                    <tool.icon className="h-4 w-4" />
                    <span className="text-[9px] leading-tight">{tool.label.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Canvas */}
        <main ref={canvasWrapperRef} className="flex-1 overflow-auto bg-surface p-8">
          <WireframeCanvas
            elements={elements}
            selectedId={selectedId}
            tool={selectedTool}
            gridSize={20}
            zoom={zoom}
            onSelect={setSelectedId}
            onUpdate={(newEls) => pushHistory(newEls)}
            onAdd={addElement}
          />
        </main>

        {/* Properties panel */}
        {showProps && (
          <aside className="w-60 border-l border-border bg-background shrink-0">
            <PropertiesPanel
              element={selectedElement}
              onUpdate={(updated) => pushHistory(elements.map(e => e.id === updated.id ? updated : e))}
            />
          </aside>
        )}
      </div>
    </div>
  );
}
