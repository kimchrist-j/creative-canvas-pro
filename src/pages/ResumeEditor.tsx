import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { ResumeData, defaultResumeData } from '@/types/resume';
import EditorSidebar from '@/components/EditorSidebar';
import ResumePreview from '@/components/ResumePreview';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Download, ChevronLeft, Save, Loader2, Menu, X, ZoomIn, ZoomOut, FileText, Columns, AlignCenter, PenTool, Palette, Award, BookOpen, GraduationCap, Code2, Gem, Sparkles, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import LanguageToggle from '@/components/LanguageToggle';
import AIAssistant from '@/components/AIAssistant';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TEMPLATES = [
  { id: 'classic', label: 'Classic', icon: FileText, desc: 'Traditional two-column layout' },
  { id: 'modern', label: 'Modern', icon: Columns, desc: 'Dark sidebar with timeline' },
  { id: 'minimal', label: 'Minimal', icon: AlignCenter, desc: 'Clean centered design' },
  { id: 'bold', label: 'Bold', icon: PenTool, desc: 'Black hero header, editorial' },
  { id: 'creative', label: 'Creative', icon: Palette, desc: 'Yellow accent, graphic style' },
  { id: 'executive', label: 'Executive', icon: Award, desc: 'Cover banner, card layout' },
  { id: 'formal', label: 'Formal', icon: BookOpen, desc: 'No photo, traditional serif' },
  { id: 'academic', label: 'Academic', icon: GraduationCap, desc: 'Research/academic style' },
  { id: 'tech', label: 'Tech', icon: Code2, desc: 'Developer-focused, dark sidebar' },
  { id: 'elegant', label: 'Elegant', icon: Gem, desc: 'Sophisticated warm tones' },
];

export default function ResumeEditor() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [data, setData] = useState<ResumeData>(defaultResumeData);
  const [title, setTitle] = useState('My Resume');
  const [template, setTemplate] = useState('classic');
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [zoom, setZoom] = useState(0.55);
  const [saved, setSaved] = useState(true);
  const [showTemplates, setShowTemplates] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      supabase.from('resumes').select('*').eq('id', id).single().then(({ data: resume }) => {
        if (resume) {
          setTitle(resume.title);
          setTemplate(resume.template || 'classic');
          setData(resume.content as unknown as ResumeData);
        }
      });
    }
  }, [id]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      if (id && id !== 'new') {
        await supabase.from('resumes').update({ title, template, content: data as any, updated_at: new Date().toISOString() }).eq('id', id);
      } else {
        const { data: newResume } = await supabase.from('resumes').insert({ user_id: user.id, title, template, content: data as any }).select().single();
        if (newResume) navigate(`/editor/${newResume.id}`, { replace: true });
      }
      setSaved(true);
      toast({ title: 'Saved!', description: 'Your resume has been saved.' });
    } catch (err: any) {
      toast({ title: 'Error saving', description: err.message, variant: 'destructive' });
    }
    setSaving(false);
  };

  const handleChange = (newData: ResumeData) => { setData(newData); setSaved(false); };

  const handleDownload = async () => {
    if (!user) return;
    setDownloading(true);
    try {
      const { data: profile } = await supabase.from('profiles').select('free_downloads_used').eq('user_id', user.id).single();
      if (profile && profile.free_downloads_used >= 1) {
        window.open('https://checkout.fapshi.com/link/30934367', '_blank');
        setDownloading(false);
        return;
      }
      const el = document.getElementById('resume-preview');
      if (!el) return;
      const origTransform = el.style.transform;
      el.style.transform = 'scale(1)';
      const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      el.style.transform = origTransform;
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfW, pdfH);
      pdf.save(`${title || 'resume'}.pdf`);
      await supabase.from('profiles').update({ free_downloads_used: (profile?.free_downloads_used || 0) + 1 }).eq('user_id', user.id);
      toast({ title: 'Downloaded!', description: 'Your resume has been downloaded as PDF.' });
    } catch (err: any) {
      toast({ title: 'Download failed', description: err.message, variant: 'destructive' });
    }
    setDownloading(false);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="h-14 border-b border-border flex items-center justify-between px-2 md:px-4 bg-background shrink-0 gap-2 min-w-0">
        <div className="flex items-center gap-1 md:gap-3 min-w-0 flex-1">
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')} className="shrink-0 px-2">
            <ChevronLeft className="h-4 w-4 md:mr-1" /> <span className="hidden md:inline">Back</span>
          </Button>
          <div className="hidden sm:block h-4 w-px bg-border shrink-0" />
          <Input value={title} onChange={e => { setTitle(e.target.value); setSaved(false); }}
            className="h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-0 min-w-0 flex-1 max-w-[200px] md:max-w-60" />
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <div className={`h-2 w-2 rounded-full ${saved ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-muted-foreground">{saved ? 'Saved' : 'Unsaved'}</span>
          </div>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <Button variant="outline" size="sm" onClick={() => setAiOpen(true)} className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/30">
            <Sparkles className="h-4 w-4 mr-1 text-primary" /> AI
          </Button>
          <div className="relative">
            <Button variant="outline" size="sm" onClick={() => setShowTemplates(!showTemplates)}>
              <FileText className="h-4 w-4 mr-1" /> {t('editor.template')}
            </Button>
            {showTemplates && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-xl z-50 p-2 max-h-80 overflow-y-auto">
                {TEMPLATES.map(tp => (
                  <button key={tp.id}
                    onClick={() => { setTemplate(tp.id); setShowTemplates(false); setSaved(false); }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${template === tp.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-hover text-foreground'}`}>
                    <tp.icon className="h-5 w-5 shrink-0" />
                    <div><p className="text-sm font-medium">{tp.label}</p><p className="text-xs text-muted-foreground">{tp.desc}</p></div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 mr-2">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setZoom(Math.min(1, zoom + 0.1))}>
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span className="hidden sm:inline ml-1">{t('editor.save')}</span>
          </Button>
          <Button size="sm" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="hidden sm:inline ml-1">{t('editor.download')}</span>
          </Button>
        </div>

        {/* Mobile actions: primary buttons + overflow menu */}
        <div className="flex md:hidden items-center gap-1 shrink-0">
          <Button variant="outline" size="icon" onClick={handleSave} disabled={saving} className="h-8 w-8">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          </Button>
          <Button size="icon" onClick={handleDownload} disabled={downloading} className="h-8 w-8">
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-popover">
              <DropdownMenuItem onClick={() => setAiOpen(true)}>
                <Sparkles className="h-4 w-4 mr-2 text-primary" /> AI Assistant
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowTemplates(true)}>
                <FileText className="h-4 w-4 mr-2" /> Change Template
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs text-muted-foreground">Zoom</span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(Math.max(0.3, zoom - 0.1))}>
                    <ZoomOut className="h-3 w-3" />
                  </Button>
                  <span className="text-xs w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setZoom(Math.min(1, zoom + 0.1))}>
                    <ZoomIn className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="px-2 py-1.5">
                <LanguageToggle />
              </div>
              <DropdownMenuSeparator />
              <div className="flex items-center gap-2 px-2 py-1.5">
                <div className={`h-2 w-2 rounded-full ${saved ? 'bg-green-500' : 'bg-yellow-500'}`} />
                <span className="text-xs text-muted-foreground">{saved ? 'Saved' : 'Unsaved'}</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Mobile template picker overlay */}
      {showTemplates && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 flex items-end" onClick={() => setShowTemplates(false)}>
          <div className="w-full bg-card border-t border-border rounded-t-2xl p-3 max-h-[70vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3 px-2">
              <span className="text-sm font-semibold">Choose Template</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowTemplates(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {TEMPLATES.map(tp => (
              <button key={tp.id}
                onClick={() => { setTemplate(tp.id); setShowTemplates(false); setSaved(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${template === tp.id ? 'bg-primary/10 text-primary' : 'hover:bg-surface-hover text-foreground'}`}>
                <tp.icon className="h-5 w-5 shrink-0" />
                <div><p className="text-sm font-medium">{tp.label}</p><p className="text-xs text-muted-foreground">{tp.desc}</p></div>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden min-w-0">
        <aside className={`${sidebarOpen ? 'w-80 md:w-72 lg:w-80' : 'w-0'} shrink-0 border-r border-border bg-background transition-all overflow-hidden absolute lg:relative z-10 h-[calc(100vh-3.5rem)] lg:h-auto`}>
          <EditorSidebar data={data} onChange={handleChange} />
        </aside>
        <main className="flex-1 overflow-auto bg-surface p-4 md:p-8 flex justify-center min-w-0">
          <div style={{ width: 794 * zoom, height: 1123 * zoom }} className="shrink-0">
            <ResumePreview data={data} scale={zoom} template={template} />
          </div>
        </main>
      </div>
      <AIAssistant open={aiOpen} onClose={() => setAiOpen(false)} resume={data} onApplyGenerated={(d) => { setData(d); setSaved(false); }} />
    </div>
  );
}
