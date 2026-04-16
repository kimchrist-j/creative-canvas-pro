import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Lang = 'en' | 'fr';

const translations: Record<string, Record<Lang, string>> = {
  'nav.signin': { en: 'Sign In', fr: 'Connexion' },
  'nav.getStarted': { en: 'Get Started', fr: 'Commencer' },
  'hero.badge': { en: 'Free first download — no credit card needed', fr: 'Premier téléchargement gratuit — sans carte bancaire' },
  'hero.title1': { en: 'Build. Design.', fr: 'Créez. Designez.' },
  'hero.title2': { en: 'Export.', fr: 'Exportez.' },
  'hero.desc': { en: 'Create stunning resumes, design web & mobile apps with real code generation — all in one lightweight platform.', fr: 'Créez des CV professionnels, designez des apps web & mobiles avec génération de code — tout sur une plateforme légère.' },
  'hero.cta': { en: 'Start Creating', fr: 'Commencer' },
  'hero.templates': { en: 'View Templates', fr: 'Voir les modèles' },
  'hero.stats': { en: 'CVs created this month', fr: 'CV créés ce mois-ci' },
  'features.title': { en: 'Everything you need', fr: 'Tout ce qu\'il vous faut' },
  'features.desc': { en: 'One platform for resumes, app design, and document conversion.', fr: 'Une plateforme pour CV, design d\'apps et conversion de documents.' },
  'pricing.title': { en: 'Simple pricing', fr: 'Tarification simple' },
  'pricing.desc': { en: 'First download is free. After that, unlock unlimited access.', fr: 'Premier téléchargement gratuit. Ensuite, accès illimité.' },
  'pricing.free': { en: 'Free', fr: 'Gratuit' },
  'pricing.unlimited': { en: 'Unlimited', fr: 'Illimité' },
  'dashboard.projects': { en: 'My Projects', fr: 'Mes projets' },
  'dashboard.newResume': { en: 'New Resume', fr: 'Nouveau CV' },
  'dashboard.newWireframe': { en: 'New Wireframe', fr: 'Nouveau wireframe' },
  'editor.save': { en: 'Save', fr: 'Sauvegarder' },
  'editor.download': { en: 'Download', fr: 'Télécharger' },
  'editor.template': { en: 'Template', fr: 'Modèle' },
  'editor.personal': { en: 'Personal Information', fr: 'Informations personnelles' },
  'editor.summary': { en: 'Professional Summary', fr: 'Résumé professionnel' },
  'editor.experience': { en: 'Experience', fr: 'Expérience' },
  'editor.education': { en: 'Education', fr: 'Formation' },
  'editor.skills': { en: 'Skills', fr: 'Compétences' },
  'editor.hobbies': { en: 'Hobbies', fr: 'Loisirs' },
  'editor.references': { en: 'References', fr: 'Références' },
  'cv.cameroon': { en: 'Cameroon Format', fr: 'Format Cameroun' },
  'cv.nigeria': { en: 'Nigeria Format', fr: 'Format Nigeria' },
  'cv.canada': { en: 'Canada Migration', fr: 'Immigration Canada' },
  'ai.suggestions': { en: 'AI Suggestions', fr: 'Suggestions IA' },
  'ai.internship': { en: 'Internship', fr: 'Stage' },
  'ai.junior': { en: 'Junior Developer', fr: 'Développeur Junior' },
};

interface LangContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
}

const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('rf_lang') as Lang) || 'en');

  const changeLang = useCallback((l: Lang) => {
    setLang(l);
    localStorage.setItem('rf_lang', l);
  }, []);

  const t = useCallback((key: string) => translations[key]?.[lang] || key, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang: changeLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
