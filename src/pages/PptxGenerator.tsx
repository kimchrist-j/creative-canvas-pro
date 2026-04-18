import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import LanguageToggle from '@/components/LanguageToggle';
import { ChevronLeft, Loader2, Sparkles, Wand2, Download, ChevronRight, Play, Maximize2, X } from 'lucide-react';

const TEMPLATES = [
  { id: 'midnight', name: 'Midnight Executive', desc: 'Navy + coral, premium feel', colors: ['#0F1735', '#F96167', '#CADCFC'] },
  { id: 'coral', name: 'Coral Energy', desc: 'Bold coral with gold accents', colors: ['#F96167', '#F9E795', '#2F3C7E'] },
  { id: 'forest', name: 'Forest Calm', desc: 'Earthy greens, modern feel', colors: ['#2C5F2D', '#97BC62', '#D4A24C'] },
  { id: 'minimal', name: 'Charcoal Minimal', desc: 'Clean, professional', colors: ['#212121', '#707070', '#F96167'] },
];

const THEMES: Record<string, any> = {
  midnight: { bg: '#0F1735', bgAlt: '#1A2354', titleBg: '#07102A', primary: '#F96167', secondary: '#CADCFC', accent: '#FFD166', text: '#FFFFFF', subtext: '#B8C4E0', titleFont: 'Georgia, serif', bodyFont: 'Calibri, sans-serif' },
  coral:    { bg: '#FFFBF5', bgAlt: '#FFF1E6', titleBg: '#F96167', primary: '#F96167', secondary: '#2F3C7E', accent: '#F9E795', text: '#1A1A2E', subtext: '#555555', titleFont: '"Trebuchet MS", sans-serif', bodyFont: 'Calibri, sans-serif' },
  forest:   { bg: '#F5F7F0', bgAlt: '#E8EDD8', titleBg: '#2C5F2D', primary: '#2C5F2D', secondary: '#97BC62', accent: '#D4A24C', text: '#1A2810', subtext: '#4A5C3A', titleFont: 'Cambria, serif', bodyFont: 'Calibri, sans-serif' },
  minimal:  { bg: '#FFFFFF', bgAlt: '#F2F2F2', titleBg: '#212121', primary: '#212121', secondary: '#707070', accent: '#F96167', text: '#212121', subtext: '#707070', titleFont: 'Arial, sans-serif', bodyFont: 'Arial, sans-serif' },
};

const imgUrl = (q: string) => `https://source.unsplash.com/1200x800/?${encodeURIComponent(q || 'abstract')}`;

// Renders a single slide at 1920x1080 logical, scaled by parent
function SlideRender({ slide, theme, idx, total, deckTitle, isCover, coverData }: any) {
  const t = theme;
  if (isCover) {
    return (
      <div className="absolute inset-0" style={{ background: t.titleBg, fontFamily: t.bodyFont }}>
        <div className="absolute" style={{ left: '52.5%', top: 0, width: '47.5%', height: '100%', backgroundImage: `url(${imgUrl(coverData.coverImageQuery || deckTitle)})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute" style={{ left: '52.5%', top: 0, width: '47.5%', height: '100%', background: t.titleBg, opacity: 0.5 }} />
        <div className="absolute" style={{ left: '3.75%', top: '32%', width: '1.1%', height: '24%', background: t.primary }} />
        <div className="absolute" style={{ left: '6.4%', top: '32%', width: '45%' }}>
          <h1 style={{ fontSize: '4rem', fontWeight: 700, color: '#FFFFFF', fontFamily: t.titleFont, lineHeight: 1.1, margin: 0 }}>{coverData.title || deckTitle}</h1>
          <p style={{ fontSize: '1.4rem', color: t.secondary, fontStyle: 'italic', marginTop: '1.5rem' }}>{coverData.subtitle}</p>
        </div>
        <div className="absolute" style={{ left: '6.4%', bottom: '8%', fontSize: '0.85rem', color: t.secondary, letterSpacing: '0.5em', fontWeight: 700 }}>PRESENTATION</div>
      </div>
    );
  }

  const isAlt = (idx - 1) % 2 === 1;
  const bg = isAlt ? t.bgAlt : t.bg;
  const cardBg = isAlt ? t.bg : t.bgAlt;

  const Header = () => (
    <>
      <div className="absolute flex items-center justify-center" style={{ right: '3.75%', top: '4%', width: '4.1%', height: '7.3%', borderRadius: '50%', background: t.primary, color: '#FFF', fontSize: '0.95rem', fontWeight: 700 }}>
        {String(idx + 1).padStart(2, '0')}
      </div>
      <div className="absolute" style={{ left: '5%', bottom: '4%', fontSize: '0.7rem', color: t.subtext, fontFamily: t.bodyFont }}>{deckTitle}</div>
    </>
  );

  if (slide.layout === 'split') {
    return (
      <div className="absolute inset-0" style={{ background: bg, fontFamily: t.bodyFont }}>
        <div className="absolute" style={{ left: 0, top: 0, width: '45%', height: '100%', backgroundImage: `url(${imgUrl(slide.imageQuery || slide.heading)})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: t.primary }} />
        <div className="absolute" style={{ left: '49%', top: '13.3%', width: '4%', height: '1%', background: t.primary }} />
        <div className="absolute" style={{ left: '49%', top: '16%', width: '47%' }}>
          <h2 style={{ fontSize: '2.6rem', fontWeight: 700, color: t.text, fontFamily: t.titleFont, margin: 0, lineHeight: 1.15 }}>{slide.heading}</h2>
          <ul style={{ marginTop: '1.5rem', padding: 0, listStyle: 'none' }}>
            {(slide.bullets || []).map((b: string, i: number) => (
              <li key={i} style={{ fontSize: '1.1rem', color: t.text, marginBottom: '0.7rem', paddingLeft: '1.2rem', position: 'relative' }}>
                <span style={{ position: 'absolute', left: 0, color: t.primary }}>●</span>{b}
              </li>
            ))}
          </ul>
        </div>
        <Header />
      </div>
    );
  }

  if (slide.layout === 'grid') {
    const cards = slide.cards || (slide.bullets || []).slice(0, 4).map((b: string) => ({ title: b.split(':')[0]?.slice(0, 30) || b.slice(0, 20), body: b }));
    const cols = cards.length > 2 ? 2 : cards.length || 1;
    return (
      <div className="absolute inset-0" style={{ background: bg, fontFamily: t.bodyFont }}>
        <h2 style={{ position: 'absolute', left: '5%', top: '6.6%', fontSize: '2.4rem', fontWeight: 700, color: t.text, fontFamily: t.titleFont, margin: 0 }}>{slide.heading}</h2>
        <div style={{ position: 'absolute', left: '5%', top: '20%', width: '4.5%', height: '0.8%', background: t.primary }} />
        <div className="absolute grid gap-3" style={{ left: '5%', top: '26.6%', width: '90%', height: '60%', gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {cards.slice(0, 4).map((c: any, i: number) => (
            <div key={i} className="relative p-4" style={{ background: cardBg, borderRadius: 4 }}>
              <div style={{ position: 'absolute', left: 0, top: 0, width: 4, height: '100%', background: t.primary }} />
              <div style={{ fontSize: '0.85rem', color: t.primary, fontWeight: 700, marginLeft: '0.5rem' }}>0{i + 1}</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 700, color: t.text, fontFamily: t.titleFont, marginTop: '0.4rem', marginLeft: '0.5rem' }}>{c.title}</div>
              <div style={{ fontSize: '0.85rem', color: t.subtext, marginTop: '0.4rem', marginLeft: '0.5rem' }}>{c.body}</div>
            </div>
          ))}
        </div>
        <Header />
      </div>
    );
  }

  if (slide.layout === 'stats') {
    const stats = slide.stats || (slide.bullets || []).slice(0, 3).map((b: string) => ({ value: b.match(/\d+%?/)?.[0] || '•', label: b }));
    return (
      <div className="absolute inset-0" style={{ background: bg, fontFamily: t.bodyFont }}>
        <h2 style={{ position: 'absolute', left: '5%', top: '6.6%', fontSize: '2.4rem', fontWeight: 700, color: t.text, fontFamily: t.titleFont, margin: 0 }}>{slide.heading}</h2>
        <div style={{ position: 'absolute', left: '5%', top: '20%', width: '4.5%', height: '0.8%', background: t.primary }} />
        <div className="absolute flex" style={{ left: '5%', top: '33%', width: '90%', height: '50%' }}>
          {stats.slice(0, 3).map((s: any, i: number) => (
            <div key={i} className="flex-1 flex flex-col items-center text-center px-2">
              <div style={{ fontSize: '4.5rem', fontWeight: 700, color: t.primary, fontFamily: t.titleFont, lineHeight: 1 }}>{s.value}</div>
              <div style={{ width: 40, height: 3, background: t.accent, marginTop: '1rem' }} />
              <div style={{ fontSize: '1rem', color: t.text, marginTop: '1rem', maxWidth: '80%' }}>{s.label}</div>
            </div>
          ))}
        </div>
        <Header />
      </div>
    );
  }

  if (slide.layout === 'quote') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: t.titleBg, fontFamily: t.bodyFont, backgroundImage: `linear-gradient(${t.titleBg}aa, ${t.titleBg}aa), url(${imgUrl(slide.imageQuery || slide.heading)})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div style={{ fontSize: '8rem', color: t.primary, fontFamily: t.titleFont, fontWeight: 700, lineHeight: 0.5, marginBottom: '1rem' }}>"</div>
        <p style={{ fontSize: '1.8rem', fontStyle: 'italic', color: '#FFFFFF', fontFamily: t.titleFont, maxWidth: '70%', textAlign: 'center', margin: 0 }}>{slide.quote || slide.heading}</p>
        {slide.quoteAuthor && <p style={{ fontSize: '1rem', color: t.secondary, marginTop: '2rem' }}>— {slide.quoteAuthor}</p>}
        <Header />
      </div>
    );
  }

  if (slide.layout === 'conclusion') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: t.titleBg, fontFamily: t.bodyFont, backgroundImage: `linear-gradient(${t.titleBg}cc, ${t.titleBg}cc), url(${imgUrl(slide.imageQuery || 'celebration teamwork success')})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <h1 style={{ fontSize: '5rem', fontWeight: 700, color: '#FFFFFF', fontFamily: t.titleFont, letterSpacing: '0.15em', margin: 0 }}>THANK YOU</h1>
        <div style={{ width: 80, height: 4, background: t.primary, margin: '1.5rem 0' }} />
        <p style={{ fontSize: '1.2rem', color: t.secondary, fontStyle: 'italic' }}>{slide.heading || deckTitle}</p>
        <Header />
      </div>
    );
  }

  // fallback
  return (
    <div className="absolute inset-0" style={{ background: bg, fontFamily: t.bodyFont }}>
      <h2 style={{ position: 'absolute', left: '5%', top: '6.6%', fontSize: '2.4rem', fontWeight: 700, color: t.text, fontFamily: t.titleFont }}>{slide.heading}</h2>
      <ul style={{ position: 'absolute', left: '5%', top: '26%', width: '90%', padding: 0, listStyle: 'none' }}>
        {(slide.bullets || []).map((b: string, i: number) => (
          <li key={i} style={{ fontSize: '1.15rem', color: t.text, marginBottom: '1rem', paddingLeft: '1.2rem', position: 'relative' }}>
            <span style={{ position: 'absolute', left: 0, color: t.primary }}>●</span>{b}
          </li>
        ))}
      </ul>
      <Header />
    </div>
  );
}

// 16:9 slide canvas — scales to fit container
function SlideCanvas({ children, className = '' }: any) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: '16 / 9' }}>
      <div className="absolute inset-0 overflow-hidden rounded-xl shadow-2xl border border-border">
        {children}
      </div>
    </div>
  );
}

export default function PptxGenerator() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { lang } = useLanguage();
  const [topic, setTopic] = useState('');
  const [filename, setFilename] = useState('');
  const [slideCount, setSlideCount] = useState(6);
  const [template, setTemplate] = useState('midnight');
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [deck, setDeck] = useState<any>(null);
  const [current, setCurrent] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const theme = THEMES[template];
  const slides = deck ? [{ isCover: true, ...deck }, ...(deck.slides || [])] : [];

  const generate = async () => {
    if (!topic.trim()) { toast({ title: 'Add a topic', variant: 'destructive' }); return; }
    setLoading(true); setDeck(null); setCurrent(0);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pptx-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ mode: 'outline', topic, slideCount, language: lang }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        if (resp.status === 429) throw new Error('Too many requests, try again in a moment.');
        if (resp.status === 402) throw new Error('AI credits exhausted.');
        throw new Error(err.error || 'Generation failed');
      }
      const { deck: d } = await resp.json();
      setDeck(d);
      if (!filename) setFilename((d.title || topic).replace(/[^a-z0-9 ]/gi, '').slice(0, 40));
      toast({ title: 'Preview ready', description: 'Flip through slides, then download.' });
    } catch (err: any) {
      toast({ title: 'Generation failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const download = async () => {
    if (!deck) return;
    setDownloading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/pptx-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ mode: 'pptx', deck, template, topic }),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Download failed');
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(filename || 'presentation').replace(/[^a-z0-9 _-]/gi, '_')}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: 'Downloaded!', description: 'Your PowerPoint is ready.' });
    } catch (err: any) {
      toast({ title: 'Download failed', description: err.message, variant: 'destructive' });
    }
    setDownloading(false);
  };

  const next = () => setCurrent(c => Math.min(c + 1, slides.length - 1));
  const prev = () => setCurrent(c => Math.max(c - 1, 0));

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <header className="h-14 border-b border-border flex items-center justify-between px-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <LanguageToggle />
      </header>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground truncate">AI PowerPoint Generator</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Generate, preview live, then download.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[380px_1fr] gap-6">
          {/* CONTROLS */}
          <div className="space-y-5 bg-card border border-border rounded-2xl p-5 h-fit">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Topic / Description</label>
              <Input placeholder="e.g. Climate change in West Africa" value={topic} onChange={e => setTopic(e.target.value)} className="h-11" />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Slides</label>
              <div className="flex gap-2">
                {[4, 6, 8, 10].map(n => (
                  <button key={n} onClick={() => setSlideCount(n)}
                    className={`flex-1 py-2 rounded-lg border text-sm font-medium transition ${slideCount === n ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:bg-surface-hover'}`}>{n}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Template</label>
              <div className="grid grid-cols-1 gap-2">
                {TEMPLATES.map(tp => (
                  <button key={tp.id} onClick={() => setTemplate(tp.id)}
                    className={`text-left p-3 rounded-xl border transition ${template === tp.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-border hover:bg-surface-hover'}`}>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1 shrink-0">
                        {tp.colors.map(c => <div key={c} className="h-8 w-3 rounded-sm" style={{ background: c }} />)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{tp.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{tp.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generate} disabled={loading} className="w-full h-11">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {loading ? 'Generating outline...' : deck ? 'Regenerate' : 'Generate Preview'}
            </Button>

            {deck && (
              <>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">File name</label>
                  <div className="flex items-center gap-1">
                    <Input value={filename} onChange={e => setFilename(e.target.value)} className="h-10" />
                    <span className="text-xs text-muted-foreground">.pptx</span>
                  </div>
                </div>
                <Button onClick={download} disabled={downloading} variant="default" className="w-full h-11">
                  {downloading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  {downloading ? 'Building .pptx...' : 'Download .pptx'}
                </Button>
              </>
            )}
          </div>

          {/* PREVIEW */}
          <div className="min-w-0">
            {!deck ? (
              <div className="bg-card border border-border border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center text-center p-6">
                <Play className="h-10 w-10 text-muted-foreground mb-3" />
                <p className="text-foreground font-medium">Live preview appears here</p>
                <p className="text-sm text-muted-foreground mt-1">Generate an outline to flip through slides before downloading.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <SlideCanvas>
                  <SlideRender
                    slide={slides[current]}
                    theme={theme}
                    idx={current}
                    total={slides.length}
                    deckTitle={deck.title || topic}
                    isCover={slides[current].isCover}
                    coverData={deck}
                  />
                </SlideCanvas>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={prev} disabled={current === 0}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground tabular-nums">{current + 1} / {slides.length}</span>
                    <Button variant="outline" size="sm" onClick={next} disabled={current === slides.length - 1}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setFullscreen(true)}>
                    <Maximize2 className="h-4 w-4 mr-1" /> Present
                  </Button>
                </div>

                {/* Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
                  {slides.map((s: any, i: number) => (
                    <button key={i} onClick={() => setCurrent(i)}
                      className={`shrink-0 w-32 rounded-md overflow-hidden border-2 transition ${i === current ? 'border-primary' : 'border-border opacity-60 hover:opacity-100'}`}>
                      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
                        <div style={{ transform: 'scale(0.0666)', transformOrigin: 'top left', width: '1500%', height: '1500%', position: 'absolute', top: 0, left: 0 }}>
                          <div style={{ width: 1920, height: 1080, position: 'relative' }}>
                            <SlideRender slide={s} theme={theme} idx={i} total={slides.length} deckTitle={deck.title || topic} isCover={s.isCover} coverData={deck} />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FULLSCREEN PRESENT MODE */}
      {fullscreen && deck && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center" onClick={next}>
          <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setFullscreen(false); }} className="absolute top-4 right-4 text-white hover:bg-white/10 z-10">
            <X className="h-5 w-5" />
          </Button>
          <div className="w-full max-w-[95vw]" style={{ aspectRatio: '16 / 9', maxHeight: '95vh' }}>
            <div className="relative w-full h-full overflow-hidden">
              <SlideRender slide={slides[current]} theme={theme} idx={current} total={slides.length} deckTitle={deck.title || topic} isCover={slides[current].isCover} coverData={deck} />
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-white/10 backdrop-blur rounded-full px-4 py-2">
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); prev(); }} disabled={current === 0} className="text-white hover:bg-white/10">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-white text-sm tabular-nums">{current + 1} / {slides.length}</span>
            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); next(); }} disabled={current === slides.length - 1} className="text-white hover:bg-white/10">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
