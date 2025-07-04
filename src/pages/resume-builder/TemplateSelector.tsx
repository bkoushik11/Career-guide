import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Eye, Check, Crown, Palette, ArrowLeft } from 'lucide-react'
import { useResumeStore } from '@/store/resumeStore'
import ResumePreview from './ResumePreview'

interface TemplateSelectorProps {
  onTemplateSelect: (templateId: string) => void
  onBack: () => void
  currentTemplateId?: string
}

export default function TemplateSelector({ onTemplateSelect, onBack, currentTemplateId }: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const { templates, currentResume } = useResumeStore()

  const categories = ['All', ...new Set(templates.map(t => t.category))]

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleTemplateSelect = (templateId: string) => {
    onTemplateSelect(templateId)
  }

  const mockResumeData = currentResume || {
    personal_info: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      website: 'johndoe.com',
      linkedin: 'linkedin.com/in/johndoe',
      github: 'github.com/johndoe'
    },
    summary: 'Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies.',
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        location: 'New York, NY',
        startDate: '2021-01',
        endDate: '',
        current: true,
        description: '• Led development of key features that increased user engagement by 25%\n• Collaborated with cross-functional teams to deliver projects on time'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    projects: [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Built a full-stack e-commerce platform using React and Node.js',
        technologies: ['React', 'Node.js', 'MongoDB'],
        url: 'https://example.com',
        github: 'https://github.com/johndoe/ecommerce'
      }
    ],
    certifications: []
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Builder
          </Button>
          <div>
            <h2 className="text-2xl font-semibold">Choose Your Template</h2>
            <p className="text-muted-foreground">
              Select a professional template that matches your style and industry
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category)}
            size="sm"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card 
            key={template.id} 
            className={`group hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden cursor-pointer ${
              currentTemplateId === template.id ? 'ring-2 ring-primary' : ''
            }`}
          >
            <div className="relative">
              <img
                src={template.preview_image || 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'}
                alt={template.name}
                className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewTemplate(template)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{template.name} Preview</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <ResumePreview 
                        template={template.id as any} 
                        resumeData={mockResumeData}
                        templateConfig={template.config}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTemplateSelect(template.id)
                  }}
                >
                  <Palette className="h-4 w-4 mr-2" />
                  Use Template
                </Button>
              </div>
              
              {template.is_premium && (
                <div className="absolute top-3 right-3">
                  <Badge className="bg-amber-500 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              )}

              {currentTemplateId === template.id && (
                <div className="absolute top-3 left-3">
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </div>
            
            <CardHeader onClick={() => handleTemplateSelect(template.id)}>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge variant="outline" className="mt-1">
                    {template.category}
                  </Badge>
                </div>
              </div>
              <CardDescription className="mt-2">
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent onClick={() => handleTemplateSelect(template.id)}>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  <Badge variant="secondary" className="text-xs">
                    ATS-Friendly
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Professional
                  </Badge>
                  {template.is_premium && (
                    <Badge variant="secondary" className="text-xs">
                      Premium Design
                    </Badge>
                  )}
                </div>
                
                <Button 
                  className="w-full"
                  variant={currentTemplateId === template.id ? 'default' : 'outline'}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleTemplateSelect(template.id)
                  }}
                >
                  {currentTemplateId === template.id ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Selected
                    </>
                  ) : (
                    'Select Template'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No templates found
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try selecting a different category to see more templates.
          </p>
          <Button onClick={() => setSelectedCategory('All')}>
            View All Templates
          </Button>
        </div>
      )}
    </div>
  )
}