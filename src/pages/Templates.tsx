import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Eye, Star, Download, Crown, Palette } from 'lucide-react'
import { useResumeStore, createNewResume } from '@/store/resumeStore'
import { useAuthStore } from '@/store/authStore'
import ResumePreview from './resume-builder/ResumePreview'
import BackButton from '@/components/ui/BackButton'

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const { templates, loadTemplates, setCurrentResume } = useResumeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    loadTemplates()
  }, [loadTemplates])

  const categories = ['All', ...new Set(templates.map(t => t.category))]

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(template => template.category === selectedCategory)

  const handleUseTemplate = (templateId: string) => {
    if (!user) {
      navigate('/auth/signin')
      return
    }

    const newResume = createNewResume(user.id, templateId)
    setCurrentResume(newResume)
    navigate('/resume-builder')
  }

  const handlePreview = (template: any) => {
    setPreviewTemplate(template)
  }

  const mockResumeData = {
    personal_info: {
      fullName: 'John Doe',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <BackButton />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Resume Template
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Select from our collection of professionally designed templates, 
            each optimized for different industries and career levels.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(category)}
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 overflow-hidden">
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
                        onClick={() => handlePreview(template)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{template.name} Preview</DialogTitle>
                        <DialogDescription>Preview of the selected resume template.</DialogDescription>
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
                    onClick={() => handleUseTemplate(template.id)}
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
              </div>
              
              <CardHeader>
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
              
              <CardContent>
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
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUseTemplate(template.id)}
                      disabled={template.is_premium && !user} // Disable premium templates for non-users
                    >
                      {template.is_premium && !user ? 'Sign In Required' : 'Use This Template'}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
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

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-none">
            <CardContent className="py-8">
              <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                Choose a template and start building your professional resume with our AI-powered tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to={user ? "/dashboard" : "/auth/signup"}>
                    {user ? "Go to Dashboard" : "Start Building Now"}
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">
                    Learn More
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}