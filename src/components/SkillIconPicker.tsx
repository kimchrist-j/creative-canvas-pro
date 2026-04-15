import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';

// Popular skill icons using Simple Icons CDN (https://simpleicons.org/)
const SKILL_ICONS: { name: string; slug: string; hex: string }[] = [
  { name: 'Figma', slug: 'figma', hex: 'F24E1E' },
  { name: 'Adobe XD', slug: 'adobexd', hex: 'FF61F6' },
  { name: 'Photoshop', slug: 'adobephotoshop', hex: '31A8FF' },
  { name: 'Illustrator', slug: 'adobeillustrator', hex: 'FF9A00' },
  { name: 'After Effects', slug: 'adobeaftereffects', hex: '9999FF' },
  { name: 'Premiere Pro', slug: 'adobepremierepro', hex: '9999FF' },
  { name: 'Blender', slug: 'blender', hex: 'E87D0D' },
  { name: 'Sketch', slug: 'sketch', hex: 'F7B500' },
  { name: 'InVision', slug: 'invision', hex: 'FF3366' },
  { name: 'React', slug: 'react', hex: '61DAFB' },
  { name: 'Vue.js', slug: 'vuedotjs', hex: '4FC08D' },
  { name: 'Angular', slug: 'angular', hex: '0F0F11' },
  { name: 'Next.js', slug: 'nextdotjs', hex: '000000' },
  { name: 'Svelte', slug: 'svelte', hex: 'FF3E00' },
  { name: 'TypeScript', slug: 'typescript', hex: '3178C6' },
  { name: 'JavaScript', slug: 'javascript', hex: 'F7DF1E' },
  { name: 'Python', slug: 'python', hex: '3776AB' },
  { name: 'Java', slug: 'openjdk', hex: 'FFFFFF' },
  { name: 'C++', slug: 'cplusplus', hex: '00599C' },
  { name: 'C#', slug: 'csharp', hex: '512BD4' },
  { name: 'Go', slug: 'go', hex: '00ADD8' },
  { name: 'Rust', slug: 'rust', hex: '000000' },
  { name: 'Swift', slug: 'swift', hex: 'F05138' },
  { name: 'Kotlin', slug: 'kotlin', hex: '7F52FF' },
  { name: 'PHP', slug: 'php', hex: '777BB4' },
  { name: 'Ruby', slug: 'ruby', hex: 'CC342D' },
  { name: 'Node.js', slug: 'nodedotjs', hex: '5FA04E' },
  { name: 'Express', slug: 'express', hex: '000000' },
  { name: 'Django', slug: 'django', hex: '092E20' },
  { name: 'Flask', slug: 'flask', hex: '000000' },
  { name: 'Spring', slug: 'spring', hex: '6DB33F' },
  { name: 'Docker', slug: 'docker', hex: '2496ED' },
  { name: 'Kubernetes', slug: 'kubernetes', hex: '326CE5' },
  { name: 'AWS', slug: 'amazonwebservices', hex: '232F3E' },
  { name: 'Google Cloud', slug: 'googlecloud', hex: '4285F4' },
  { name: 'Azure', slug: 'microsoftazure', hex: '0078D4' },
  { name: 'Firebase', slug: 'firebase', hex: 'DD2C00' },
  { name: 'MongoDB', slug: 'mongodb', hex: '47A248' },
  { name: 'PostgreSQL', slug: 'postgresql', hex: '4169E1' },
  { name: 'MySQL', slug: 'mysql', hex: '4479A1' },
  { name: 'Redis', slug: 'redis', hex: 'FF4438' },
  { name: 'Git', slug: 'git', hex: 'F05032' },
  { name: 'GitHub', slug: 'github', hex: '181717' },
  { name: 'GitLab', slug: 'gitlab', hex: 'FC6D26' },
  { name: 'VS Code', slug: 'visualstudiocode', hex: '007ACC' },
  { name: 'Tailwind CSS', slug: 'tailwindcss', hex: '06B6D4' },
  { name: 'Bootstrap', slug: 'bootstrap', hex: '7952B3' },
  { name: 'Sass', slug: 'sass', hex: 'CC6699' },
  { name: 'HTML5', slug: 'html5', hex: 'E34F26' },
  { name: 'CSS3', slug: 'css3', hex: '1572B6' },
  { name: 'WordPress', slug: 'wordpress', hex: '21759B' },
  { name: 'Shopify', slug: 'shopify', hex: '7AB55C' },
  { name: 'Webflow', slug: 'webflow', hex: '4353FF' },
  { name: 'Unity', slug: 'unity', hex: 'FFFFFF' },
  { name: 'Unreal Engine', slug: 'unrealengine', hex: '0E1128' },
  { name: 'TensorFlow', slug: 'tensorflow', hex: 'FF6F00' },
  { name: 'PyTorch', slug: 'pytorch', hex: 'EE4C2C' },
  { name: 'Tableau', slug: 'tableau', hex: 'E97627' },
  { name: 'Power BI', slug: 'powerbi', hex: 'F2C811' },
  { name: 'Jira', slug: 'jira', hex: '0052CC' },
  { name: 'Notion', slug: 'notion', hex: '000000' },
  { name: 'Slack', slug: 'slack', hex: '4A154B' },
  { name: 'Trello', slug: 'trello', hex: '0052CC' },
  { name: 'Linux', slug: 'linux', hex: 'FCC624' },
  { name: 'Nginx', slug: 'nginx', hex: '009639' },
  { name: 'GraphQL', slug: 'graphql', hex: 'E10098' },
  { name: 'Vercel', slug: 'vercel', hex: '000000' },
  { name: 'Netlify', slug: 'netlify', hex: '00C7B7' },
  { name: 'Supabase', slug: 'supabase', hex: '3FCF8E' },
  { name: 'Stripe', slug: 'stripe', hex: '008CDD' },
  { name: 'npm', slug: 'npm', hex: 'CB3837' },
  { name: 'Vite', slug: 'vite', hex: '646CFF' },
  { name: 'Webpack', slug: 'webpack', hex: '8DD6F9' },
  { name: 'Flutter', slug: 'flutter', hex: '02569B' },
  { name: 'Dart', slug: 'dart', hex: '0175C2' },
  { name: 'React Native', slug: 'react', hex: '61DAFB' },
  { name: 'Electron', slug: 'electron', hex: '47848F' },
  { name: 'Three.js', slug: 'threedotjs', hex: '000000' },
  { name: 'D3.js', slug: 'd3dotjs', hex: 'F9A03C' },
  { name: 'Cypress', slug: 'cypress', hex: '69D3A7' },
  { name: 'Jest', slug: 'jest', hex: 'C21325' },
  { name: 'Storybook', slug: 'storybook', hex: 'FF4785' },
  { name: 'Canva', slug: 'canva', hex: '00C4CC' },
  { name: 'Cinema 4D', slug: 'cinema4d', hex: '011A6A' },
  { name: 'Maya', slug: 'autodeskmaya', hex: '37A5CC' },
  { name: 'Framer', slug: 'framer', hex: '0055FF' },
  { name: 'Miro', slug: 'miro', hex: '050038' },
];

function getIconUrl(slug: string) {
  return `https://cdn.simpleicons.org/${slug}`;
}

interface SkillIconPickerProps {
  onSelect: (name: string, iconUrl: string) => void;
  onClose: () => void;
}

export default function SkillIconPicker({ onSelect, onClose }: SkillIconPickerProps) {
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const filtered = SKILL_ICONS.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div ref={ref} className="absolute bottom-full left-0 mb-2 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search skills (Figma, React, Python...)"
          className="h-8 text-sm border-none bg-transparent focus-visible:ring-0 p-0"
          autoFocus
        />
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="max-h-64 overflow-y-auto scrollbar-thin p-2 grid grid-cols-4 gap-1">
        {filtered.map(skill => (
          <button
            key={skill.slug + skill.name}
            onClick={() => {
              onSelect(skill.name, getIconUrl(skill.slug));
              onClose();
            }}
            className="flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-surface-hover transition-colors group"
            title={skill.name}
          >
            <img
              src={getIconUrl(skill.slug)}
              alt={skill.name}
              className="w-6 h-6 object-contain"
              loading="lazy"
            />
            <span className="text-[10px] text-muted-foreground group-hover:text-foreground truncate w-full text-center">
              {skill.name}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-4 text-center text-sm text-muted-foreground py-6">No icons found</p>
        )}
      </div>
    </div>
  );
}

export { SKILL_ICONS, getIconUrl };
