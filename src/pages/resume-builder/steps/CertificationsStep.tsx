import React from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, Trash2, Award } from 'lucide-react'

export default function CertificationsStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  
  const { control, register } = useForm({
    defaultValues: {
      certifications: currentResume?.certifications || []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications'
  })

  const watchedCertifications = useWatch({ control, name: 'certifications' })

  React.useEffect(() => {
    updateCurrentResume({ certifications: watchedCertifications })
  }, [watchedCertifications, updateCurrentResume])

  const addCertification = () => {
    append({
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: '',
      url: ''
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0 mb-2">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Award className="h-6 w-6" />
            Certifications
          </h2>
          <p className="text-muted-foreground mt-1">
            Add your professional certifications and licenses
          </p>
        </div>
        <Button onClick={addCertification} className="w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {fields.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No certifications added yet.</p>
            <Button onClick={addCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Certification {index + 1}</CardTitle>
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
                    <Label htmlFor={`name-${index}`}>Certification Name *</Label>
                    <Input
                      id={`name-${index}`}
                      placeholder="AWS Certified Solutions Architect"
                      {...register(`certifications.${index}.name`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`issuer-${index}`}>Issuing Organization *</Label>
                    <Input
                      id={`issuer-${index}`}
                      placeholder="Amazon Web Services"
                      {...register(`certifications.${index}.issuer`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`date-${index}`}>Issue Date *</Label>
                    <Input
                      id={`date-${index}`}
                      type="month"
                      {...register(`certifications.${index}.date`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`expiryDate-${index}`}>Expiry Date (Optional)</Label>
                    <Input
                      id={`expiryDate-${index}`}
                      type="month"
                      {...register(`certifications.${index}.expiryDate`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`credentialId-${index}`}>Credential ID (Optional)</Label>
                    <Input
                      id={`credentialId-${index}`}
                      placeholder="ABC123DEF456"
                      {...register(`certifications.${index}.credentialId`)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`url-${index}`}>Verification URL (Optional)</Label>
                    <Input
                      id={`url-${index}`}
                      placeholder="https://verify.example.com"
                      {...register(`certifications.${index}.url`)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}