import { useLanguage, LANGUAGES, Lang } from '@/hooks/useLanguage';
import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full border border-border hover:bg-surface-hover transition-colors"
      >
        <Globe className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{current.flag}</span>
        <span className="uppercase text-muted-foreground">{current.code}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 max-h-72 overflow-y-auto bg-card border border-border rounded-xl shadow-xl z-50 py-1">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLang(l.code as Lang); setOpen(false); }}
              className="w-full flex items-center justify-between gap-2 px-3 py-2 text-sm hover:bg-surface-hover text-foreground"
            >
              <span className="flex items-center gap-2"><span>{l.flag}</span><span>{l.name}</span></span>
              {lang === l.code && <Check className="h-3.5 w-3.5 text-primary" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
