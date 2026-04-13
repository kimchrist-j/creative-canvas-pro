import { ResumeData } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeData;
  scale?: number;
}

export default function ResumePreview({ data, scale = 1 }: ResumePreviewProps) {
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
          {/* Left column */}
          <div className="col-span-2 space-y-8">
            {/* Education */}
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

            {/* Contact */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-4">Contact</h2>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="text-foreground">{data.personalInfo.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-foreground">{data.personalInfo.email}</p>
                </div>
                {data.personalInfo.city && (
                  <div>
                    <p className="text-xs text-muted-foreground">City</p>
                    <p className="text-foreground">{data.personalInfo.city}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Skills */}
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

            {/* Hobbies */}
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

          {/* Right column */}
          <div className="col-span-3 space-y-8">
            {/* Profile */}
            <section>
              <h2 className="text-lg font-bold text-foreground mb-3">Profile</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{data.profile}</p>
            </section>

            {/* Experience */}
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
    </div>
  );
}
