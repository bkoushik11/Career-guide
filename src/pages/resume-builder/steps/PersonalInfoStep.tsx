import React from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { PersonalInfo } from '@/lib/supabase-types'

const personalInfoSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
})

export default function PersonalInfoStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfo>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: currentResume?.personal_info,
  })

  const watchedValues = useWatch({ control })

  React.useEffect(() => {
    updateCurrentResume({ personal_info: watchedValues })
  }, [watchedValues, updateCurrentResume])

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Personal Information</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            placeholder="John"
            {...register('firstName')}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            placeholder="Doe"
            {...register('lastName')}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">{errors.lastName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            {...register('email')}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone *</Label>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            {...register('phone')}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            placeholder="New York, NY"
            {...register('location')}
          />
          {errors.location && (
            <p className="text-sm text-destructive">{errors.location.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="https://johndoe.com"
            {...register('website')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/johndoe"
            {...register('linkedin')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            placeholder="https://github.com/johndoe"
            {...register('github')}
          />
        </div>
      </div>
    </div>
  )
}