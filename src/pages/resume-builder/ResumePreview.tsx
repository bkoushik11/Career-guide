import React from 'react'
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  template: string
  resumeData?: any
  templateConfig?: any
}

export default function ResumePreview({ template, resumeData, templateConfig }: ResumePreviewProps) {
  if (!resumeData) {
    return <div className="text-center text-muted-foreground">No resume data</div>
  }

  const { personal_info, summary, experience, education, projects, skills, certifications } = resumeData
  const colors = templateConfig?.colors || { primary: '#3B82F6', secondary: '#64748B' }
  const fonts = templateConfig?.fonts || { heading: 'Inter', body: 'Inter' }

  // Helper function to get full name
  const getFullName = () => {
    if (personal_info?.firstName && personal_info?.lastName) {
      return `${personal_info.firstName} ${personal_info.lastName}`
    }
    return personal_info?.fullName || 'Your Name'
  }

  const renderModernTemplate = () => (
    <div className="bg-white text-black p-8 shadow-lg max-w-2xl mx-auto text-sm" style={{ fontFamily: fonts.body }}>
      {/* Header */}
      <div className="border-b-2 pb-4 mb-6" style={{ borderColor: colors.primary }}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: fonts.heading }}>
          {getFullName()}
        </h1>
        <div className="flex flex-wrap gap-4 text-gray-600">
          {personal_info?.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personal_info.email}</span>
            </div>
          )}
          {personal_info?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personal_info.phone}</span>
            </div>
          )}
          {personal_info?.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personal_info.location}</span>
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-4 mt-2 text-gray-600">
          {personal_info?.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personal_info.website}</span>
            </div>
          )}
          {personal_info?.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>{personal_info.linkedin}</span>
            </div>
          )}
          {personal_info?.github && (
            <div className="flex items-center gap-1">
              <Github className="h-4 w-4" />
              <span>{personal_info.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Experience
          </h2>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <span className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
              <div className="text-gray-700 mb-2">
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span> • {exp.location}</span>}
              </div>
              {exp.description && (
                <div className="text-gray-700 whitespace-pre-line">
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Education
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-900">
                  {edu.degree} in {edu.field}
                </h3>
                <span className="text-gray-600 text-sm">
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">{edu.institution}</span>
                {edu.gpa && <span> • GPA: {edu.gpa}</span>}
              </div>
              {edu.description && (
                <p className="text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Projects
          </h2>
          {projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{project.name}</h3>
              {project.technologies && project.technologies.length > 0 && (
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </div>
              )}
              {project.description && (
                <p className="text-gray-700 mb-2">{project.description}</p>
              )}
              <div className="flex gap-4 text-sm" style={{ color: colors.primary }}>
                {project.url && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    <span>Live Demo</span>
                  </div>
                )}
                {project.github && (
                  <div className="flex items-center gap-1">
                    <Github className="h-3 w-3" />
                    <span>GitHub</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Certifications
          </h2>
          {certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-4 w-4" style={{ color: colors.primary }} />
                <h3 className="font-semibold text-gray-900">{cert.name}</h3>
              </div>
              <div className="text-gray-700">
                <span className="font-medium">{cert.issuer}</span>
                <span> • Issued: {cert.date}</span>
                {cert.expiryDate && <span> • Expires: {cert.expiryDate}</span>}
              </div>
              {cert.credentialId && (
                <div className="text-gray-600 text-sm">
                  Credential ID: {cert.credentialId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-3" style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 rounded-full text-sm"
                style={{ 
                  backgroundColor: `${colors.primary}20`, 
                  color: colors.primary,
                  border: `1px solid ${colors.primary}40`
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  const renderClassicTemplate = () => (
    <div className="bg-white text-black p-8 shadow-lg max-w-2xl mx-auto text-sm" style={{ fontFamily: fonts.body }}>
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: fonts.heading }}>
          {getFullName()}
        </h1>
        <div className="text-gray-600 space-y-1">
          {personal_info?.email && <div>{personal_info.email}</div>}
          {personal_info?.phone && <div>{personal_info.phone}</div>}
          {personal_info?.location && <div>{personal_info.location}</div>}
          <div className="flex justify-center gap-4 mt-2">
            {personal_info?.website && <span>{personal_info.website}</span>}
            {personal_info?.linkedin && <span>{personal_info.linkedin}</span>}
            {personal_info?.github && <span>{personal_info.github}</span>}
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Experience
          </h2>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{exp.position}</h3>
                  <div className="text-gray-700">
                    {exp.company}{exp.location && `, ${exp.location}`}
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
              {exp.description && (
                <div className="text-gray-700 whitespace-pre-line mt-2">
                  {exp.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Education
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">
                    {edu.degree} in {edu.field}
                  </h3>
                  <div className="text-gray-700">
                    {edu.institution}{edu.gpa && ` • GPA: ${edu.gpa}`}
                  </div>
                </div>
                <div className="text-gray-600 text-sm">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
              {edu.description && (
                <p className="text-gray-700 mt-1">{edu.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Projects
          </h2>
          {projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <h3 className="font-bold text-gray-900 mb-1">{project.name}</h3>
              {project.technologies && project.technologies.length > 0 && (
                <div className="text-gray-600 mb-2">
                  <span className="font-medium">Technologies:</span> {project.technologies.join(', ')}
                </div>
              )}
              {project.description && (
                <p className="text-gray-700 mb-2">{project.description}</p>
              )}
              <div className="text-sm text-gray-600">
                {project.url && <div>Live: {project.url}</div>}
                {project.github && <div>GitHub: {project.github}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Certifications
          </h2>
          {certifications.map((cert: any, index: number) => (
            <div key={index} className="mb-3">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" style={{ color: colors.primary }} />
                <h3 className="font-bold text-gray-900">{cert.name}</h3>
              </div>
              <div className="text-gray-700 ml-6">
                <span className="font-medium">{cert.issuer}</span>
                <span> • Issued: {cert.date}</span>
                {cert.expiryDate && <span> • Expires: {cert.expiryDate}</span>}
              </div>
              {cert.credentialId && (
                <div className="text-gray-600 text-sm ml-6">
                  Credential ID: {cert.credentialId}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-gray-900 mb-3 uppercase tracking-wide" style={{ fontFamily: fonts.heading }}>
            Skills
          </h2>
          <p className="text-gray-700">{skills.join(' • ')}</p>
        </div>
      )}
    </div>
  )

  // Template selection
  switch (template) {
    case 'classic-executive':
    case 'academic-researcher':
      return renderClassicTemplate()
    case 'modern-professional':
    case 'creative-designer':
    case 'minimalist-clean':
    case 'tech-developer':
    default:
      return renderModernTemplate()
  }
}