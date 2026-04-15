import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';
import { FileText, Layout, Download, Sparkles, ArrowRight, CheckCircle2, Sun, Moon, FileDown, Code2, Smartphone } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

export default function Index() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const features = [
    { icon: FileText, title: 'Resume Builder', desc: 'Professional CV editor with 3 templates, live preview, photo upload, and instant PDF export.' },
    { icon: Code2, title: 'App Builder', desc: 'Design websites & mobile apps with 50+ components. Generate React, React Native, or HTML code.' },
    { icon: FileDown, title: 'PDF → Word', desc: 'Convert any PDF to an editable Word document. Preserves text, images, tables, and layout.' },
    { icon: Smartphone, title: 'Device Frames', desc: 'Preview your designs on iPhone 15, iPad, Android devices, and desktop browsers.' },
    { icon: Layout, title: 'Drag & Drop', desc: 'Intuitive canvas with snap-to-grid, resize handles, undo/redo, and real-time code generation.' },
    { icon: Download, title: 'Export Anywhere', desc: 'Download as PDF, DOCX, or ZIP with full project structure. First download is always free.' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Nav */}
      <header className="h-16 flex items-center justify-between px-6 max-w-7xl mx-auto sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">ResumeForge</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/auth')}>Sign In</Button>
          <Button size="sm" onClick={() => navigate('/auth')}>Get Started</Button>
        </div>
      </header>

      {/* Hero with parallax */}
      <div ref={heroRef} className="relative">
        <motion.section
          style={{ y: heroY, opacity: heroOpacity }}
          className="max-w-5xl mx-auto text-center px-6 pt-24 pb-20 relative"
        >
          {/* Floating 3D orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 left-[10%] h-32 w-32 rounded-full bg-primary/10 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, 15, 0], x: [0, -15, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute top-20 right-[15%] h-40 w-40 rounded-full bg-accent/10 blur-3xl"
            />
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
              className="absolute bottom-10 left-[30%] h-24 w-24 rounded-full bg-primary/5 blur-2xl"
            />
          </div>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-4 py-2 rounded-full mb-8 border border-primary/20"
          >
            <Sparkles className="h-3.5 w-3.5" /> Free first download — no credit card needed
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
            className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1] mb-6 tracking-tight"
          >
            Build. Design.
            <br />
            <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">Convert.</span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Create stunning resumes, design web & mobile apps with real code generation, and convert PDFs to Word — all in one platform.
          </motion.p>

          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button size="lg" className="text-base px-8 h-12" onClick={() => navigate('/auth')}>
              Start Creating <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button variant="outline" size="lg" className="text-base px-8 h-12" onClick={() => navigate('/auth')}>
              View Templates
            </Button>
          </motion.div>

          {/* 3D floating cards */}
          <motion.div
            initial="hidden" animate="visible" variants={scaleIn}
            className="mt-16 relative"
            style={{ perspective: '1000px' }}
          >
            <motion.div
              whileHover={{ rotateY: 5, rotateX: -5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="grid grid-cols-3 gap-4 max-w-3xl mx-auto"
            >
              {[
                { label: 'Resume', icon: FileText, color: 'from-red-500/20 to-red-600/10' },
                { label: 'App Builder', icon: Code2, color: 'from-primary/20 to-blue-600/10' },
                { label: 'PDF → Word', icon: FileDown, color: 'from-green-500/20 to-green-600/10' },
              ].map((card) => (
                <div key={card.label} className={`p-6 rounded-2xl border border-border bg-gradient-to-br ${card.color} backdrop-blur-sm`}>
                  <card.icon className="h-8 w-8 text-foreground mb-3" />
                  <p className="text-sm font-semibold text-foreground">{card.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.section>
      </div>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="text-center mb-16"
        >
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything you need
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg max-w-xl mx-auto">
            One platform for resumes, app design, and document conversion.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              variants={fadeUp}
              custom={i}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-xl hover:shadow-primary/5 transition-shadow"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold text-foreground mb-4">Simple pricing</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-muted-foreground text-lg">First download is free. After that, unlock unlimited access.</motion.p>
        </motion.div>

        <motion.div
          initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeUp} custom={0} className="border border-border rounded-2xl p-8 bg-card">
            <h3 className="text-lg font-bold text-foreground mb-2">Free</h3>
            <p className="text-4xl font-bold text-foreground mb-6">$0</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {['1 free download (PDF/DOCX/ZIP)', 'Full editor access', 'All 3 resume templates', 'App builder with code gen', 'PDF to Word converter'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{f}</li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={fadeUp} custom={1} className="border-2 border-primary rounded-2xl p-8 bg-card relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <h3 className="text-lg font-bold text-foreground mb-2">Unlimited</h3>
            <p className="text-4xl font-bold text-foreground mb-6">One-time</p>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {['Unlimited downloads', 'All premium templates', 'Priority support', 'App builder ZIP export', 'Unlimited PDF conversions'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" />{f}</li>
              ))}
            </ul>
            <Button className="w-full mt-6" size="lg" onClick={() => navigate('/auth')}>Get Unlimited</Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
              <FileText className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold text-foreground">ResumeForge</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2024 ResumeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
