import { ResumeData } from '@/types/resume';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
  template?: string;
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-12">
      {/* Header */}
      <div className="flex items-start gap-6 mb-10">
        {data.personalInfo.photo ? (
          <img src={data.personalInfo.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-border" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
            {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {data.personalInfo.firstName}<br />{data.personalInfo.lastName}
          </h1>
          <p className="text-muted-foreground text-lg mt-1">{data.personalInfo.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-2 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Education</h2>
            <div className="space-y-4">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs text-muted-foreground">{edu.startYear} - {edu.endYear}</p>
                  <p className="font-semibold text-sm text-foreground">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Contact</h2>
            <div className="space-y-2 text-sm">
              <div><p className="text-xs text-muted-foreground">Phone</p><p className="text-foreground">{data.personalInfo.phone}</p></div>
              <div><p className="text-xs text-muted-foreground">Email</p><p className="text-foreground">{data.personalInfo.email}</p></div>
              {data.personalInfo.city && <div><p className="text-xs text-muted-foreground">City</p><p className="text-foreground">{data.personalInfo.city}</p></div>}
            </div>
          </section>
          {data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, i) => (
                  <span key={i} className="text-xs bg-secondary text-secondary-foreground px-3 py-1 rounded-full">{skill}</span>
                ))}
              </div>
            </section>
          )}
          {data.hobbies.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">Hobbies</h2>
              <div className="flex flex-wrap gap-2">
                {data.hobbies.map((hobby, i) => (
                  <span key={i} className="text-xs text-muted-foreground">{hobby}</span>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="col-span-3 space-y-8">
          <section>
            <h2 className="text-lg font-bold text-foreground mb-3">Profile</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{data.profile}</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-foreground mb-4">Experience</h2>
            <div className="space-y-5">
              {data.experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-foreground">{exp.jobTitle}</p>
                      <p className="text-xs text-muted-foreground">{exp.company}</p>
                    </div>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{exp.startYear} - {exp.endYear}</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="flex min-h-full">
      {/* Sidebar */}
      <div className="w-[280px] p-8" style={{ backgroundColor: 'hsl(220 25% 14%)', color: '#fff' }}>
        <div className="flex flex-col items-center mb-8">
          {data.personalInfo.photo ? (
            <img src={data.personalInfo.photo} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-white/20 mb-4" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/10 flex items-center justify-center text-3xl font-bold mb-4">
              {data.personalInfo.firstName[0]}{data.personalInfo.lastName[0]}
            </div>
          )}
          <h1 className="text-xl font-bold text-center">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <p className="text-sm opacity-70 mt-1">{data.personalInfo.title}</p>
        </div>

        <div className="space-y-6">
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Contact</h2>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2"><Phone className="h-3 w-3 opacity-50" /><span>{data.personalInfo.phone}</span></div>
              <div className="flex items-center gap-2"><Mail className="h-3 w-3 opacity-50" /><span className="break-all">{data.personalInfo.email}</span></div>
              {data.personalInfo.city && <div className="flex items-center gap-2"><MapPin className="h-3 w-3 opacity-50" /><span>{data.personalInfo.city}</span></div>}
            </div>
          </section>

          {data.skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Skills</h2>
              <div className="space-y-2">
                {data.skills.map((skill, i) => (
                  <div key={i}>
                    <p className="text-xs mb-1">{skill}</p>
                    <div className="h-1.5 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-white/60" style={{ width: `${70 + Math.random() * 30}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Education</h2>
            <div className="space-y-3">
              {data.education.map(edu => (
                <div key={edu.id}>
                  <p className="text-xs font-semibold">{edu.degree}</p>
                  <p className="text-xs opacity-60">{edu.institution}</p>
                  <p className="text-xs opacity-40">{edu.startYear} - {edu.endYear}</p>
                </div>
              ))}
            </div>
          </section>

          {data.hobbies.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-widest mb-3 opacity-50">Interests</h2>
              <div className="flex flex-wrap gap-1.5">
                {data.hobbies.map((h, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/10">{h}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-10">
        <section className="mb-8">
          <h2 className="text-lg font-bold text-foreground mb-3 pb-2 border-b-2" style={{ borderColor: 'hsl(220 25% 14%)' }}>About Me</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{data.profile}</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b-2" style={{ borderColor: 'hsl(220 25% 14%)' }}>Work Experience</h2>
          <div className="space-y-6">
            {data.experience.map(exp => (
              <div key={exp.id} className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-2.5 before:h-2.5 before:rounded-full before:border-2" style={{ '--tw-before-border-color': 'hsl(220 25% 14%)' } as any}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <p className="font-bold text-sm text-foreground">{exp.jobTitle}</p>
                    <p className="text-xs text-muted-foreground font-medium">{exp.company}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded text-muted-foreground" style={{ backgroundColor: 'hsl(220 25% 14% / 0.08)' }}>{exp.startYear} - {exp.endYear}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1">{exp.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MinimalTemplate({ data }: { data: ResumeData }) {
  return (
    <div className="p-14">
      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b border-border">
        {data.personalInfo.photo && (
          <img src={data.personalInfo.photo} alt="Profile" className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border border-border" />
        )}
        <h1 className="text-3xl font-light tracking-wide text-foreground">
          {data.personalInfo.firstName} <span className="font-bold">{data.personalInfo.lastName}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-2 uppercase tracking-[0.2em]">{data.personalInfo.title}</p>
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <span>{data.personalInfo.email}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground" />
          <span>{data.personalInfo.phone}</span>
          {data.personalInfo.city && (
            <>
              <span className="w-1 h-1 rounded-full bg-muted-foreground" />
              <span>{data.personalInfo.city}</span>
            </>
          )}
        </div>
      </div>

      {/* Profile */}
      {data.profile && (
        <section className="mb-8">
          <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-[500px] mx-auto">{data.profile}</p>
        </section>
      )}

      {/* Experience */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-5 text-center">Experience</h2>
        <div className="space-y-5">
          {data.experience.map(exp => (
            <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-4">
              <p className="text-xs text-muted-foreground text-right pt-0.5">{exp.startYear} – {exp.endYear}</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{exp.jobTitle}</p>
                <p className="text-xs text-muted-foreground italic">{exp.company}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-5 text-center">Education</h2>
        <div className="space-y-3">
          {data.education.map(edu => (
            <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-4">
              <p className="text-xs text-muted-foreground text-right pt-0.5">{edu.startYear} – {edu.endYear}</p>
              <div>
                <p className="text-sm font-semibold text-foreground">{edu.degree}</p>
                <p className="text-xs text-muted-foreground">{edu.institution}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      {data.skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-4 text-center">Skills</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {data.skills.map((s, i) => (
              <span key={i} className="text-xs border border-border px-3 py-1 rounded-full text-foreground">{s}</span>
            ))}
          </div>
        </section>
      )}

      {/* Hobbies */}
      {data.hobbies.length > 0 && (
        <section>
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-foreground mb-4 text-center">Interests</h2>
          <p className="text-xs text-muted-foreground text-center">{data.hobbies.join(' • ')}</p>
        </section>
      )}
    </div>
  );
}

export default function ResumePreview({ data, scale = 1, template = 'classic' }: ResumePreviewProps) {
  return (
    <div
      id="resume-preview"
      className="bg-background shadow-lg mx-auto origin-top"
      style={{
        width: 794,
        minHeight: 1123,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {template === 'modern' ? (
        <ModernTemplate data={data} />
      ) : template === 'minimal' ? (
        <MinimalTemplate data={data} />
      ) : (
        <ClassicTemplate data={data} />
      )}
    </div>
  );
}
