import React, { useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'
import { generateGeminiText } from '@/lib/gemini'

export default function ExperienceStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  const [loadingStates, setLoadingStates] = useState<{ [key: number]: boolean }>({})
  const [errorStates, setErrorStates] = useState<{ [key: number]: string | null }>({})
  
  const { control, register, setValue } = useForm({
    defaultValues: {
      experience: currentResume?.experience || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'experience'
  })

  const watchedExperience = useWatch({ control, name: 'experience' })

  React.useEffect(() => {
    updateCurrentResume({ experience: watchedExperience })
  }, [watchedExperience, updateCurrentResume])

  const addExperience = () => {
    append({
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    })
  }

  const handleAISuggest = async (index: number) => {
    const currentDescription = watchedExperience?.[index]?.description || ''
    
    if (!currentDescription.trim()) {
      setErrorStates(prev => ({ ...prev, [index]: 'Please write a description first before using AI enhance.' }))
      return
    }

    setLoadingStates(prev => ({ ...prev, [index]: true }))
    setErrorStates(prev => ({ ...prev, [index]: null }))

    try {
      const experience = watchedExperience?.[index]
      const prompt = `Enhance this job description into 2-3 concise, professional bullet points for a resume:

Job Title: ${experience?.position || 'N/A'}
Company: ${experience?.company || 'N/A'}
Current Description: ${currentDescription}

Please create 2-3 bullet points that:
1. Use professional, action-oriented language
2. Include quantifiable achievements where possible (numbers, percentages, metrics)
3. Highlight key responsibilities and impact
4. Focus on the most important achievements and contributions
5. Keep each bullet point concise but impactful

Format as bullet points (•) and return only the enhanced description without any additional text.`

      const enhancedDescription = await generateGeminiText(prompt)
      setValue(`experience.${index}.description`, enhancedDescription)
    } catch (err: any) {
      setErrorStates(prev => ({ ...prev, [index]: err.message || 'Error enhancing description' }))
    } finally {
      setLoadingStates(prev => ({ ...prev, [index]: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Work Experience</h2>
        <Button onClick={addExperience}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No work experience added yet.</p>
            <Button onClick={addExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Job
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Experience {index + 1}</CardTitle>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAISuggest(index)}
                    disabled={loadingStates[index] || !watchedExperience?.[index]?.description?.trim()}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {loadingStates[index] ? 'Enhancing...' : 'AI Enhance'}
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
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      placeholder="Company Name"
                      {...register(`experience.${index}.company`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`position-${index}`}>Position</Label>
                    <Input
                      id={`position-${index}`}
                      placeholder="Job Title"
                      {...register(`experience.${index}.position`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      placeholder="City, State"
                      {...register(`experience.${index}.location`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="month"
                      {...register(`experience.${index}.startDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="month"
                      placeholder="Present"
                      {...register(`experience.${index}.endDate`)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="• Describe your key responsibilities and achievements&#10;• Use bullet points for better readability&#10;• Include quantifiable results when possible"
                    className="min-h-[120px]"
                    {...register(`experience.${index}.description`)}
                  />
                  {errorStates[index] && (
                    <p className="text-sm text-red-600">{errorStates[index]}</p>
                  )}
                  {watchedExperience?.[index]?.description?.trim() && (
                    <p className="text-sm text-blue-600">
                      💡 Write your description above, then click "AI Enhance" to improve it
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}