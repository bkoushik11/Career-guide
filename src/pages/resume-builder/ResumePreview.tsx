import React from 'react'
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Award, ExternalLink } from 'lucide-react'

interface ResumePreviewProps {
  template: string
  resumeData?: any
  templateConfig?: any
  isMobile?: boolean
}

export default function ResumePreview({ template, resumeData, templateConfig, isMobile = false }: ResumePreviewProps) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className={`mx-auto ${isMobile ? 'px-4 py-4' : 'max-w-full md:max-w-5xl py-8 md:py-12 px-2 md:px-4'}`}>
        <div className={`bg-white text-black shadow-lg mx-auto text-sm ${isMobile ? 'p-4 rounded-lg' : 'p-8 max-w-2xl'}`} style={{ fontFamily: fonts.body }}>
      {/* Header */}
      <div className="border-b-2 pb-4 mb-6" style={{ borderColor: colors.primary }}>
            <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: fonts.heading }}>
          {getFullName()}
        </h1>
            <div className={`flex flex-col gap-2 ${isMobile ? '' : 'md:flex-row md:gap-4 md:gap-8'} w-full`}>
          {personal_info?.email && (
                <div className="flex items-center gap-1 w-full">
              <Mail className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.email}</span>
            </div>
          )}
          {personal_info?.phone && (
                <div className="flex items-center gap-1 w-full">
              <Phone className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.phone}</span>
            </div>
          )}
          {personal_info?.location && (
                <div className="flex items-center gap-1 w-full">
              <MapPin className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.location}</span>
            </div>
          )}
        </div>
            <div className={`flex flex-col gap-2 mt-2 ${isMobile ? '' : 'md:flex-row md:gap-4 md:mt-8'} w-full`}>
          {personal_info?.website && (
                <div className="flex items-center gap-1 w-full">
              <Globe className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.website}</span>
            </div>
          )}
          {personal_info?.linkedin && (
                <div className="flex items-center gap-1 w-full">
              <Linkedin className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.linkedin}</span>
            </div>
          )}
          {personal_info?.github && (
                <div className="flex items-center gap-1 w-full">
              <Github className="h-4 w-4" />
                  <span className={isMobile ? 'text-sm' : ''}>{personal_info.github}</span>
            </div>
          )}
        </div>
      </div>
          {/* Summary always at the top */}
      {summary && (
        <div className="mb-6">
              <h2 className={`font-semibold mb-2 ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Professional Summary
          </h2>
              <p className={`text-gray-700 leading-relaxed ${isMobile ? 'text-sm' : ''}`}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
              <h2 className={`font-semibold mb-3 ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Experience
          </h2>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
                  <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start mb-1`}>
                    <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : ''}`}>{exp.position}</h3>
                    <span className={`text-gray-600 ${isMobile ? 'text-xs mt-1' : 'text-sm'}`}>
                  {exp.startDate} - {exp.endDate || 'Present'}
                </span>
              </div>
                  <div className={`text-gray-700 mb-2 ${isMobile ? 'text-sm' : ''}`}>
                <span className="font-medium">{exp.company}</span>
                {exp.location && <span> • {exp.location}</span>}
              </div>
              {exp.description && (
                    <div className={`text-gray-700 whitespace-pre-line ${isMobile ? 'text-sm' : ''}`}>
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
              <h2 className={`font-semibold mb-3 ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Education
          </h2>
          {education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
                  <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start mb-1`}>
                    <h3 className={`font-semibold text-gray-900 ${isMobile ? 'text-base' : ''}`}>
                  {edu.degree} in {edu.field}
                </h3>
                    <span className={`text-gray-600 ${isMobile ? 'text-xs mt-1' : 'text-sm'}`}>
                  {edu.startDate} - {edu.endDate}
                </span>
              </div>
                  <div className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                <span className="font-medium">{edu.institution}</span>
                {edu.gpa && <span> • GPA: {edu.gpa}</span>}
              </div>
              {edu.description && (
                    <p className={`text-gray-700 mt-1 ${isMobile ? 'text-sm' : ''}`}>{edu.description}</p>
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
              <h2 className={`font-semibold mb-3 ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: colors.primary, fontFamily: fonts.heading }}>
            Skills
          </h2>
              <div className={`flex flex-wrap gap-2 ${isMobile ? 'gap-1' : ''}`}>
            {skills.map((skill: string, index: number) => (
              <span
                key={index}
                    className={`rounded-full ${isMobile ? 'px-2 py-1 text-xs' : 'px-3 py-1 text-sm'}`}
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
      </div>
    </div>
  )

  const renderClassicTemplate = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <div className={`mx-auto ${isMobile ? 'px-4 py-4' : 'max-w-full md:max-w-5xl py-8 md:py-12 px-2 md:px-4'}`}>
        <div className={`bg-white text-black shadow-lg mx-auto text-sm ${isMobile ? 'p-4 rounded-lg' : 'p-8 max-w-2xl'}`} style={{ fontFamily: fonts.body }}>
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-4 mb-6">
            <h1 className={`font-bold text-gray-900 mb-2 ${isMobile ? 'text-2xl' : 'text-3xl'}`} style={{ fontFamily: fonts.heading }}>
          {getFullName()}
        </h1>
            <div className={`text-gray-600 space-y-1 ${isMobile ? 'text-sm' : ''}`}>
          {personal_info?.email && <div>{personal_info.email}</div>}
          {personal_info?.phone && <div>{personal_info.phone}</div>}
          {personal_info?.location && <div>{personal_info.location}</div>}
              <div className={`flex justify-center gap-4 mt-2 ${isMobile ? 'flex-wrap gap-2' : ''}`}>
                {personal_info?.website && <span className={isMobile ? 'text-xs' : ''}>{personal_info.website}</span>}
                {personal_info?.linkedin && <span className={isMobile ? 'text-xs' : ''}>{personal_info.linkedin}</span>}
                {personal_info?.github && <span className={isMobile ? 'text-xs' : ''}>{personal_info.github}</span>}
          </div>
        </div>
      </div>
          {/* Summary always at the top */}
      {summary && (
        <div className="mb-6">
              <h2 className={`font-bold text-gray-900 mb-2 uppercase tracking-wide ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: fonts.heading }}>
            Professional Summary
          </h2>
              <p className={`text-gray-700 leading-relaxed ${isMobile ? 'text-sm' : ''}`}>{summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience?.length > 0 && (
        <div className="mb-6">
              <h2 className={`font-bold text-gray-900 mb-3 uppercase tracking-wide ${isMobile ? 'text-base' : 'text-lg'}`} style={{ fontFamily: fonts.heading }}>
            Experience
          </h2>
          {experience.map((exp: any, index: number) => (
            <div key={index} className="mb-4">
                  <div className={`flex ${isMobile ? 'flex-col' : 'justify-between'} items-start`}>
                <div>
                      <h3 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : ''}`}>{exp.position}</h3>
                      <div className={`text-gray-700 ${isMobile ? 'text-sm' : ''}`}>
                    {exp.company}{exp.location && `, ${exp.location}`}
                  </div>
                </div>
                    <div className={`text-gray-600 ${isMobile ? 'text-xs mt-1' : 'text-sm'}`}>
                  {exp.startDate} - {exp.endDate || 'Present'}
                </div>
              </div>
              {exp.description && (
                    <div className={`text-gray-700 whitespace-pre-line mt-2 ${isMobile ? 'text-sm' : ''}`}>
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
      </div>
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