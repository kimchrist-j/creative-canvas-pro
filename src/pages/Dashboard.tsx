import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import LanguageToggle from '@/components/LanguageToggle';
import { Plus, FileText, Layout, LogOut, Trash2, Clock, Loader2, Moon, Sun, Presentation, Sparkles } from 'lucide-react';
import OnboardingGuide from '@/components/OnboardingGuide';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('rf_onboarding_seen');
    if (!seen) setShowOnboarding(true);
    loadResumes();
  }, []);

  const loadResumes = async () => {
    const { data } = await supabase.from('resumes').select('*').order('updated_at', { ascending: false });
    setResumes(data || []);
    setLoading(false);
  };

  const deleteResume = async (id: string) => {
    await supabase.from('resumes').delete().eq('id', id);
    setResumes(resumes.filter(r => r.id !== id));
    toast({ title: 'Deleted', description: 'Resume has been removed.' });
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('rf_onboarding_seen', 'true');
  };

  return (
    <div className="min-h-screen bg-background">
      {showOnboarding && <OnboardingGuide onClose={handleCloseOnboarding} />}
      <header className="h-16 border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary to-primary/70 rotate-2" />
            <div className="relative h-full w-full rounded-lg bg-background flex items-center justify-center">
              <span className="text-sm font-black text-primary">RF</span>
            </div>
          </div>
          <span className="text-lg font-bold text-foreground">Resume<span className="text-primary">Forge</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          <LanguageToggle />
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={signOut}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Sign Out</span>
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('dashboard.projects')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Create and manage your resumes and wireframes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <button onClick={() => navigate('/editor/new')}
            className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:border-foreground/30 hover:bg-surface transition-all group">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileText className="h-6 w-6 text-foreground" />
            </div>
            <span className="font-medium text-foreground">{t('dashboard.newResume')}</span>
            <span className="text-xs text-muted-foreground text-center">Create a professional CV</span>
          </button>
          <button onClick={() => navigate('/wireframe/new')}
            className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-3 hover:border-foreground/30 hover:bg-surface transition-all group">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Layout className="h-6 w-6 text-foreground" />
            </div>
            <span className="font-medium text-foreground">{t('dashboard.newWireframe')}</span>
            <span className="text-xs text-muted-foreground text-center">Design web & mobile layouts</span>
          </button>
          <button onClick={() => navigate('/ai-slides')}
            className="relative border-2 border-dashed border-primary/30 rounded-xl p-6 flex flex-col items-center gap-3 hover:border-primary/60 hover:bg-primary/5 transition-all group overflow-hidden">
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-primary/20 text-primary text-[10px] font-bold uppercase flex items-center gap-1">
              <Sparkles className="h-2.5 w-2.5" /> AI
            </div>
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Presentation className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-foreground">{t('dashboard.aiPpt')}</span>
            <span className="text-xs text-muted-foreground text-center">AI-generated PowerPoint</span>
          </button>
        </div>

        <h2 className="text-lg font-semibold text-foreground mb-4">Recent Projects</h2>
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : resumes.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">No projects yet. Create your first resume or wireframe!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {resumes.map(resume => (
              <div key={resume.id} className="border border-border rounded-xl p-5 hover:shadow-md transition-shadow cursor-pointer group bg-card" onClick={() => navigate(`/editor/${resume.id}`)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <FileText className="h-5 w-5 text-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{resume.title}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={e => { e.stopPropagation(); deleteResume(resume.id); }}>
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
