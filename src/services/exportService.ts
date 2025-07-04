import jsPDF from 'jspdf'

export interface ExportOptions {
  format: 'pdf' | 'docx' | 'txt' | 'html';
  template: string;
  data: any;
}

export class ExportService {
  static async exportToPDF(resumeData: any, templateId: string): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    // Set up fonts and styling based on template
    const templateConfig = this.getTemplateConfig(templateId)
    pdf.setFont('helvetica', 'normal')
    pdf.setFontSize(12)

    let yPosition = 20
    const lineHeight = 6
    const margin = 20
    const pageWidth = 210 // A4 width in mm
    const contentWidth = pageWidth - (margin * 2)

    // Helper function to get full name
    const getFullName = () => {
      if (resumeData.personal_info?.firstName && resumeData.personal_info?.lastName) {
        return `${resumeData.personal_info.firstName} ${resumeData.personal_info.lastName}`
      }
      return resumeData.personal_info?.fullName || 'Your Name'
    }

    // Helper function to add text with word wrapping and template styling
    const addText = (text: string, fontSize: number = 12, fontStyle: string = 'normal', color: string = '#000000') => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      
      // Set color based on template
      if (color !== '#000000') {
        const rgb = this.hexToRgb(color)
        pdf.setTextColor(rgb.r, rgb.g, rgb.b)
      } else {
        pdf.setTextColor(0, 0, 0)
      }
      
      const lines = pdf.splitTextToSize(text, contentWidth)
      lines.forEach((line: string) => {
        if (yPosition > 280) { // Check if we need a new page
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(line, margin, yPosition)
        yPosition += lineHeight
      })
      yPosition += 2 // Extra spacing after sections
    }

    // Add section divider for modern templates
    const addSectionDivider = () => {
      if (templateConfig.style === 'modern') {
        const rgb = this.hexToRgb(templateConfig.primaryColor)
        pdf.setDrawColor(rgb.r, rgb.g, rgb.b)
        pdf.setLineWidth(0.5)
        pdf.line(margin, yPosition, pageWidth - margin, yPosition)
        yPosition += 4
      }
    }

    // Header - Personal Information with template styling
    if (resumeData.personal_info) {
      if (templateConfig.style === 'modern') {
        // Modern template with colored header
        addText(getFullName(), 20, 'bold', templateConfig.primaryColor)
      } else {
        // Classic template with centered header
        const name = getFullName()
        const nameWidth = pdf.getTextWidth(name)
        pdf.setFontSize(20)
        pdf.setFont('helvetica', 'bold')
        pdf.text(name, (pageWidth - nameWidth) / 2, yPosition)
        yPosition += 8
      }
      
      const contactInfo = [
        resumeData.personal_info.email,
        resumeData.personal_info.phone,
        resumeData.personal_info.location
      ].filter(Boolean).join(' | ')
      
      if (contactInfo) {
        if (templateConfig.style === 'classic') {
          const contactWidth = pdf.getTextWidth(contactInfo)
          pdf.setFontSize(10)
          pdf.setFont('helvetica', 'normal')
          pdf.text(contactInfo, (pageWidth - contactWidth) / 2, yPosition)
          yPosition += 6
        } else {
          addText(contactInfo, 10)
        }
      }

      const links = [
        resumeData.personal_info.website,
        resumeData.personal_info.linkedin,
        resumeData.personal_info.github
      ].filter(Boolean).join(' | ')
      
      if (links) {
        if (templateConfig.style === 'classic') {
          const linksWidth = pdf.getTextWidth(links)
          pdf.setFontSize(10)
          pdf.text(links, (pageWidth - linksWidth) / 2, yPosition)
          yPosition += 8
        } else {
          addText(links, 10)
        }
      }
      
      addSectionDivider()
    }

    // Professional Summary
    if (resumeData.summary) {
      addText('PROFESSIONAL SUMMARY', 14, 'bold', templateConfig.primaryColor)
      addText(resumeData.summary)
      yPosition += 3
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      addText('EXPERIENCE', 14, 'bold', templateConfig.primaryColor)
      
      resumeData.experience.forEach((exp: any) => {
        addText(`${exp.position} | ${exp.company}`, 12, 'bold')
        addText(`${exp.location} | ${exp.startDate} - ${exp.endDate || 'Present'}`, 10, 'normal', templateConfig.secondaryColor)
        if (exp.description) {
          addText(exp.description)
        }
        yPosition += 2
      })
      yPosition += 3
    }

    // Education
    if (resumeData.education?.length > 0) {
      addText('EDUCATION', 14, 'bold', templateConfig.primaryColor)
      
      resumeData.education.forEach((edu: any) => {
        addText(`${edu.degree} in ${edu.field}`, 12, 'bold')
        addText(`${edu.institution} | ${edu.startDate} - ${edu.endDate}`, 10, 'normal', templateConfig.secondaryColor)
        if (edu.gpa) {
          addText(`GPA: ${edu.gpa}`, 10)
        }
        if (edu.description) {
          addText(edu.description)
        }
        yPosition += 2
      })
      yPosition += 3
    }

    // Skills with template-specific formatting
    if (resumeData.skills?.length > 0) {
      addText('SKILLS', 14, 'bold', templateConfig.primaryColor)
      
      if (templateConfig.style === 'modern') {
        // Modern template: skills as tags
        const skillsText = resumeData.skills.join(' • ')
        addText(skillsText)
      } else {
        // Classic template: skills as comma-separated list
        addText(resumeData.skills.join(', '))
      }
      yPosition += 3
    }

    // Projects
    if (resumeData.projects?.length > 0) {
      addText('PROJECTS', 14, 'bold', templateConfig.primaryColor)
      
      resumeData.projects.forEach((project: any) => {
        addText(project.name, 12, 'bold')
        if (project.technologies?.length > 0) {
          addText(`Technologies: ${project.technologies.join(', ')}`, 10, 'normal', templateConfig.secondaryColor)
        }
        if (project.description) {
          addText(project.description)
        }
        if (project.url || project.github) {
          const links = [project.url, project.github].filter(Boolean).join(' | ')
          addText(links, 10, 'normal', templateConfig.primaryColor)
        }
        yPosition += 2
      })
      yPosition += 3
    }

    // Certifications
    if (resumeData.certifications?.length > 0) {
      addText('CERTIFICATIONS', 14, 'bold', templateConfig.primaryColor)
      
      resumeData.certifications.forEach((cert: any) => {
        addText(`${cert.name} | ${cert.issuer}`, 12, 'bold')
        addText(`Issued: ${cert.date}${cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : ''}`, 10, 'normal', templateConfig.secondaryColor)
        if (cert.credentialId) {
          addText(`Credential ID: ${cert.credentialId}`, 10)
        }
        yPosition += 2
      })
    }

    return pdf.output('blob')
  }

  private static getTemplateConfig(templateId: string) {
    const configs: Record<string, any> = {
      'modern-professional': {
        style: 'modern',
        primaryColor: '#3B82F6',
        secondaryColor: '#64748B'
      },
      'classic-executive': {
        style: 'classic',
        primaryColor: '#1F2937',
        secondaryColor: '#6B7280'
      },
      'creative-designer': {
        style: 'modern',
        primaryColor: '#8B5CF6',
        secondaryColor: '#A78BFA'
      },
      'minimalist-clean': {
        style: 'minimal',
        primaryColor: '#000000',
        secondaryColor: '#666666'
      },
      'tech-developer': {
        style: 'modern',
        primaryColor: '#10B981',
        secondaryColor: '#059669'
      },
      'academic-researcher': {
        style: 'classic',
        primaryColor: '#DC2626',
        secondaryColor: '#B91C1C'
      }
    }

    return configs[templateId] || configs['modern-professional']
  }

  private static hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  }

  static async exportToWord(resumeData: any): Promise<Blob> {
    // Create a simple HTML structure that can be opened in Word
    const html = this.generateHTML(resumeData)
    
    const blob = new Blob([html], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    })
    
    return blob
  }

  static async exportToText(resumeData: any): Promise<Blob> {
    let text = ''
    
    // Helper function to get full name
    const getFullName = () => {
      if (resumeData.personal_info?.firstName && resumeData.personal_info?.lastName) {
        return `${resumeData.personal_info.firstName} ${resumeData.personal_info.lastName}`
      }
      return resumeData.personal_info?.fullName || 'Your Name'
    }
    
    // Personal Information
    if (resumeData.personal_info) {
      text += `${getFullName()}\n`
      text += `${resumeData.personal_info.email} | ${resumeData.personal_info.phone} | ${resumeData.personal_info.location}\n`
      if (resumeData.personal_info.website || resumeData.personal_info.linkedin || resumeData.personal_info.github) {
        const links = [
          resumeData.personal_info.website,
          resumeData.personal_info.linkedin,
          resumeData.personal_info.github
        ].filter(Boolean).join(' | ')
        text += `${links}\n`
      }
      text += '\n'
    }

    // Summary
    if (resumeData.summary) {
      text += 'PROFESSIONAL SUMMARY\n'
      text += `${resumeData.summary}\n\n`
    }

    // Experience
    if (resumeData.experience?.length > 0) {
      text += 'EXPERIENCE\n'
      resumeData.experience.forEach((exp: any) => {
        text += `${exp.position} | ${exp.company}\n`
        text += `${exp.location} | ${exp.startDate} - ${exp.endDate || 'Present'}\n`
        if (exp.description) {
          text += `${exp.description}\n`
        }
        text += '\n'
      })
    }

    // Education
    if (resumeData.education?.length > 0) {
      text += 'EDUCATION\n'
      resumeData.education.forEach((edu: any) => {
        text += `${edu.degree} in ${edu.field}\n`
        text += `${edu.institution} | ${edu.startDate} - ${edu.endDate}\n`
        if (edu.gpa) text += `GPA: ${edu.gpa}\n`
        if (edu.description) text += `${edu.description}\n`
        text += '\n'
      })
    }

    // Skills
    if (resumeData.skills?.length > 0) {
      text += 'SKILLS\n'
      text += `${resumeData.skills.join(', ')}\n\n`
    }

    // Projects
    if (resumeData.projects?.length > 0) {
      text += 'PROJECTS\n'
      resumeData.projects.forEach((project: any) => {
        text += `${project.name}\n`
        if (project.technologies?.length > 0) {
          text += `Technologies: ${project.technologies.join(', ')}\n`
        }
        if (project.description) text += `${project.description}\n`
        if (project.url || project.github) {
          const links = [project.url, project.github].filter(Boolean).join(' | ')
          text += `${links}\n`
        }
        text += '\n'
      })
    }

    // Certifications
    if (resumeData.certifications?.length > 0) {
      text += 'CERTIFICATIONS\n'
      resumeData.certifications.forEach((cert: any) => {
        text += `${cert.name} | ${cert.issuer}\n`
        text += `Issued: ${cert.date}${cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : ''}\n`
        if (cert.credentialId) text += `Credential ID: ${cert.credentialId}\n`
        text += '\n'
      })
    }

    return new Blob([text], { type: 'text/plain' })
  }

  static generateHTML(resumeData: any): string {
    // Helper function to get full name
    const getFullName = () => {
      if (resumeData.personal_info?.firstName && resumeData.personal_info?.lastName) {
        return `${resumeData.personal_info.firstName} ${resumeData.personal_info.lastName}`
      }
      return resumeData.personal_info?.fullName || 'Your Name'
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${getFullName()}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
        .name { font-size: 28px; font-weight: bold; margin-bottom: 10px; color: #1F2937; }
        .contact { font-size: 14px; color: #666; margin: 5px 0; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 18px; font-weight: bold; color: #3B82F6; border-bottom: 1px solid #E5E7EB; margin-bottom: 15px; padding-bottom: 5px; }
        .job-title { font-weight: bold; color: #1F2937; margin-bottom: 5px; }
        .job-details { color: #666; font-size: 14px; margin-bottom: 10px; }
        .description { margin-bottom: 15px; line-height: 1.6; }
        .skills { display: flex; flex-wrap: wrap; gap: 10px; }
        .skill { background: #F3F4F6; padding: 5px 12px; border-radius: 20px; font-size: 14px; color: #374151; }
        .projects .project { margin-bottom: 20px; }
        .project-name { font-weight: bold; color: #1F2937; margin-bottom: 5px; }
        .technologies { color: #666; font-size: 14px; margin-bottom: 8px; }
        .links { color: #3B82F6; font-size: 14px; }
        .certification { margin-bottom: 15px; }
        .cert-name { font-weight: bold; color: #1F2937; }
        .cert-details { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="name">${getFullName()}</div>
        <div class="contact">
            ${resumeData.personal_info?.email || ''} | 
            ${resumeData.personal_info?.phone || ''} | 
            ${resumeData.personal_info?.location || ''}
        </div>
        ${resumeData.personal_info?.website || resumeData.personal_info?.linkedin || resumeData.personal_info?.github ? 
          `<div class="contact">
            ${[resumeData.personal_info?.website, resumeData.personal_info?.linkedin, resumeData.personal_info?.github].filter(Boolean).join(' | ')}
          </div>` : ''
        }
    </div>

    ${resumeData.summary ? `
    <div class="section">
        <div class="section-title">Professional Summary</div>
        <div class="description">${resumeData.summary}</div>
    </div>
    ` : ''}

    ${resumeData.experience?.length > 0 ? `
    <div class="section">
        <div class="section-title">Experience</div>
        ${resumeData.experience.map((exp: any) => `
        <div style="margin-bottom: 20px;">
            <div class="job-title">${exp.position} | ${exp.company}</div>
            <div class="job-details">${exp.location} | ${exp.startDate} - ${exp.endDate || 'Present'}</div>
            ${exp.description ? `<div class="description">${exp.description.replace(/\n/g, '<br>')}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resumeData.education?.length > 0 ? `
    <div class="section">
        <div class="section-title">Education</div>
        ${resumeData.education.map((edu: any) => `
        <div style="margin-bottom: 15px;">
            <div class="job-title">${edu.degree} in ${edu.field}</div>
            <div class="job-details">${edu.institution} | ${edu.startDate} - ${edu.endDate}</div>
            ${edu.gpa ? `<div class="job-details">GPA: ${edu.gpa}</div>` : ''}
            ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resumeData.skills?.length > 0 ? `
    <div class="section">
        <div class="section-title">Skills</div>
        <div class="skills">
            ${resumeData.skills.map((skill: string) => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${resumeData.projects?.length > 0 ? `
    <div class="section projects">
        <div class="section-title">Projects</div>
        ${resumeData.projects.map((project: any) => `
        <div class="project">
            <div class="project-name">${project.name}</div>
            ${project.technologies?.length > 0 ? `<div class="technologies">Technologies: ${project.technologies.join(', ')}</div>` : ''}
            ${project.description ? `<div class="description">${project.description}</div>` : ''}
            ${project.url || project.github ? `<div class="links">${[project.url, project.github].filter(Boolean).join(' | ')}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resumeData.certifications?.length > 0 ? `
    <div class="section">
        <div class="section-title">Certifications</div>
        ${resumeData.certifications.map((cert: any) => `
        <div class="certification">
            <div class="cert-name">${cert.name} | ${cert.issuer}</div>
            <div class="cert-details">Issued: ${cert.date}${cert.expiryDate ? ` | Expires: ${cert.expiryDate}` : ''}</div>
            ${cert.credentialId ? `<div class="cert-details">Credential ID: ${cert.credentialId}</div>` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>
    `
  }

  static async downloadFile(blob: Blob, filename: string): Promise<void> {
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}