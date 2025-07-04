import React from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2, Sparkles } from 'lucide-react'

export default function ExperienceStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  
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
    // TODO: Implement AI suggestions for job descriptions
    const aiSuggestion = "• Led development of key features that increased user engagement by 25%\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Implemented best practices for code quality and testing, reducing bugs by 40%"
    
    setValue(`experience.${index}.description`, aiSuggestion)
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
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Suggest
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
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}