import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { FileText, Layout, Download, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function Index() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">ResumeForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => window.location.href = '/auth'}>Sign In</Button>
          <Button size="sm" onClick={() => window.location.href = '/auth'}>Get Started</Button>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto text-center px-6 pt-20 pb-16">
        <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground text-xs font-medium px-4 py-2 rounded-full mb-6">
          <Sparkles className="h-3.5 w-3.5" /> Free first download — no credit card needed
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
          Build professional resumes<br />& design wireframes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Create stunning CVs with our intuitive editor, design website and mobile app wireframes, and download everything as polished PDFs.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button size="lg" onClick={() => window.location.href = '/auth'}>
            Start Creating <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          <Button variant="outline" size="lg" onClick={() => window.location.href = '/auth'}>
            View Templates
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FileText, title: 'Resume Builder', desc: 'Professional CV editor with live preview, multiple sections, and instant PDF export.' },
            { icon: Layout, title: 'Wireframe Designer', desc: 'Design website, web app, and mobile layouts with drag-and-drop elements.' },
            { icon: Download, title: 'PDF Downloads', desc: 'High-quality PDF exports that look exactly like your preview. First one is free!' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-6 rounded-xl border border-border hover:shadow-lg transition-shadow bg-card">
              <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">Simple pricing</h2>
        <p className="text-muted-foreground mb-10">Your first download is completely free. After that, unlock unlimited downloads.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border rounded-xl p-8 bg-card">
            <h3 className="text-lg font-bold text-foreground mb-2">Free</h3>
            <p className="text-3xl font-bold text-foreground mb-4">$0</p>
            <ul className="space-y-2 text-sm text-muted-foreground text-left">
              {['1 free PDF download', 'Full editor access', 'All templates', 'Wireframe designer'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" />{f}</li>
              ))}
            </ul>
          </div>
          <div className="border-2 border-foreground rounded-xl p-8 bg-card relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-foreground text-background text-xs font-medium px-3 py-1 rounded-full">Popular</div>
            <h3 className="text-lg font-bold text-foreground mb-2">Unlimited</h3>
            <p className="text-3xl font-bold text-foreground mb-4">One-time</p>
            <ul className="space-y-2 text-sm text-muted-foreground text-left">
              {['Unlimited PDF downloads', 'All premium templates', 'Priority support', 'Wireframe exports'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success shrink-0" />{f}</li>
              ))}
            </ul>
            <Button className="w-full mt-6" onClick={() => window.location.href = '/auth'}>Get Unlimited</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6 text-center text-sm text-muted-foreground">
        © 2024 ResumeForge. All rights reserved.
      </footer>
    </div>
  );
}
