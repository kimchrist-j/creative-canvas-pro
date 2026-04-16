import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  template?: string;
}

function SkillBadge({ skill, className, style }: { skill: { name: string; icon?: string }; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={className} style={style}>
      {skill.icon && <img src={skill.icon} alt="" className="w-3.5 h-3.5 object-contain inline-block mr-1 align-middle" />}
      {skill.name}
    </span>
  );
}

function ReferencesSection({ refs, color = '#6366f1' }: { refs: ResumeData['references']; color?: string }) {
  if (!refs || refs.length === 0) return null;
  return (
    <section>
      <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color }}>References</h2>
      <div className="grid grid-cols-2 gap-3">
        {refs.map(r => (
          <div key={r.id} className="text-xs">
            <p className="font-semibold">{r.name}</p>
            <p style={{ color: '#6b7280' }}>{r.title}, {r.company}</p>
            <p style={{ color: '#9ca3af' }}>{r.phone} · {r.email}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── 1. CLASSIC ─── */
function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12" style={{ color: '#1a1a1a' }}>
      <div className="flex items-start gap-6 mb-10">
        {data.personalInfo.photo ? (
          <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover" style={{ border: '2px solid #e5e7eb' }} />
        ) : (
          <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }}>
            {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold leading-tight">{data.personalInfo.firstName}<br />{data.personalInfo.lastName}</h1>
          <p className="text-lg mt-1" style={{ color: '#6b7280' }}>{data.personalInfo.title}</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{edu.startYear} - {edu.endYear}</p>
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-4">Contact</h2>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs" style={{ color: '#9ca3af' }}>Phone</p><p>{data.personalInfo.phone}</p></div>
              <div><p className="text-xs" style={{ color: '#9ca3af' }}>Email</p><p>{data.personalInfo.email}</p></div>
              {data.personalInfo.city && <div><p className="text-xs" style={{ color: '#9ca3af' }}>City</p><p>{data.personalInfo.city}</p></div>}
            </div>
          </section>
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <SkillBadge key={i} skill={skill} className="text-xs px-3 py-1 rounded-full inline-flex items-center" style={{ backgroundColor: '#f3f4f6' }} />
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="col-span-3 space-y-8">
          <section>
            <h2 className="text-lg font-bold mb-3">Profile</h2>
            <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{data.profile}</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-4">Experience</h2>
            <div className="space-y-5">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div><p className="font-semibold text-sm">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#9ca3af' }}>{exp.company}</p></div>
                    <p className="text-xs whitespace-nowrap" style={{ color: '#9ca3af' }}>{exp.startYear} - {exp.endYear}</p>
                  </div>
                  <p className="text-sm mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          <ReferencesSection refs={data.references} color="#1a1a1a" />
        </div>
      </div>
    </div>
  );
}

/* ─── 2. MODERN ─── */
function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-full">
      <div className="w-[280px] p-8" style={{ backgroundColor: '#1e293b', color: '#fff' }}>
        <div className="flex flex-col items-center mb-8">
          {data.personalInfo.photo ? (
            <img src={data.personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover mb-4" style={{ border: '4px solid rgba(255,255,255,0.2)' }} />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
              {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
            </div>
          )}
          <h1 className="text-xl font-bold text-center">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <p className="text-sm mt-1" style={{ opacity: 0.7 }}>{data.personalInfo.title}</p>
        </div>
        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.5 }}>Contact</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3" style={{ opacity: 0.5 }} /><span>{data.personalInfo.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3 w-3" style={{ opacity: 0.5 }} /><span className="break-all">{data.personalInfo.email}</span></div>
              {data.personalInfo.city && <div className="flex items-center gap-2"><MapPin className="h-3 w-3" style={{ opacity: 0.5 }} /><span>{data.personalInfo.city}</span></div>}
            </div>
          </section>
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.5 }}>Skills</h2>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {skill.icon && <img src={skill.icon} alt="" className="w-4 h-4 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />}
                    <div className="flex-1">
                      <p className="text-xs mb-1">{skill.name}</p>
                      <div className="h-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.6)', width: `${70 + (i * 7) % 30}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ opacity: 0.5 }}>Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs font-semibold">{edu.degree}</p>
                  <p className="text-xs" style={{ opacity: 0.6 }}>{edu.institution}</p>
                  <p className="text-xs" style={{ opacity: 0.4 }}>{edu.startYear} - {edu.endYear}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      <div className="flex-1 p-10" style={{ color: '#1a1a1a' }}>
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-3 pb-2" style={{ borderBottom: '2px solid #1e293b' }}>About Me</h2>
          <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{data.profile}</p>
        </section>
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 pb-2" style={{ borderBottom: '2px solid #1e293b' }}>Work Experience</h2>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id} className="pl-6 relative">
                <div className="absolute left-0 top-2 w-2.5 h-2.5 rounded-full" style={{ border: '2px solid #1e293b' }} />
                <div className="flex justify-between items-start mb-1">
                  <div><p className="font-bold text-sm">{exp.jobTitle}</p><p className="text-xs font-medium" style={{ color: '#6b7280' }}>{exp.company}</p></div>
                  <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}>{exp.startYear} - {exp.endYear}</span>
                </div>
                <p className="text-sm leading-relaxed mt-1" style={{ color: '#6b7280' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <ReferencesSection refs={data.references} color="#1e293b" />
      </div>
    </div>
  );
}

/* ─── 3. MINIMAL ─── */
function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-14" style={{ color: '#1a1a1a' }}>
      <div className="text-center mb-10 pb-8" style={{ borderBottom: '1px solid #e5e7eb' }}>
        {data.personalInfo.photo && (
          <img src={data.personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-4" style={{ border: '1px solid #e5e7eb' }} />
        )}
        <h1 className="text-3xl tracking-wide" style={{ fontWeight: 300 }}>
          {data.personalInfo.firstName} <span style={{ fontWeight: 700 }}>{data.personalInfo.lastName}</span>
        </h1>
        <p className="text-sm mt-2 uppercase" style={{ letterSpacing: '0.2em', color: '#6b7280' }}>{data.personalInfo.title}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs" style={{ color: '#6b7280' }}>
          <span>{data.personalInfo.email}</span>
          <span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#9ca3af' }} />
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.city && (
            <><span className="w-1 h-1 rounded-full" style={{ backgroundColor: '#9ca3af' }} /><span>{data.personalInfo.city}</span></>
          )}
        </div>
      </div>
      {data.profile && <section className="mb-8"><p className="text-sm leading-relaxed text-center max-w-[500px] mx-auto" style={{ color: '#6b7280' }}>{data.profile}</p></section>}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase mb-5 text-center" style={{ letterSpacing: '0.2em' }}>Experience</h2>
        <div className="space-y-5">
          {data.experience.map(exp => (
            <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
              <p className="text-xs text-right pt-0.5" style={{ color: '#9ca3af' }}>{exp.startYear} – {exp.endYear}</p>
              <div><p className="text-sm font-semibold">{exp.jobTitle}</p><p className="text-xs italic" style={{ color: '#9ca3af' }}>{exp.company}</p><p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p></div>
            </div>
          ))}
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase mb-5 text-center" style={{ letterSpacing: '0.2em' }}>Education</h2>
        <div className="space-y-3">
          {data.education.map(edu => (
            <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4">
              <p className="text-xs text-right pt-0.5" style={{ color: '#9ca3af' }}>{edu.startYear} – {edu.endYear}</p>
              <div><p className="text-sm font-semibold">{edu.degree}</p><p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution}</p></div>
            </div>
          ))}
        </div>
      </section>
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase mb-4 text-center" style={{ letterSpacing: '0.2em' }}>Skills</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {data.skills.map((s, i) => (
              <SkillBadge key={i} skill={s} className="text-xs px-3 py-1 rounded-full inline-flex items-center" style={{ border: '1px solid #e5e7eb' }} />
            ))}
          </div>
        </section>
      )}
      {data.hobbies.length > 0 && (
        <section className="mb-8"><h2 className="text-xs font-bold uppercase mb-4 text-center" style={{ letterSpacing: '0.2em' }}>Interests</h2><p className="text-xs text-center" style={{ color: '#6b7280' }}>{data.hobbies.join(' • ')}</p></section>
      )}
      <ReferencesSection refs={data.references} color="#1a1a1a" />
    </div>
  );
}

/* ─── 4. BOLD ─── */
function BoldTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ color: '#1a1a1a' }}>
      <div className="relative p-10 pb-16" style={{ backgroundColor: '#0f0f0f', color: '#ffffff' }}>
        {data.personalInfo.photo && (
          <img src={data.personalInfo.photo} alt="" className="absolute right-10 top-6 w-32 h-32 rounded-2xl object-cover" style={{ border: '3px solid rgba(255,255,255,0.15)' }} />
        )}
        <h1 className="text-5xl font-black leading-tight" style={{ letterSpacing: '-0.02em' }}>
          {data.personalInfo.firstName}<br />{data.personalInfo.lastName} —
        </h1>
        <p className="text-sm mt-4 max-w-[380px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {data.profile || `${data.personalInfo.title} ready to take on new challenges.`}
        </p>
      </div>
      <div className="p-10 space-y-8">
        <div className="grid grid-cols-2 gap-6 pb-6" style={{ borderBottom: '1px solid #e5e7eb' }}>
          <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Phone</p><p className="text-sm font-medium">{data.personalInfo.phone}</p></div>
          <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Email</p><p className="text-sm font-medium">{data.personalInfo.email}</p></div>
          <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Location</p><p className="text-sm font-medium">{data.personalInfo.city || '—'}</p></div>
          <div><p className="text-[10px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Title</p><p className="text-sm font-medium">{data.personalInfo.title}</p></div>
        </div>
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Skills</h2>
            <div className="grid grid-cols-2 gap-3">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                  {skill.icon ? <img src={skill.icon} alt="" className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded" style={{ backgroundColor: '#e5e7eb' }} />}
                  <p className="text-xs font-medium">{skill.name}</p>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Experience</h2>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="flex gap-4 p-3 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                <div className="text-xs font-medium whitespace-nowrap pt-0.5" style={{ color: '#9ca3af', minWidth: 80 }}>{exp.startYear} — {exp.endYear}</div>
                <div className="flex-1">
                  <p className="text-sm font-bold">{exp.jobTitle}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4">Education</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="flex gap-4">
                <span className="text-xs" style={{ color: '#9ca3af', minWidth: 80 }}>{edu.startYear} — {edu.endYear}</span>
                <div><p className="text-sm font-semibold">{edu.degree}</p><p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution}</p></div>
              </div>
            ))}
          </div>
        </section>
        <ReferencesSection refs={data.references} color="#0f0f0f" />
      </div>
    </div>
  );
}

/* ─── 5. CREATIVE ─── */
function CreativeTemplate({ data }: { data: ResumeData }) {
  const accent = '#EAB308';
  return (
    <div className="p-10" style={{ color: '#1a1a1a' }}>
      <div className="flex items-start gap-6 mb-8">
        <div className="w-28 h-28 rounded-full flex items-center justify-center" style={{ backgroundColor: accent }}>
          {data.personalInfo.photo ? <img src={data.personalInfo.photo} alt="" className="w-24 h-24 rounded-full object-cover" /> : <span className="text-3xl font-black" style={{ color: '#1a1a1a' }}>{data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}</span>}
        </div>
        <div className="pt-2">
          <h1 className="text-4xl font-black leading-none">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <p className="text-base font-medium mt-1" style={{ color: '#6b7280' }}>{data.personalInfo.title}</p>
          <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: '#6b7280' }}>
            <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {data.personalInfo.email}</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {data.personalInfo.phone}</span>
          </div>
        </div>
      </div>
      <div className="h-px mb-6" style={{ backgroundColor: accent }} />
      {['Profile', 'Skills', 'Experience', 'Education'].map(sec => {
        if (sec === 'Profile') return (
          <section key={sec} className="mb-6">
            <div className="flex items-center gap-2 mb-2"><h2 className="text-sm font-bold">{sec}</h2><div className="h-px flex-1" style={{ backgroundColor: accent }} /></div>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{data.profile}</p>
          </section>
        );
        if (sec === 'Skills' && data.skills.length > 0) return (
          <section key={sec} className="mb-6">
            <div className="flex items-center gap-2 mb-3"><h2 className="text-sm font-bold">{sec}</h2><div className="h-px flex-1" style={{ backgroundColor: accent }} /></div>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ border: `1.5px solid ${accent}` }}>
                  {skill.icon && <img src={skill.icon} alt="" className="w-4 h-4 object-contain" />}{skill.name}
                </div>
              ))}
            </div>
          </section>
        );
        if (sec === 'Experience') return (
          <section key={sec} className="mb-6">
            <div className="flex items-center gap-2 mb-3"><h2 className="text-sm font-bold">Work Experience</h2><div className="h-px flex-1" style={{ backgroundColor: accent }} /></div>
            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="flex gap-4">
                  <div className="text-xs whitespace-nowrap pt-0.5" style={{ color: '#9ca3af', minWidth: 90 }}>{exp.startYear} - {exp.endYear}</div>
                  <div className="flex-1 pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                    <p className="text-sm font-bold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p>
                    <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
        if (sec === 'Education') return (
          <section key={sec}>
            <div className="flex items-center gap-2 mb-3"><h2 className="text-sm font-bold">{sec}</h2><div className="h-px flex-1" style={{ backgroundColor: accent }} /></div>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id} className="flex gap-4">
                  <span className="text-xs" style={{ color: '#9ca3af', minWidth: 90 }}>{edu.startYear} - {edu.endYear}</span>
                  <div className="flex-1 pl-4" style={{ borderLeft: `2px solid ${accent}` }}>
                    <p className="text-sm font-semibold">{edu.degree}</p><p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
        return null;
      })}
    </div>
  );
}

/* ─── 6. EXECUTIVE ─── */
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  return (
    <div style={{ color: '#1a1a1a' }}>
      <div className="h-28 relative" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="absolute -bottom-14 left-10">
          {data.personalInfo.photo ? (
            <img src={data.personalInfo.photo} alt="" className="w-28 h-28 rounded-full object-cover" style={{ border: '4px solid #ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
          ) : (
            <div className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: '#f3f4f6', border: '4px solid #ffffff', color: '#9ca3af' }}>
              {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
            </div>
          )}
        </div>
      </div>
      <div className="pt-20 px-10 pb-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <p className="text-sm mt-1" style={{ color: '#6b7280' }}>{data.personalInfo.title} based in {data.personalInfo.city || 'City'}</p>
        </div>
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-3">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#6366f1' }}>About me</h2>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{data.profile}</p>
          </div>
          <div className="col-span-2 space-y-2 text-xs">
            <div className="flex justify-between"><span style={{ color: '#9ca3af' }}>Email</span><span className="font-medium">{data.personalInfo.email}</span></div>
            <div className="flex justify-between"><span style={{ color: '#9ca3af' }}>Phone</span><span className="font-medium">{data.personalInfo.phone}</span></div>
            <div className="flex justify-between"><span style={{ color: '#9ca3af' }}>Location</span><span className="font-medium">{data.personalInfo.city || '—'}</span></div>
          </div>
        </div>
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6366f1' }}>Skills</h2>
            <div className="grid grid-cols-3 gap-2">
              {data.skills.map((skill, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: '#f9fafb' }}>
                  {skill.icon ? <img src={skill.icon} alt="" className="w-5 h-5 object-contain" /> : <div className="w-5 h-5 rounded-full" style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)' }} />}
                  <span className="text-xs font-medium">{skill.name}</span>
                </div>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366f1' }}>Experience</h2>
          <div className="space-y-4">
            {data.experience.map(exp => (
              <div key={exp.id} className="p-4 rounded-xl" style={{ backgroundColor: '#f9fafb' }}>
                <div className="flex justify-between items-start">
                  <div><p className="text-sm font-bold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p></div>
                  <span className="text-[10px] font-medium" style={{ color: '#9ca3af' }}>{exp.startYear} – {exp.endYear}</span>
                </div>
                <p className="text-xs mt-2 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6366f1' }}>Education</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="flex gap-4 items-start">
                <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: '#6366f1' }} />
                <div><p className="text-sm font-semibold">{edu.degree}</p><p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution} · {edu.startYear} – {edu.endYear}</p></div>
              </div>
            ))}
          </div>
        </section>
        <ReferencesSection refs={data.references} />
      </div>
    </div>
  );
}

/* ─── 7. FORMAL (No photo, very traditional) ─── */
function FormalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12" style={{ color: '#1a1a1a', fontFamily: "'Georgia', 'Times New Roman', serif" }}>
      <div className="text-center mb-8 pb-4" style={{ borderBottom: '2px solid #1a1a1a' }}>
        <h1 className="text-3xl font-bold uppercase tracking-wide">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
        <p className="text-sm mt-2 uppercase tracking-widest" style={{ color: '#6b7280' }}>{data.personalInfo.title}</p>
        <div className="flex justify-center gap-6 mt-3 text-xs" style={{ color: '#6b7280' }}>
          <span>{data.personalInfo.email}</span><span>{data.personalInfo.phone}</span>
          {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
        </div>
      </div>
      {data.profile && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-2" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: 4 }}>Professional Summary</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>{data.profile}</p>
        </section>
      )}
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase mb-3" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: 4 }}>Professional Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-4">
            <div className="flex justify-between"><p className="text-sm font-bold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.startYear} – {exp.endYear}</p></div>
            <p className="text-xs italic" style={{ color: '#6b7280' }}>{exp.company}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#4b5563' }}>{exp.description}</p>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-sm font-bold uppercase mb-3" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: 4 }}>Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-3">
            <div className="flex justify-between"><p className="text-sm font-semibold">{edu.degree}</p><p className="text-xs" style={{ color: '#6b7280' }}>{edu.startYear} – {edu.endYear}</p></div>
            <p className="text-xs" style={{ color: '#6b7280' }}>{edu.institution}</p>
          </div>
        ))}
      </section>
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase mb-3" style={{ borderBottom: '1px solid #d1d5db', paddingBottom: 4 }}>Skills</h2>
          <p className="text-xs" style={{ color: '#4b5563' }}>{data.skills.map(s => s.name).join(' · ')}</p>
        </section>
      )}
      <ReferencesSection refs={data.references} color="#1a1a1a" />
    </div>
  );
}

/* ─── 8. ACADEMIC (Multi-page friendly, no photo) ─── */
function AcademicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12" style={{ color: '#1a1a1a' }}>
      <h1 className="text-2xl font-bold mb-1">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
      <p className="text-sm" style={{ color: '#2563eb' }}>{data.personalInfo.title}</p>
      <div className="flex gap-4 mt-2 text-xs" style={{ color: '#6b7280' }}>
        <span>{data.personalInfo.email}</span><span>{data.personalInfo.phone}</span>
        {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
      </div>
      <div className="h-px my-6" style={{ backgroundColor: '#2563eb' }} />
      {data.profile && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2563eb' }}>Research Interests / Summary</h2>
          <p className="text-xs leading-relaxed" style={{ color: '#4b5563' }}>{data.profile}</p>
        </section>
      )}
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563eb' }}>Education</h2>
        {data.education.map(edu => (
          <div key={edu.id} className="mb-3 pl-4" style={{ borderLeft: '2px solid #2563eb' }}>
            <p className="text-sm font-semibold">{edu.degree}</p>
            <p className="text-xs" style={{ color: '#6b7280' }}>{edu.institution} — {edu.startYear} to {edu.endYear}</p>
          </div>
        ))}
      </section>
      <section className="mb-6">
        <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563eb' }}>Experience</h2>
        {data.experience.map(exp => (
          <div key={exp.id} className="mb-4 pl-4" style={{ borderLeft: '2px solid #2563eb' }}>
            <div className="flex justify-between"><p className="text-sm font-semibold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.startYear} – {exp.endYear}</p></div>
            <p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p>
            <p className="text-xs mt-1 leading-relaxed" style={{ color: '#4b5563' }}>{exp.description}</p>
          </div>
        ))}
      </section>
      {data.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2563eb' }}>Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {data.skills.map((s, i) => (
              <SkillBadge key={i} skill={s} className="text-xs px-3 py-1 rounded inline-flex items-center" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }} />
            ))}
          </div>
        </section>
      )}
      <ReferencesSection refs={data.references} color="#2563eb" />
    </div>
  );
}

/* ─── 9. TECH (Developer-focused, dark sidebar) ─── */
function TechTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-full">
      <div className="w-[260px] p-8" style={{ backgroundColor: '#0f172a', color: '#e2e8f0' }}>
        {data.personalInfo.photo && (
          <img src={data.personalInfo.photo} alt="" className="w-20 h-20 rounded-xl object-cover mb-6" style={{ border: '2px solid #334155' }} />
        )}
        <h1 className="text-lg font-bold mb-1">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
        <p className="text-xs mb-6" style={{ color: '#10b981' }}>{`<${data.personalInfo.title} />`}</p>
        <section className="mb-6">
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Contact</h2>
          <div className="space-y-2 text-xs" style={{ color: '#94a3b8' }}>
            <p>{data.personalInfo.email}</p><p>{data.personalInfo.phone}</p>
            {data.personalInfo.city && <p>{data.personalInfo.city}</p>}
          </div>
        </section>
        {data.skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Tech Stack</h2>
            <div className="flex flex-wrap gap-1.5">
              {data.skills.map((s, i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded inline-flex items-center gap-1" style={{ backgroundColor: '#1e293b', color: '#10b981' }}>
                  {s.icon && <img src={s.icon} alt="" className="w-3 h-3 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />}
                  {s.name}
                </span>
              ))}
            </div>
          </section>
        )}
        <section>
          <h2 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: '#64748b' }}>Education</h2>
          <div className="space-y-3">
            {data.education.map(edu => (
              <div key={edu.id} className="text-xs">
                <p className="font-semibold" style={{ color: '#e2e8f0' }}>{edu.degree}</p>
                <p style={{ color: '#64748b' }}>{edu.institution}</p>
                <p style={{ color: '#475569' }}>{edu.startYear} - {edu.endYear}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <div className="flex-1 p-10" style={{ color: '#1a1a1a' }}>
        {data.profile && (
          <section className="mb-8">
            <h2 className="text-sm font-bold mb-2" style={{ color: '#0f172a' }}>// About</h2>
            <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{data.profile}</p>
          </section>
        )}
        <section>
          <h2 className="text-sm font-bold mb-4" style={{ color: '#0f172a' }}>// Experience</h2>
          <div className="space-y-5">
            {data.experience.map(exp => (
              <div key={exp.id} className="pl-4" style={{ borderLeft: '2px solid #10b981' }}>
                <div className="flex justify-between items-start mb-1">
                  <div><p className="text-sm font-bold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p></div>
                  <span className="text-[10px] px-2 py-0.5 rounded" style={{ backgroundColor: '#f0fdf4', color: '#10b981' }}>{exp.startYear} – {exp.endYear}</span>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="mt-8"><ReferencesSection refs={data.references} color="#10b981" /></div>
      </div>
    </div>
  );
}

/* ─── 10. ELEGANT (Sophisticated, subtle colors) ─── */
function ElegantTemplate({ data }: { data: ResumeData }) {
  const accent = '#92400e';
  return (
    <div className="p-12" style={{ color: '#1a1a1a' }}>
      <div className="flex items-end gap-6 mb-8 pb-6" style={{ borderBottom: `1px solid ${accent}30` }}>
        {data.personalInfo.photo && (
          <img src={data.personalInfo.photo} alt="" className="w-24 h-24 rounded-lg object-cover" style={{ border: `2px solid ${accent}30` }} />
        )}
        <div>
          <h1 className="text-3xl font-light tracking-wide">{data.personalInfo.firstName} <span className="font-bold">{data.personalInfo.lastName}</span></h1>
          <p className="text-sm mt-1 tracking-wider uppercase" style={{ color: accent }}>{data.personalInfo.title}</p>
          <div className="flex gap-4 mt-2 text-xs" style={{ color: '#6b7280' }}>
            <span>{data.personalInfo.email}</span><span>{data.personalInfo.phone}</span>
            {data.personalInfo.city && <span>{data.personalInfo.city}</span>}
          </div>
        </div>
      </div>
      {data.profile && (
        <section className="mb-8">
          <p className="text-xs leading-relaxed italic" style={{ color: '#6b7280', maxWidth: 500 }}>{data.profile}</p>
        </section>
      )}
      <div className="grid grid-cols-3 gap-10">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Experience</h2>
            <div className="space-y-5">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div><p className="text-sm font-semibold">{exp.jobTitle}</p><p className="text-xs" style={{ color: '#6b7280' }}>{exp.company}</p></div>
                    <p className="text-xs" style={{ color: '#9ca3af' }}>{exp.startYear} – {exp.endYear}</p>
                  </div>
                  <p className="text-xs mt-1 leading-relaxed" style={{ color: '#6b7280' }}>{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
          <ReferencesSection refs={data.references} color={accent} />
        </div>
        <div className="space-y-8">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <p className="text-sm font-semibold">{edu.degree}</p>
                  <p className="text-xs" style={{ color: '#9ca3af' }}>{edu.institution}</p>
                  <p className="text-xs" style={{ color: '#d1d5db' }}>{edu.startYear} – {edu.endYear}</p>
                </div>
              ))}
            </div>
          </section>
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Skills</h2>
              <div className="space-y-2">
                {data.skills.map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    {s.icon && <img src={s.icon} alt="" className="w-4 h-4 object-contain" />}
                    <span className="text-xs">{s.name}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
          {data.hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>Interests</h2>
              <p className="text-xs" style={{ color: '#6b7280' }}>{data.hobbies.join(' · ')}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function ResumePreview({ data, scale = 1, template = 'classic' }: ResumePreviewProps) {
  const renderTemplate = () => {
    switch (template) {
      case 'modern': return <ModernTemplate data={data} />;
      case 'minimal': return <MinimalTemplate data={data} />;
      case 'bold': return <BoldTemplate data={data} />;
      case 'creative': return <CreativeTemplate data={data} />;
      case 'executive': return <ExecutiveTemplate data={data} />;
      case 'formal': return <FormalTemplate data={data} />;
      case 'academic': return <AcademicTemplate data={data} />;
      case 'tech': return <TechTemplate data={data} />;
      case 'elegant': return <ElegantTemplate data={data} />;
      default: return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div
      id="resume-preview"
      className="mx-auto origin-top"
      style={{
        width: 794,
        minHeight: 1123,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      }}
    >
      {renderTemplate()}
    </div>
  );
}
