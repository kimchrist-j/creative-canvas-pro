import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type Lang = 'en' | 'fr' | 'es' | 'de' | 'pt' | 'it' | 'ar' | 'zh' | 'ja' | 'ru';

export const LANGUAGES: { code: Lang; flag: string; name: string }[] = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'pt', flag: '🇵🇹', name: 'Português' },
  { code: 'it', flag: '🇮🇹', name: 'Italiano' },
  { code: 'ar', flag: '🇸🇦', name: 'العربية' },
  { code: 'zh', flag: '🇨🇳', name: '中文' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
  { code: 'ru', flag: '🇷🇺', name: 'Русский' },
];

const T: Record<string, Partial<Record<Lang, string>>> = {
  'nav.signin':       { en: 'Sign In', fr: 'Connexion', es: 'Entrar', de: 'Anmelden', pt: 'Entrar', it: 'Accedi', ar: 'دخول', zh: '登录', ja: 'サインイン', ru: 'Войти' },
  'nav.getStarted':   { en: 'Get Started', fr: 'Commencer', es: 'Empezar', de: 'Loslegen', pt: 'Começar', it: 'Inizia', ar: 'ابدأ', zh: '开始', ja: '始める', ru: 'Начать' },
  'hero.cta':         { en: 'Start Creating', fr: 'Commencer', es: 'Crear ahora', de: 'Jetzt starten', pt: 'Começar', it: 'Inizia', ar: 'ابدأ', zh: '开始创作', ja: '作成開始', ru: 'Создать' },
  'editor.save':      { en: 'Save', fr: 'Sauvegarder', es: 'Guardar', de: 'Speichern', pt: 'Salvar', it: 'Salva', ar: 'حفظ', zh: '保存', ja: '保存', ru: 'Сохранить' },
  'editor.download':  { en: 'Download', fr: 'Télécharger', es: 'Descargar', de: 'Herunterladen', pt: 'Baixar', it: 'Scarica', ar: 'تنزيل', zh: '下载', ja: 'ダウンロード', ru: 'Скачать' },
  'editor.template':  { en: 'Template', fr: 'Modèle', es: 'Plantilla', de: 'Vorlage', pt: 'Modelo', it: 'Modello', ar: 'قالب', zh: '模板', ja: 'テンプレート', ru: 'Шаблон' },
  'editor.personal':  { en: 'Personal Information', fr: 'Informations personnelles', es: 'Información personal', de: 'Persönliche Daten', pt: 'Dados pessoais', it: 'Dati personali', ar: 'المعلومات الشخصية', zh: '个人信息', ja: '個人情報', ru: 'Личные данные' },
  'editor.summary':   { en: 'Professional Summary', fr: 'Résumé professionnel', es: 'Resumen profesional', de: 'Berufsprofil', pt: 'Resumo profissional', it: 'Profilo professionale', ar: 'الملخص المهني', zh: '专业简介', ja: 'プロフィール', ru: 'Профиль' },
  'editor.experience':{ en: 'Experience', fr: 'Expérience', es: 'Experiencia', de: 'Erfahrung', pt: 'Experiência', it: 'Esperienza', ar: 'الخبرة', zh: '工作经验', ja: '職歴', ru: 'Опыт' },
  'editor.education': { en: 'Education', fr: 'Formation', es: 'Educación', de: 'Ausbildung', pt: 'Educação', it: 'Istruzione', ar: 'التعليم', zh: '教育', ja: '学歴', ru: 'Образование' },
  'editor.skills':    { en: 'Skills', fr: 'Compétences', es: 'Habilidades', de: 'Fähigkeiten', pt: 'Habilidades', it: 'Competenze', ar: 'المهارات', zh: '技能', ja: 'スキル', ru: 'Навыки' },
  'editor.hobbies':   { en: 'Hobbies', fr: 'Loisirs', es: 'Aficiones', de: 'Hobbys', pt: 'Hobbies', it: 'Hobby', ar: 'هوايات', zh: '兴趣', ja: '趣味', ru: 'Хобби' },
  'editor.references':{ en: 'References', fr: 'Références', es: 'Referencias', de: 'Referenzen', pt: 'Referências', it: 'Referenze', ar: 'المراجع', zh: '推荐人', ja: '推薦者', ru: 'Рекомендации' },
  'ai.suggestions':   { en: 'AI Assist', fr: 'Assistant IA', es: 'Asistente IA', de: 'KI-Hilfe', pt: 'IA', it: 'IA', ar: 'الذكاء', zh: 'AI 助手', ja: 'AI', ru: 'AI' },
  'ai.internship':    { en: 'Internship', fr: 'Stage', es: 'Prácticas', de: 'Praktikum', pt: 'Estágio', it: 'Tirocinio', ar: 'تدريب', zh: '实习', ja: 'インターン', ru: 'Стажировка' },
  'ai.junior':        { en: 'Junior Dev', fr: 'Dév Junior', es: 'Dev Junior', de: 'Junior Dev', pt: 'Dev Junior', it: 'Dev Junior', ar: 'مطور مبتدئ', zh: '初级开发', ja: '初級開発者', ru: 'Junior' },
  'dashboard.projects':{ en: 'My Projects', fr: 'Mes projets', es: 'Mis proyectos', de: 'Meine Projekte', pt: 'Meus projetos', it: 'I miei progetti', ar: 'مشاريعي', zh: '我的项目', ja: 'プロジェクト', ru: 'Мои проекты' },
  'dashboard.newResume':{ en: 'New Resume', fr: 'Nouveau CV', es: 'Nuevo CV', de: 'Neuer CV', pt: 'Novo CV', it: 'Nuovo CV', ar: 'سيرة ذاتية جديدة', zh: '新简历', ja: '新規CV', ru: 'Новое резюме' },
  'dashboard.newWireframe':{ en: 'App Builder', fr: 'Concepteur', es: 'Constructor', de: 'App-Builder', pt: 'Construtor', it: 'App Builder', ar: 'منشئ', zh: '应用构建器', ja: 'ビルダー', ru: 'Конструктор' },
  'dashboard.aiPpt':  { en: 'AI Slides', fr: 'Diapos IA', es: 'Diapos IA', de: 'KI Folien', pt: 'Slides IA', it: 'Slide IA', ar: 'شرائح', zh: 'AI 幻灯片', ja: 'AIスライド', ru: 'AI слайды' },
};

interface LangContextType { lang: Lang; setLang: (l: Lang) => void; t: (key: string) => string; }
const LangContext = createContext<LangContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => (localStorage.getItem('rf_lang') as Lang) || 'en');
  const changeLang = useCallback((l: Lang) => { setLang(l); localStorage.setItem('rf_lang', l); document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr'; }, []);
  const t = useCallback((key: string) => T[key]?.[lang] || T[key]?.en || key, [lang]);
  return <LangContext.Provider value={{ lang, setLang: changeLang, t }}>{children}</LangContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
