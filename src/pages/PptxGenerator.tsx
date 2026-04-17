import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';
import { ChevronLeft, Loader2, Sparkles, Download, Wand2 } from 'lucide-react';

const TEMPLATES = [
  { id: 'midnight', name: 'Midnight Executive', desc: 'Navy + ice blue, premium feel', colors: ['#1E2761', '#CADCFC', '#F96167'] },
  { id: 'coral', name: 'Coral Energy', desc: 'Bold coral with gold accents', colors: ['#F96167', '#F9E795', '#2F3C7E'] },
  { id: 'forest', name: 'Forest Calm', desc: 'Earthy greens, modern feel', colors: ['#2C5F2D', '#97BC62', '#F5F7F0'] },
  { id: 'minimal', name: 'Charcoal Minimal', desc: 'Clean, professional', colors: ['#212121', '#36454F', '#F2F2F2'] },
];

export default function PptxGenerator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang } = useLanguage();
  const [topic, setTopic] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [template, setTemplate] = useState('midnight');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) { toast({ title: 'Add a topic', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pptx-generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ topic, slideCount, template, language: lang }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) throw new Error('Too many requests, try again in a moment.');
        if (resp.status === 402) throw new Error('AI credits exhausted. Add credits in workspace settings.');
        throw new Error(err.error || 'Generation failed');
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${topic.replace(/[^a-z0-9]/gi, '_').slice(0, 40)}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Slides ready!', description: 'Your PowerPoint has been downloaded.' });
    } catch (err: any) {
      toast({ title: 'Generation failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <LanguageToggle />
      </header>

      <main className="max-w-3xl mx-auto p-6 md:p-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">AI PowerPoint Generator</h1>
            <p className="text-sm text-muted-foreground">Describe your topic, pick a template, get a polished deck.</p>
          </div>
        </div>

        <div className="space-y-5 bg-card border border-border rounded-2xl p-6">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Topic / Description</label>
            <Input
              placeholder="e.g. Climate change in West Africa for high school students"
              value={topic}
              onChange={e => setTopic(e.target.value)}
              className="h-11"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Slides</label>
            <div className="flex gap-2">
              {[4, 6, 8, 10].map(n => (
                <button
                  key={n}
                  onClick={() => setSlideCount(n)}
                  className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${slideCount === n ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-surface-hover'}`}
                >{n}</button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Template</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEMPLATES.map(tp => (
                <button
                  key={tp.id}
                  onClick={() => setTemplate(tp.id)}
                  className={`text-left p-4 rounded-xl border transition ${template === tp.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:bg-surface-hover'}`}
                >
                  <div className="flex gap-1.5 mb-2">
                    {tp.colors.map(c => <div key={c} className="h-6 w-6 rounded-md" style={{ background: c }} />)}
                  </div>
                  <p className="text-sm font-semibold text-foreground">{tp.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{tp.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <Button onClick={generate} disabled={loading} className="w-full h-11">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
            {loading ? 'Generating slides...' : 'Generate & Download .pptx'}
          </Button>
        </div>
      </main>
    </div>
  );
}
