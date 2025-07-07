import React from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2 } from 'lucide-react'

export default function EducationStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  
  const { control, register } = useForm({
    defaultValues: {
      education: currentResume?.education || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'education'
  })

  const watchedEducation = useWatch({ control, name: 'education' })

  React.useEffect(() => {
    updateCurrentResume({ education: watchedEducation })
  }, [watchedEducation, updateCurrentResume])

  const addEducation = () => {
    append({
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: ''
    })
  }

  // Validation function to check if education step is complete
  const isEducationStepComplete = () => {
    if (!watchedEducation || watchedEducation.length === 0) {
      return false
    }

    // Check if at least one education entry has all required fields
    return watchedEducation.some(education => 
      education.institution && 
      education.institution.trim() !== '' &&
      education.degree && 
      education.degree.trim() !== '' &&
      education.field && 
      education.field.trim() !== ''
    )
  }

  // Expose validation function to parent component
  React.useEffect(() => {
    // @ts-ignore - Adding custom property to window for parent access
    window.isEducationStepComplete = isEducationStepComplete
  }, [watchedEducation])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Education</h2>
        <Button onClick={addEducation}>
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No education added yet.</p>
            <Button onClick={addEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your Education
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Education {index + 1}</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution *</Label>
                    <Input
                      id={`institution-${index}`}
                      placeholder="University Name"
                      {...register(`education.${index}.institution`)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>Degree *</Label>
                    <Input
                      id={`degree-${index}`}
                      placeholder="Bachelor's, Master's, etc."
                      {...register(`education.${index}.degree`)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`field-${index}`}>Field of Study *</Label>
                    <Input
                      id={`field-${index}`}
                      placeholder="Computer Science, Business, etc."
                      {...register(`education.${index}.field`)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`gpa-${index}`}>GPA (Optional)</Label>
                    <Input
                      id={`gpa-${index}`}
                      placeholder="3.8/4.0"
                      {...register(`education.${index}.gpa`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                    <Input
                      id={`startDate-${index}`}
                      type="month"
                      {...register(`education.${index}.startDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`endDate-${index}`}>End Date</Label>
                    <Input
                      id={`endDate-${index}`}
                      type="month"
                      {...register(`education.${index}.endDate`)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`description-${index}`}>Description (Optional)</Label>
                  <Textarea
                    id={`description-${index}`}
                    placeholder="Relevant coursework, achievements, honors, etc."
                    {...register(`education.${index}.description`)}
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