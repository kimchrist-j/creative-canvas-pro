import { useLanguage } from '@/hooks/useLanguage';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  return (
    <button
      onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
      className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border border-border hover:bg-surface-hover transition-colors"
      title={lang === 'en' ? 'Passer en français' : 'Switch to English'}
    >
      <span className="text-sm">{lang === 'en' ? '🇬🇧' : '🇨🇲'}</span>
      <span className="uppercase text-muted-foreground">{lang}</span>
    </button>
  );
}
