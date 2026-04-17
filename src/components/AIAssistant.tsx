import { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Loader2, Wand2, Volume2, Star, ThumbsUp, AlertCircle, Lightbulb, Pause, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/hooks/useLanguage';
import { ResumeData, defaultResumeData } from '@/types/resume';

interface AIAssistantProps {
  open: boolean;
  onClose: () => void;
  resume: ResumeData;
  onApplyGenerated: (data: ResumeData) => void;
}

type Analysis = {
  score: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  speech: string;
};

export default function AIAssistant({ open, onClose, resume, onApplyGenerated }: AIAssistantProps) {
  const { toast } = useToast();
  const { lang } = useLanguage();
  const [tab, setTab] = useState<'analyze' | 'generate'>('analyze');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [description, setDescription] = useState('');
  const [voice, setVoice] = useState<'female' | 'male'>('female');
  const [speaking, setSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const callFn = async (path: string, body: any) => {
    const { data: { session } } = await supabase.auth.getSession();
    const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      if (resp.status === 429) throw new Error('Too many requests. Wait a moment.');
      if (resp.status === 402) throw new Error('AI credits exhausted.');
      const e = await resp.json().catch(() => ({}));
      throw new Error(e.error || 'Request failed');
    }
    return resp;
  };

  const analyze = async () => {
    setLoading(true); setAnalysis(null);
    try {
      const r = await callFn('cv-analyze', { resume, language: lang });
      setAnalysis(await r.json());
    } catch (err: any) {
      toast({ title: 'Analysis failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const generate = async () => {
    if (!description.trim()) { toast({ title: 'Add a description first', variant: 'destructive' }); return; }
    setLoading(true);
    try {
      const r = await callFn('cv-generate', { description, language: lang });
      const generated = await r.json();
      onApplyGenerated({ ...defaultResumeData, ...generated });
      toast({ title: 'CV generated!', description: 'Review and edit before saving.' });
      onClose();
    } catch (err: any) {
      toast({ title: 'Generation failed', description: err.message, variant: 'destructive' });
    }
    setLoading(false);
  };

  const playSpeech = async () => {
    if (!analysis?.speech) return;
    if (speaking && audioRef.current) {
      audioRef.current.pause();
      setSpeaking(false);
      return;
    }
    setAudioLoading(true);
    try {
      const r = await callFn('cv-voice', { text: analysis.speech, voice });
      const blob = await r.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.onended = () => { setSpeaking(false); URL.revokeObjectURL(url); };
      audio.onpause = () => setSpeaking(false);
      audio.onplay = () => setSpeaking(true);
      await audio.play();
    } catch (err: any) {
      toast({ title: 'Voice failed', description: err.message, variant: 'destructive' });
    }
    setAudioLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" /> AI CV Assistant
          </DialogTitle>
        </DialogHeader>

        <div className="flex gap-2 border-b border-border -mx-6 px-6 pb-2">
          <button onClick={() => setTab('analyze')} className={`px-3 py-2 text-sm font-medium border-b-2 transition ${tab === 'analyze' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
            Analyze & Rate
          </button>
          <button onClick={() => setTab('generate')} className={`px-3 py-2 text-sm font-medium border-b-2 transition ${tab === 'generate' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}>
            Generate from Description
          </button>
        </div>

        {tab === 'analyze' && (
          <div className="space-y-4 pt-2">
            {!analysis && !loading && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-4">Get an honest score out of 20, plus a spoken review by a real-sounding recruiter voice.</p>
                <Button onClick={analyze}><Wand2 className="h-4 w-4 mr-2" /> Analyze my CV</Button>
              </div>
            )}

            {loading && (
              <div className="text-center py-10">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-3" />
                <p className="text-sm text-muted-foreground">AI is reviewing your CV...</p>
              </div>
            )}

            {analysis && (
              <div className="space-y-5">
                <div className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-6 border border-primary/20">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-primary fill-primary" />
                    <span className="text-4xl font-black text-foreground">{analysis.score}</span>
                    <span className="text-2xl text-muted-foreground">/ 20</span>
                  </div>
                  <Progress value={(analysis.score / 20) * 100} className="h-2 mt-3" />
                  <p className="text-sm text-muted-foreground mt-3">{analysis.summary}</p>
                </div>

                <div className="bg-surface rounded-xl p-4 border border-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Volume2 className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Listen to a recruiter explain your score</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <button onClick={() => setVoice('female')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${voice === 'female' ? 'bg-primary text-primary-foreground' : 'bg-surface-hover text-muted-foreground'}`}>👩 Female (Sarah)</button>
                    <button onClick={() => setVoice('male')} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${voice === 'male' ? 'bg-primary text-primary-foreground' : 'bg-surface-hover text-muted-foreground'}`}>👨 Male (George)</button>
                  </div>
                  <Button size="sm" onClick={playSpeech} disabled={audioLoading} className="w-full">
                    {audioLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : speaking ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                    {audioLoading ? 'Generating voice...' : speaking ? 'Pause' : 'Play recruiter voice'}
                  </Button>
                </div>

                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2"><ThumbsUp className="h-4 w-4 text-green-500" /> Strengths</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">{analysis.strengths.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2"><AlertCircle className="h-4 w-4 text-yellow-500" /> Weaknesses</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">{analysis.weaknesses.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2"><Lightbulb className="h-4 w-4 text-blue-500" /> Suggested improvements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-6 list-disc">{analysis.improvements.map((s, i) => <li key={i}>{s}</li>)}</ul>
                </div>

                <Button variant="outline" onClick={analyze} className="w-full">Re-analyze</Button>
              </div>
            )}
          </div>
        )}

        {tab === 'generate' && (
          <div className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Describe yourself, your background, target role, and key achievements. AI will draft a complete CV that you can refine.</p>
            <Textarea
              placeholder="e.g. I'm Sarah, 28, marketing manager based in Douala. 5 years experience at MTN Cameroon leading digital campaigns. MBA from ESSEC. Looking for senior role in fintech. Strong in SEO, paid ads, team leadership..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={8}
            />
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {loading ? 'Generating CV...' : 'Generate my CV'}
            </Button>
            <p className="text-xs text-muted-foreground text-center">⚠️ This will replace your current CV content.</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
