import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import {
  ChevronLeft, Download, Loader2, MousePointer, Square, Circle, Type, Minus, Image,
  Undo2, Redo2, ZoomIn, ZoomOut, Trash2, Copy, Layers, PanelRight, Code2,
  RectangleHorizontal, LayoutDashboard, SidebarIcon, PanelTop, List, UserCircle,
  Square as DialogIcon, FileText, Table2, PanelTopClose, ChevronDown, ToggleLeft,
  BarChart3, Award, Navigation, CreditCard, MessageSquareQuote, LayoutGrid, Megaphone,
  Mail, LogIn, UserPlus, Search, GalleryHorizontalEnd, ListCollapse, AlertTriangle,
  Info, MinusSquare, Video, Map, Share2, TrendingUp, Users, HelpCircle,
  Smartphone, AppWindow, Grip, Plus, ListOrdered, Menu, CircleDot, SlidersHorizontal,
  Layers3, MessageSquare, Monitor
} from 'lucide-react';
import JSZip from 'jszip';
import { WireframeElement, ELEMENT_DEFAULTS, ElementType, DeviceFrame, Framework, DEVICE_FRAMES } from '@/components/wireframe/types';
import WireframeCanvas from '@/components/wireframe/WireframeCanvas';
import PropertiesPanel from '@/components/wireframe/PropertiesPanel';
import CodePanel from '@/components/wireframe/CodePanel';
import DeviceFrameWrapper from '@/components/wireframe/DeviceFrame';
import { generateCode } from '@/components/wireframe/CodeGenerator';

const TOOLS = [
  { section: 'Basic', items: [
    { id: 'select', icon: MousePointer, label: 'Select (V)' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'image', icon: Image, label: 'Image' },
    { id: 'divider', icon: MinusSquare, label: 'Divider' },
  ]},
  { section: 'Web UI', items: [
    { id: 'button', icon: RectangleHorizontal, label: 'Button' },
    { id: 'input', icon: PanelTopClose, label: 'Input' },
    { id: 'card', icon: LayoutDashboard, label: 'Card' },
    { id: 'navbar', icon: PanelTop, label: 'Navbar' },
    { id: 'sidebar', icon: SidebarIcon, label: 'Sidebar' },
    { id: 'footer', icon: FileText, label: 'Footer' },
    { id: 'hero', icon: Layers, label: 'Hero' },
    { id: 'modal', icon: DialogIcon, label: 'Modal' },
    { id: 'table', icon: Table2, label: 'Table' },
    { id: 'tabs', icon: LayoutGrid, label: 'Tabs' },
    { id: 'dropdown', icon: ChevronDown, label: 'Dropdown' },
    { id: 'search-bar', icon: Search, label: 'Search' },
    { id: 'list', icon: List, label: 'List' },
    { id: 'avatar', icon: UserCircle, label: 'Avatar' },
  ]},
  { section: 'Forms', items: [
    { id: 'form', icon: FileText, label: 'Form' },
    { id: 'login-form', icon: LogIn, label: 'Login' },
    { id: 'signup-form', icon: UserPlus, label: 'Sign Up' },
    { id: 'contact-form', icon: Mail, label: 'Contact' },
    { id: 'checkbox', icon: Square, label: 'Checkbox' },
    { id: 'radio', icon: CircleDot, label: 'Radio' },
    { id: 'toggle', icon: ToggleLeft, label: 'Toggle' },
  ]},
  { section: 'Sections', items: [
    { id: 'pricing-card', icon: CreditCard, label: 'Pricing' },
    { id: 'testimonial', icon: MessageSquareQuote, label: 'Testimonial' },
    { id: 'feature-grid', icon: LayoutGrid, label: 'Features' },
    { id: 'cta-section', icon: Megaphone, label: 'CTA' },
    { id: 'stats-section', icon: TrendingUp, label: 'Stats' },
    { id: 'team-section', icon: Users, label: 'Team' },
    { id: 'faq-section', icon: HelpCircle, label: 'FAQ' },
    { id: 'carousel', icon: GalleryHorizontalEnd, label: 'Carousel' },
  ]},
  { section: 'Extras', items: [
    { id: 'accordion', icon: ListCollapse, label: 'Accordion' },
    { id: 'alert', icon: AlertTriangle, label: 'Alert' },
    { id: 'badge', icon: Award, label: 'Badge' },
    { id: 'progress', icon: BarChart3, label: 'Progress' },
    { id: 'tooltip-el', icon: Info, label: 'Tooltip' },
    { id: 'breadcrumb', icon: Navigation, label: 'Breadcrumb' },
    { id: 'video-player', icon: Video, label: 'Video' },
    { id: 'map-embed', icon: Map, label: 'Map' },
    { id: 'social-links', icon: Share2, label: 'Social' },
  ]},
  { section: 'Mobile', items: [
    { id: 'mobile-status-bar', icon: Smartphone, label: 'Status Bar' },
    { id: 'mobile-app-bar', icon: AppWindow, label: 'App Bar' },
    { id: 'mobile-tab-bar', icon: Grip, label: 'Tab Bar' },
    { id: 'mobile-fab', icon: Plus, label: 'FAB' },
    { id: 'mobile-list-item', icon: ListOrdered, label: 'List Item' },
    { id: 'mobile-card', icon: LayoutDashboard, label: 'Card' },
    { id: 'mobile-search', icon: Search, label: 'Search' },
    { id: 'mobile-drawer', icon: Menu, label: 'Drawer' },
    { id: 'mobile-bottom-sheet', icon: Layers3, label: 'Sheet' },
    { id: 'mobile-chip', icon: Award, label: 'Chip' },
    { id: 'mobile-switch', icon: SlidersHorizontal, label: 'Switch' },
    { id: 'mobile-snackbar', icon: MessageSquare, label: 'Snackbar' },
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
  const [title, setTitle] = useState('My App');
  const [downloading, setDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.7);
  const [showProps, setShowProps] = useState(true);
  const [showCode, setShowCode] = useState(false);
  const [framework, setFramework] = useState<Framework>('react');
  const [deviceFrame, setDeviceFrame] = useState<DeviceFrame>('none');
  const [toolSearch, setToolSearch] = useState('');

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

  const undo = () => { if (historyIdx > 0) { setHistoryIdx(historyIdx - 1); setElements(history[historyIdx - 1]); } };
  const redo = () => { if (historyIdx < history.length - 1) { setHistoryIdx(historyIdx + 1); setElements(history[historyIdx + 1]); } };

  const addElement = (type: ElementType, x?: number, y?: number) => {
    const defaults = ELEMENT_DEFAULTS[type] || {};
    const frameConfig = DEVICE_FRAMES[deviceFrame];
    const el: WireframeElement = {
      id: Date.now().toString() + Math.random().toString(36).slice(2, 6),
      type,
      x: x ?? 20 + Math.random() * Math.min(200, frameConfig.width - 200),
      y: y ?? 20 + Math.random() * Math.min(200, frameConfig.height - 200),
      width: Math.min(defaults.width || 160, frameConfig.width - 20),
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

  const deleteSelected = () => { if (!selectedId) return; pushHistory(elements.filter(e => e.id !== selectedId)); setSelectedId(null); };

  const duplicateSelected = () => {
    const el = elements.find(e => e.id === selectedId);
    if (!el) return;
    const copy = { ...el, id: Date.now().toString(), x: el.x + 20, y: el.y + 20 };
    pushHistory([...elements, copy]);
    setSelectedId(copy.id);
  };

  const handleDownloadCode = async () => {
    setDownloading(true);
    try {
      // Check payment status
      const { data: profile } = await supabase.from('profiles').select('free_downloads_used').eq('user_id', user!.id).single();
      if (profile && profile.free_downloads_used >= 1) {
        toast({
          title: 'Payment Required',
          description: 'Your free download has been used. You will be redirected to complete payment. After payment, return here and click download again.',
          variant: 'destructive',
        });
        setTimeout(() => window.open('https://checkout.fapshi.com/link/30934367', '_blank'), 1500);
        setDownloading(false);
        return;
      }

      const files = generateCode(elements, framework, title);
      const zip = new JSZip();
      Object.entries(files).forEach(([path, content]) => {
        zip.file(path, content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}-${framework}.zip`;
      a.click();
      URL.revokeObjectURL(url);

      await supabase.from('profiles').update({ free_downloads_used: (profile?.free_downloads_used || 0) + 1 }).eq('user_id', user!.id);
      toast({ title: 'Downloaded!', description: `${framework === 'react' ? 'React' : framework === 'react-native' ? 'React Native' : 'HTML/CSS/JS'} project exported as ZIP.` });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    }
    setDownloading(false);
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Delete' || e.key === 'Backspace') { if (selectedId && !(e.target as HTMLElement).isContentEditable) deleteSelected(); }
    if (e.key === 'v' && !(e.target as HTMLElement).isContentEditable) setSelectedTool('select');
    if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); undo(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'y') { e.preventDefault(); redo(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'd') { e.preventDefault(); duplicateSelected(); }
  }, [selectedId, elements, historyIdx]);

  const selectedElement = elements.find(e => e.id === selectedId) || null;
  const frameConfig = DEVICE_FRAMES[deviceFrame];

  // Filter tools by search
  const filteredTools = toolSearch
    ? TOOLS.map(section => ({
        ...section,
        items: section.items.filter(t => t.label.toLowerCase().includes(toolSearch.toLowerCase())),
      })).filter(s => s.items.length > 0)
    : TOOLS;

  return (
    <div className="h-screen flex flex-col bg-background" tabIndex={0} onKeyDown={handleKeyDown}>
      {/* Top bar */}
      <header className="h-12 border-b border-border flex items-center justify-between px-3 shrink-0 bg-background">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <div className="h-4 w-px bg-border" />
          <Input value={title} onChange={e => setTitle(e.target.value)} className="h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-0 w-32 md:w-48" />
        </div>

        <div className="flex items-center gap-1">
          {/* Device Frame Selector */}
          <Select value={deviceFrame} onValueChange={(v) => setDeviceFrame(v as DeviceFrame)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <Monitor className="h-3 w-3 mr-1" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(DEVICE_FRAMES).map(([key, val]) => (
                <SelectItem key={key} value={key}>{val.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="h-4 w-px bg-border mx-1" />

          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={historyIdx === 0}><Undo2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={historyIdx >= history.length - 1}><Redo2 className="h-4 w-4" /></Button>

          {selectedId && (
            <>
              <div className="h-4 w-px bg-border mx-1" />
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={duplicateSelected}><Copy className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={deleteSelected}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </>
          )}

          <div className="h-4 w-px bg-border mx-1" />
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}><ZoomOut className="h-4 w-4" /></Button>
          <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}><ZoomIn className="h-4 w-4" /></Button>

          <div className="h-4 w-px bg-border mx-1" />
          <Button variant={showCode ? 'default' : 'ghost'} size="icon" className="h-8 w-8" onClick={() => setShowCode(!showCode)} title="Code Panel">
            <Code2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowProps(!showProps)} title="Properties">
            <PanelRight className="h-4 w-4" />
          </Button>

          <Button size="sm" onClick={handleDownloadCode} disabled={downloading || elements.length === 0} className="ml-1">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline ml-1">Download</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Toolbox */}
        <aside className="w-52 border-r border-border bg-background overflow-y-auto shrink-0">
          <div className="p-2">
            <Input
              placeholder="Search components..."
              value={toolSearch}
              onChange={e => setToolSearch(e.target.value)}
              className="h-7 text-xs"
            />
          </div>
          {filteredTools.map(section => (
            <div key={section.section}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-3 pt-2 pb-1">{section.section}</p>
              <div className="grid grid-cols-3 gap-1 px-2 pb-1">
                {section.items.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg transition-colors text-center ${selectedTool === tool.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}
                    title={tool.label}
                  >
                    <tool.icon className="h-3.5 w-3.5" />
                    <span className="text-[8px] leading-tight">{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>

        {/* Canvas */}
        <main ref={canvasWrapperRef} className="flex-1 overflow-auto bg-muted/30 flex items-start justify-center p-8">
          <DeviceFrameWrapper frame={deviceFrame}>
            <WireframeCanvas
              elements={elements}
              selectedId={selectedId}
              tool={selectedTool}
              gridSize={deviceFrame === 'none' ? 20 : 8}
              zoom={zoom}
              onSelect={setSelectedId}
              onUpdate={(newEls) => pushHistory(newEls)}
              onAdd={addElement}
              canvasWidth={frameConfig.width}
              canvasHeight={frameConfig.height}
            />
          </DeviceFrameWrapper>
        </main>

        {/* Code panel */}
        {showCode && (
          <CodePanel
            elements={elements}
            framework={framework}
            onFrameworkChange={setFramework}
            projectName={title}
            open={showCode}
            onToggle={() => setShowCode(!showCode)}
          />
        )}

        {/* Properties panel */}
        {showProps && (
          <aside className="w-56 border-l border-border bg-background shrink-0">
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
