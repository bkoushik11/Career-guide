import React, { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { generateGeminiText } from '@/lib/gemini'

export default function ProjectsStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  const [aiLoading, setAiLoading] = useState<number | null>(null)
  const [aiError, setAiError] = useState<string | null>(null)
  
  const { control, register, setValue, getValues } = useForm({
    defaultValues: {
      projects: currentResume?.projects || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'projects'
  })

  const watchedProjects = useWatch({ control, name: 'projects' })

  React.useEffect(() => {
    updateCurrentResume({ projects: watchedProjects })
  }, [watchedProjects, updateCurrentResume])

  const addProject = () => {
    append({
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: [],
      url: '',
      github: ''
    })
  }

  const handleAISuggest = async (index: number) => {
    const project = getValues(`projects.${index}`)
    
    // Check if required fields are filled
    if (!project.name || !project.technologies || project.technologies.length === 0) {
      setAiError('Please provide a project name and at least one technology before using AI suggestions.')
      setTimeout(() => setAiError(null), 5000)
      return
    }

    setAiLoading(index)
    setAiError(null)

    try {
      const technologiesText = Array.isArray(project.technologies) 
        ? project.technologies.join(', ') 
        : project.technologies

      const prompt = `Create a professional project description for a resume based on the following information:

Project Name: ${project.name}
Technologies: ${technologiesText}
${project.url ? `Live URL: ${project.url}` : ''}
${project.github ? `GitHub: ${project.github}` : ''}

Please write a concise, professional description (2-3 sentences) that:
1. Explains what the project does
2. Highlights the key technologies and skills used
3. Mentions any notable features or achievements
4. Uses action verbs and quantifiable results when possible
5. Is written in past tense for completed projects

Keep it professional and suitable for a resume.`

      const aiSuggestion = await generateGeminiText(prompt)
    setValue(`projects.${index}.description`, aiSuggestion)
    } catch (error) {
      console.error('AI suggestion error:', error)
      setAiError('Failed to generate AI suggestion. Please try again.')
      setTimeout(() => setAiError(null), 5000)
    } finally {
      setAiLoading(null)
    }
  }

  const handleTechnologiesChange = (index: number, value: string) => {
    const technologies = value.split(',').map(tech => tech.trim()).filter(tech => tech)
    setValue(`projects.${index}.technologies`, technologies)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Projects</h2>
        <Button onClick={addProject}>
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Error Message */}
      {aiError && (
        <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-sm text-red-700 dark:text-red-300">{aiError}</p>
        </div>
      )}

      {fields.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No projects added yet.</p>
            <Button onClick={addProject}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAISuggest(index)}
                    disabled={aiLoading === index}
                  >
                    {aiLoading === index ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggest
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => remove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Project Name *</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="My Awesome Project"
                      {...register(`projects.${index}.name`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`technologies-${index}`}>Technologies *</Label>
                    <Input
                      id={`technologies-${index}`}
                      placeholder="React, Node.js, MongoDB"
                      onChange={(e) => handleTechnologiesChange(index, e.target.value)}
                      defaultValue={watchedProjects[index]?.technologies?.join(', ') || ''}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>Live URL (Optional)</Label>
                    <Input
                      id={`url-${index}`}
                      placeholder="https://myproject.com"
                      {...register(`projects.${index}.url`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`github-${index}`}>GitHub (Optional)</Label>
                    <Input
                      id={`github-${index}`}
                      placeholder="https://github.com/username/project"
                      {...register(`projects.${index}.github`)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="Describe what the project does, the technologies used, and your role in its development..."
                    className="min-h-[100px]"
                    {...register(`projects.${index}.description`)}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}