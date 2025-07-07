import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { Sparkles } from 'lucide-react'
import { generateGeminiText } from '@/lib/gemini'

export default function SummaryStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSummaryChange = (value: string) => {
    updateCurrentResume({ summary: value })
  }

  const handleAISuggest = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Check if mandatory fields are available
      const hasEducation = currentResume?.education && currentResume.education.length > 0
      const hasExperience = currentResume?.experience && currentResume.experience.length > 0
      const hasSkills = currentResume?.skills && currentResume.skills.length > 0
      
      if (!hasSkills) {
        setError('Skills are required to generate a summary. Please complete the Skills step first.')
        setLoading(false)
        return
      }
      
      if (!hasEducation && !hasExperience) {
        setError('Either Education or Experience details are required to generate a summary. Please complete at least one of these steps first.')
        setLoading(false)
        return
      }

      // Process Education details
      const educationText = currentResume?.education?.map((edu: any) => 
        `${edu.degree} in ${edu.field} from ${edu.institution} (${edu.startDate} - ${edu.endDate})${edu.gpa ? ` with GPA ${edu.gpa}` : ''}${edu.description ? `: ${edu.description}` : ''}`
      ).join('. ') || ''

      // Process Experience details
      const experienceText = currentResume?.experience?.map((exp: any) => 
        `${exp.position} at ${exp.company} (${exp.startDate} - ${exp.endDate || 'Present'})${exp.location ? ` in ${exp.location}` : ''}: ${exp.description || ''}`
      ).join('. ') || ''

      // Process Project details
      const projectsText = currentResume?.projects?.map((project: any) => 
        `${project.name}${project.technologies && project.technologies.length > 0 ? ` using ${project.technologies.join(', ')}` : ''}: ${project.description || ''}`
      ).join('. ') || ''

      // Process Certification details
      const certificationsText = currentResume?.certifications?.map((cert: any) => 
        `${cert.name} from ${cert.issuer} (${cert.date})${cert.expiryDate ? `, expires ${cert.expiryDate}` : ''}${cert.credentialId ? `, ID: ${cert.credentialId}` : ''}`
      ).join('. ') || ''

      // Process Skills
      const skillsText = currentResume?.skills?.join(', ') || ''

      // Create comprehensive prompt
      const prompt = `Write a professional summary for a resume based on the following comprehensive information. Keep it concise (2-3 sentences) and focus on key achievements, qualifications, and career objectives:

${hasEducation ? `Education: ${educationText}` : ''}
${hasExperience ? `Experience: ${experienceText}` : ''}
${projectsText ? `Projects: ${projectsText}` : ''}
${certificationsText ? `Certifications: ${certificationsText}` : ''}
Skills: ${skillsText}

Please write a compelling professional summary that:
1. Highlights the most relevant qualifications and achievements
2. Emphasizes key skills and expertise
3. Shows career progression and impact
4. Is tailored to the provided background information
5. Uses professional language suitable for a resume`

      const suggestion = await generateGeminiText(prompt)
      updateCurrentResume({ summary: suggestion })
    } catch (err: any) {
      setError(err.message || 'Error generating suggestion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <Button variant="outline" onClick={handleAISuggest} disabled={loading}>
          <Sparkles className="h-4 w-4 mr-2" />
          {loading ? 'Generating...' : 'AI Suggest'}
        </Button>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="Write a compelling summary that highlights your key achievements, skills, and career objectives..."
          className="min-h-[150px]"
          value={currentResume?.summary || ''}
          onChange={(e) => handleSummaryChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Tip: Keep it concise (2-3 sentences) and focus on your most relevant qualifications.
        </p>
      </div>
    </div>
  )
}