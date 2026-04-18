import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import LanguageToggle from '@/components/LanguageToggle';
import { FileText, Layout, Download, Sparkles, ArrowRight, CheckCircle2, Sun, Moon, Code2, Smartphone, Users, Zap, Play, Menu, X } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
  }),
};

export default function Index() {
  const { user, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const features = [
    { icon: FileText, title: 'Resume Builder', desc: '10+ professional templates with multi-page support, photo positioning, and local CV formats for Cameroon, Nigeria & Canada.' },
    { icon: Code2, title: 'App Builder', desc: 'Design websites & mobile apps with 50+ components. Generate React, React Native, or HTML code.' },
    { icon: Smartphone, title: 'Device Frames', desc: 'Preview your designs on iPhone, iPad, Android devices, and desktop browsers.' },
    { icon: Layout, title: 'Drag & Drop', desc: 'Intuitive canvas with snap-to-grid, resize handles, undo/redo, and real-time code generation.' },
    { icon: Download, title: 'Export Anywhere', desc: 'Download as PDF or ZIP with full project structure. First download is always free.' },
    { icon: Zap, title: 'AI Suggestions', desc: 'Get tailored content for internships and junior dev roles. Works offline on slow connections.' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1a2e] text-white overflow-x-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-50 bg-[#1a1a2e]/90 backdrop-blur-md border-b border-white/5">
        <div className="h-16 flex items-center justify-between px-4 md:px-6 max-w-7xl mx-auto gap-2">
          <div className="flex items-center gap-2 md:gap-3 min-w-0">
            {/* Logo */}
            <div className="relative h-9 w-9 md:h-10 md:w-10 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#c8ff00] to-[#87cb00] rotate-3" />
              <div className="relative h-full w-full rounded-xl bg-[#1a1a2e] flex items-center justify-center">
                <span className="text-base md:text-lg font-black text-[#c8ff00] tracking-tighter">RF</span>
              </div>
            </div>
            <span className="text-base md:text-lg font-bold tracking-tight truncate">Resume<span className="text-[#c8ff00]">Forge</span></span>
          </div>
          <nav className="hidden lg:flex items-center gap-6 text-sm text-white/60">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#templates" className="hover:text-white transition-colors">Templates</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>
          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <LanguageToggle />
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="text-white/80 hover:text-white hover:bg-white/10">
              {t('nav.signin')}
            </Button>
            <Button size="sm" onClick={() => navigate('/auth')} className="bg-[#c8ff00] text-[#1a1a2e] hover:bg-[#b8ef00] font-semibold rounded-full px-4 lg:px-5">
              {t('nav.getStarted')}
            </Button>
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-white/80 hover:bg-white/10 shrink-0"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#1a1a2e]/95 backdrop-blur-md px-4 py-4 space-y-3">
            <nav className="flex flex-col gap-1 text-sm text-white/70">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white">Features</a>
              <a href="#templates" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white">Templates</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg hover:bg-white/5 hover:text-white">Pricing</a>
            </nav>
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5">
              <LanguageToggle />
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10">
                {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate('/auth')} className="w-full text-white/80 hover:text-white hover:bg-white/10 justify-center">
                {t('nav.signin')}
              </Button>
              <Button size="sm" onClick={() => navigate('/auth')} className="w-full bg-[#c8ff00] text-[#1a1a2e] hover:bg-[#b8ef00] font-semibold rounded-full">
                {t('nav.getStarted')}
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <div ref={heroRef} className="relative">
        <motion.section style={{ y: heroY, opacity: heroOpacity }} className="max-w-7xl mx-auto px-6 pt-20 pb-24 relative">
          {/* Decorative circles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full border border-white/5" />
            <div className="absolute top-[30%] right-[15%] w-[250px] h-[250px] rounded-full border border-white/5" />
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-10 right-[20%] h-32 w-32 rounded-full bg-[#c8ff00]/5 blur-3xl" />
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute bottom-20 left-[10%] h-40 w-40 rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div>
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}
                className="inline-flex items-center gap-2 bg-white/5 text-[#c8ff00] text-xs font-medium px-4 py-2 rounded-full mb-8 border border-[#c8ff00]/20">
                <Sparkles className="h-3.5 w-3.5" /> {t('hero.badge')}
              </motion.div>

              <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={1}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6 tracking-tight">
                {t('hero.title1')}
                <br />
                <span className="text-[#c8ff00]">{t('hero.title2')}</span>
              </motion.h1>

              <motion.p initial="hidden" animate="visible" variants={fadeUp} custom={2}
                className="text-lg text-white/50 max-w-lg mb-10 leading-relaxed">
                {t('hero.desc')}
              </motion.p>

              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-[#c8ff00] text-[#1a1a2e] hover:bg-[#b8ef00] font-semibold rounded-full px-8 h-12 text-base" onClick={() => navigate('/auth')}>
                  {t('hero.cta')} <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-white/20 text-white hover:bg-white/10" onClick={() => navigate('/auth')}>
                  <Play className="h-4 w-4 mr-2 fill-current" /> Watch Demo
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={4} className="mt-12 flex items-center gap-4">
                <div>
                  <p className="text-3xl font-bold text-[#c8ff00]">3,875</p>
                  <p className="text-xs text-white/40">{t('hero.stats')}</p>
                </div>
                <div className="flex -space-x-2 ml-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1a1a2e]" style={{ backgroundColor: ['#667eea', '#764ba2', '#f59e0b', '#10b981', '#ef4444'][i] }} />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right side: Floating resume cards */}
            <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="hidden lg:block relative">
              <div className="relative h-[500px]">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.5 }}
                    className="absolute rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm shadow-2xl overflow-hidden"
                    style={{
                      width: 260 - i * 20,
                      height: 340 - i * 20,
                      top: i * 70,
                      right: i * 50,
                      zIndex: 3 - i,
                    }}>
                    <div className="h-16 bg-gradient-to-r from-[#c8ff00]/20 to-transparent" />
                    <div className="p-4 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full" style={{ backgroundColor: ['#c8ff00', '#667eea', '#f59e0b'][i] }} />
                        <div>
                          <div className="h-2.5 w-20 bg-white/20 rounded" />
                          <div className="h-2 w-14 bg-white/10 rounded mt-1.5" />
                        </div>
                      </div>
                      {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-2 rounded bg-white/10" style={{ width: `${60 + Math.random() * 40}%` }} />
                      ))}
                      <div className="flex gap-1.5 mt-3">
                        {[...Array(3)].map((_, j) => (
                          <div key={j} className="h-5 w-12 rounded-full bg-white/10" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} className="text-center mb-16">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">{t('features.title')}</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg max-w-xl mx-auto">{t('features.desc')}</motion.p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} variants={fadeUp} custom={i}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-colors">
              <div className="h-12 w-12 rounded-xl bg-[#c8ff00]/10 flex items-center justify-center mb-4">
                <Icon className="h-6 w-6 text-[#c8ff00]" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Templates showcase */}
      <section id="templates" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">10+ Professional Templates</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg">Local formats for Cameroon, Nigeria, and Canada migration</motion.p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Classic', 'Modern', 'Minimal', 'Bold', 'Creative', 'Executive', 'Formal', 'Academic', 'Tech', 'Elegant'].map((name, i) => (
              <motion.div key={name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                className="aspect-[3/4] rounded-xl border border-white/10 bg-white/[0.03] flex items-end p-3 hover:border-[#c8ff00]/40 transition-colors cursor-pointer group">
                <p className="text-xs font-medium text-white/60 group-hover:text-[#c8ff00] transition-colors">{name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-3xl mx-auto px-6 py-24">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
          <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4">{t('pricing.title')}</motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-white/50 text-lg">{t('pricing.desc')}</motion.p>
        </motion.div>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div variants={fadeUp} custom={0} className="border border-white/10 rounded-2xl p-8 bg-white/[0.02]">
            <h3 className="text-lg font-bold mb-2">{t('pricing.free')}</h3>
            <p className="text-4xl font-bold mb-6">$0</p>
            <ul className="space-y-3 text-sm text-white/50">
              {['1 free download (PDF/ZIP)', 'Full editor access', 'All 10+ resume templates', 'App builder with code gen', 'EN/FR language toggle'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#c8ff00] shrink-0" />{f}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div variants={fadeUp} custom={1} className="border-2 border-[#c8ff00] rounded-2xl p-8 bg-[#c8ff00]/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#c8ff00] text-[#1a1a2e] text-xs font-bold px-4 py-1 rounded-bl-xl">POPULAR</div>
            <h3 className="text-lg font-bold mb-2">{t('pricing.unlimited')}</h3>
            <p className="text-4xl font-bold mb-6">One-time</p>
            <ul className="space-y-3 text-sm text-white/50">
              {['Unlimited downloads', 'All premium templates', 'Priority support', 'App builder ZIP export', 'AI content suggestions'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[#c8ff00] shrink-0" />{f}</li>
              ))}
            </ul>
            <Button className="w-full mt-6 bg-[#c8ff00] text-[#1a1a2e] hover:bg-[#b8ef00] font-semibold" size="lg" onClick={() => navigate('/auth')}>
              Get Unlimited
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="relative h-7 w-7">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#c8ff00] to-[#87cb00] rotate-3" />
              <div className="relative h-full w-full rounded-md bg-[#1a1a2e] flex items-center justify-center">
                <span className="text-[10px] font-black text-[#c8ff00]">RF</span>
              </div>
            </div>
            <span className="text-sm font-semibold">Resume<span className="text-[#c8ff00]">Forge</span></span>
          </div>
          <p className="text-sm text-white/30">© 2024 ResumeForge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
