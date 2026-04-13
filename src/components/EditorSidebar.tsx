import { useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Minus, Trash2, Camera, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface EditorSidebarProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

function Section({ title, defaultOpen = false, children }: { title: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="flex items-center justify-between w-full py-4 px-4 text-sm font-medium text-foreground hover:bg-surface-hover transition-colors">
        {title}
        {open ? <Minus className="h-4 w-4 text-muted-foreground" /> : <Plus className="h-4 w-4 text-muted-foreground" />}
      </button>
      {open && <div className="px-4 pb-4 space-y-3 animate-fade-in">{children}</div>}
    </div>
  );
}

export default function EditorSidebar({ data, onChange }: EditorSidebarProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const update = (path: string, value: any) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(data));
    let obj = newData;
    for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
    obj[keys[keys.length - 1]] = value;
    onChange(newData);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${user.id}/photo-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
      update('personalInfo.photo', urlData.publicUrl);
    } catch (err: any) {
      console.error('Upload failed:', err.message);
    }
    setUploading(false);
  };

  const addEducation = () => {
    onChange({ ...data, education: [...data.education, { id: Date.now().toString(), startYear: '', endYear: '', degree: '', institution: '' }] });
  };
  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter(e => e.id !== id) });
  };
  const updateEducation = (id: string, field: string, value: string) => {
    onChange({ ...data, education: data.education.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };
  const addExperience = () => {
    onChange({ ...data, experience: [...data.experience, { id: Date.now().toString(), startYear: '', endYear: '', jobTitle: '', company: '', description: '' }] });
  };
  const removeExperience = (id: string) => {
    onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  };
  const updateExperience = (id: string, field: string, value: string) => {
    onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [field]: value } : e) });
  };

  const [newSkill, setNewSkill] = useState('');
  const [newHobby, setNewHobby] = useState('');

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      <Section title="Personal Information" defaultOpen>
        {/* Profile Photo Upload */}
        <div className="flex items-center gap-4 mb-2">
          <div className="relative group">
            {data.personalInfo.photo ? (
              <img src={data.personalInfo.photo} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-border" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground">
                {data.personalInfo.firstName?.[0] || '?'}{data.personalInfo.lastName?.[0] || ''}
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute inset-0 rounded-full bg-foreground/0 group-hover:bg-foreground/40 flex items-center justify-center transition-colors cursor-pointer"
            >
              {uploading ? (
                <Loader2 className="h-5 w-5 text-background animate-spin opacity-0 group-hover:opacity-100 transition-opacity" />
              ) : (
                <Camera className="h-5 w-5 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div className="flex-1">
            <p className="text-xs font-medium text-foreground">Profile Photo</p>
            <p className="text-xs text-muted-foreground">Click to upload</p>
            {data.personalInfo.photo && (
              <button onClick={() => update('personalInfo.photo', '')} className="text-xs text-destructive hover:underline mt-1">Remove</button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">First Name</Label>
            <Input className="h-9 text-sm" value={data.personalInfo.firstName} onChange={e => update('personalInfo.firstName', e.target.value)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Last Name</Label>
            <Input className="h-9 text-sm" value={data.personalInfo.lastName} onChange={e => update('personalInfo.lastName', e.target.value)} />
          </div>
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Job Title</Label>
          <Input className="h-9 text-sm" value={data.personalInfo.title} onChange={e => update('personalInfo.title', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Email</Label>
          <Input className="h-9 text-sm" value={data.personalInfo.email} onChange={e => update('personalInfo.email', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Phone</Label>
          <Input className="h-9 text-sm" value={data.personalInfo.phone} onChange={e => update('personalInfo.phone', e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">City</Label>
          <Input className="h-9 text-sm" value={data.personalInfo.city} onChange={e => update('personalInfo.city', e.target.value)} />
        </div>
      </Section>

      <Section title="Professional Summary">
        <Textarea className="text-sm min-h-[100px]" value={data.profile} onChange={e => update('profile', e.target.value)} placeholder="Write a brief professional summary..." />
      </Section>

      <Section title="Experience" defaultOpen>
        {data.experience.map((exp) => (
          <div key={exp.id} className="space-y-2 bg-surface p-3 rounded-lg relative">
            <button onClick={() => removeExperience(exp.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </button>
            <Input className="h-8 text-sm" placeholder="Job title" value={exp.jobTitle} onChange={e => updateExperience(exp.id, 'jobTitle', e.target.value)} />
            <Input className="h-8 text-sm" placeholder="Company" value={exp.company} onChange={e => updateExperience(exp.id, 'company', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input className="h-8 text-sm" placeholder="Start year" value={exp.startYear} onChange={e => updateExperience(exp.id, 'startYear', e.target.value)} />
              <Input className="h-8 text-sm" placeholder="End year" value={exp.endYear} onChange={e => updateExperience(exp.id, 'endYear', e.target.value)} />
            </div>
            <Textarea className="text-sm min-h-[60px]" placeholder="Description" value={exp.description} onChange={e => updateExperience(exp.id, 'description', e.target.value)} />
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addExperience} className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add Experience
        </Button>
      </Section>

      <Section title="Education">
        {data.education.map((edu) => (
          <div key={edu.id} className="space-y-2 bg-surface p-3 rounded-lg relative">
            <button onClick={() => removeEducation(edu.id)} className="absolute top-2 right-2 text-muted-foreground hover:text-destructive">
              <Trash2 className="h-3 w-3" />
            </button>
            <Input className="h-8 text-sm" placeholder="Degree" value={edu.degree} onChange={e => updateEducation(edu.id, 'degree', e.target.value)} />
            <Input className="h-8 text-sm" placeholder="Institution" value={edu.institution} onChange={e => updateEducation(edu.id, 'institution', e.target.value)} />
            <div className="grid grid-cols-2 gap-2">
              <Input className="h-8 text-sm" placeholder="Start year" value={edu.startYear} onChange={e => updateEducation(edu.id, 'startYear', e.target.value)} />
              <Input className="h-8 text-sm" placeholder="End year" value={edu.endYear} onChange={e => updateEducation(edu.id, 'endYear', e.target.value)} />
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addEducation} className="text-xs">
          <Plus className="h-3 w-3 mr-1" /> Add Education
        </Button>
      </Section>

      <Section title="Skills">
        <div className="flex flex-wrap gap-2 mb-2">
          {data.skills.map((skill, i) => (
            <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center gap-1">
              {skill}
              <button onClick={() => onChange({ ...data, skills: data.skills.filter((_, j) => j !== i) })} className="hover:text-destructive">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input className="h-8 text-sm" placeholder="Add skill" value={newSkill} onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newSkill.trim()) { onChange({ ...data, skills: [...data.skills, newSkill.trim()] }); setNewSkill(''); } }} />
          <Button variant="outline" size="sm" className="h-8" onClick={() => { if (newSkill.trim()) { onChange({ ...data, skills: [...data.skills, newSkill.trim()] }); setNewSkill(''); } }}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </Section>

      <Section title="Hobbies">
        <div className="flex flex-wrap gap-2 mb-2">
          {data.hobbies.map((hobby, i) => (
            <span key={i} className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full flex items-center gap-1">
              {hobby}
              <button onClick={() => onChange({ ...data, hobbies: data.hobbies.filter((_, j) => j !== i) })} className="hover:text-destructive">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input className="h-8 text-sm" placeholder="Add hobby" value={newHobby} onChange={e => setNewHobby(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && newHobby.trim()) { onChange({ ...data, hobbies: [...data.hobbies, newHobby.trim()] }); setNewHobby(''); } }} />
          <Button variant="outline" size="sm" className="h-8" onClick={() => { if (newHobby.trim()) { onChange({ ...data, hobbies: [...data.hobbies, newHobby.trim()] }); setNewHobby(''); } }}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </Section>
    </div>
  );
}
