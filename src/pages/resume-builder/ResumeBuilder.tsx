import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Save, Download, Eye, Check, FileText, Palette, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useResumeStore } from '@/store/resumeStore'
import { useAuthStore } from '@/store/authStore'
import { ExportService } from '@/services/exportService'
import AIChat from '@/components/ui/AIChat'
import PersonalInfoStep from './steps/PersonalInfoStep'
import SummaryStep from './steps/SummaryStep'
import ExperienceStep from './steps/ExperienceStep'
import EducationStep from './steps/EducationStep'
import ProjectsStep from './steps/ProjectsStep'
import SkillsStep from './steps/SkillsStep'
import CertificationsStep from './steps/CertificationsStep'
import ResumePreview from './ResumePreview'
import TemplateSelector from './TemplateSelector'
import BackButton from '@/components/ui/BackButton'
import { useMediaQuery } from 'react-responsive'

const steps = [
  { id: 'personal', title: 'Personal Info', component: PersonalInfoStep },
  { id: 'experience', title: 'Experience', component: ExperienceStep },
  { id: 'education', title: 'Education', component: EducationStep },
  { id: 'projects', title: 'Projects', component: ProjectsStep },
  { id: 'skills', title: 'Skills', component: SkillsStep },
  { id: 'certifications', title: 'Certifications', component: CertificationsStep },
  { id: 'summary', title: 'Summary', component: SummaryStep },
]

export default function ResumeBuilder() {
  const [currentStep, setCurrentStep] = useState(0)
  const [showPreview, setShowPreview] = useState(false)
  const [showTemplateSelector, setShowTemplateSelector] = useState(false)
  const [saving, setSaving] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [completionScore, setCompletionScore] = useState(0)
  const [exportError, setExportError] = useState<string | null>(null)
  const { currentResume, saveResume, templates, autoSaving, updateCurrentResume, incrementDownloadCount } = useResumeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isMobile = useMediaQuery({ maxWidth: 767 })

  useEffect(() => {
    if (!currentResume || !user) {
      navigate('/dashboard')
    }
  }, [currentResume, user, navigate])

  // Calculate completion score
  useEffect(() => {
    if (!currentResume) return

    let score = 0
    const maxScore = 100

    // Personal info (20 points)
    if (currentResume.personal_info?.firstName && currentResume.personal_info?.lastName && 
        currentResume.personal_info?.email && currentResume.personal_info?.phone) {
      score += 20
    }

    // Summary (15 points)
    if (currentResume.summary && currentResume.summary.length > 50) {
      score += 15
    }

    // Experience (25 points)
    if (currentResume.experience && currentResume.experience.length > 0) {
      score += 25
    }

    // Education (15 points)
    if (currentResume.education && currentResume.education.length > 0) {
      score += 15
    }

    // Skills (15 points)
    if (currentResume.skills && currentResume.skills.length >= 3) {
      score += 15
    }

    // Projects or Certifications (10 points)
    if ((currentResume.projects && currentResume.projects.length > 0) || 
        (currentResume.certifications && currentResume.certifications.length > 0)) {
      score += 10
    }

    setCompletionScore(score)
  }, [currentResume])

  if (!currentResume || !user) {
    return null
  }

  const progress = ((currentStep + 1) / steps.length) * 100
  const CurrentStepComponent = steps[currentStep].component
  const isLastStep = currentStep === steps.length - 1
  const currentTemplate = templates.find(t => t.id === currentResume.template_id)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const savedResume = await saveResume(currentResume)
      console.log('Resume saved successfully:', savedResume.id)
    } catch (error) {
      console.error('Error saving resume:', error)
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = async () => {
    await handleSave()
    navigate('/dashboard')
  }

  const isPersonalInfoComplete = () => {
    const info = currentResume.personal_info || {};
    return (
      !!info.firstName &&
      !!info.lastName &&
      !!info.email &&
      !!info.phone
    );
  };

  const isEducationComplete = () => {
    // Access validation function from EducationStep
    if (currentStep === 2 && (window as any).isEducationStepComplete) { // Education step is index 2
      return (window as any).isEducationStepComplete();
    }
    return currentResume.education && currentResume.education.length > 0;
  };

  const isSkillsComplete = () => {
    return currentResume.skills && currentResume.skills.length >= 1;
  };

  const isSummaryComplete = () => {
    return currentResume.summary && currentResume.summary.length > 0;
  };

  const canExport = isPersonalInfoComplete() && isEducationComplete() && isSkillsComplete() && isSummaryComplete();

  const handleExport = async (format: 'pdf' | 'docx' | 'txt' | 'html') => {
    setExportError(null);
    if (!isPersonalInfoComplete()) {
      setExportError('Please fill in all required Personal Info fields before exporting.');
      return;
    }
    setExporting(true);
    try {
      let blob: Blob;
      let filename: string;

      if (format === 'pdf') {
        // Use jsPDF method directly - more reliable than html2pdf
        blob = await ExportService.exportToPDF(currentResume, currentResume.template_id);
        filename = `${currentResume.title || 'resume'}.pdf`;
        await ExportService.downloadFile(blob, filename);
        setExporting(false);
        return;
      }

      switch (format) {
        case 'docx':
          blob = await ExportService.exportToWord(currentResume);
          filename = `${currentResume.title || 'resume'}.docx`;
          break;
        case 'txt':
          blob = await ExportService.exportToText(currentResume);
          filename = `${currentResume.title || 'resume'}.txt`;
          break;
        case 'html':
          const html = ExportService.generateHTML(currentResume);
          blob = new Blob([html], { type: 'text/html' });
          filename = `${currentResume.title || 'resume'}.html`;
          break;
        default:
          throw new Error('Unsupported format');
      }

      await ExportService.downloadFile(blob, filename);
      if (currentResume.id) {
        await incrementDownloadCount(currentResume.id);
      }
    } catch (error) {
      setExportError('Export failed. Please try again.');
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    updateCurrentResume({ template_id: templateId })
    setShowTemplateSelector(false)
  }

  if (showTemplateSelector) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="hidden md:block"><BackButton /></div>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <TemplateSelector
            onTemplateSelect={handleTemplateSelect}
            onBack={() => setShowTemplateSelector(false)}
            currentTemplateId={currentResume.template_id}
          />
        </div>
      </div>
    )
  }

  // Show full-screen preview when showPreview is true
  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pt-16 md:pt-20">
        <div className="max-w-full mx-auto py-4 px-2">
          {/* Preview Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(false)}
                className="hidden md:flex"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Editor
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Resume Preview
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {currentTemplate?.name || 'Unknown Template'}
              </Badge>
              <Button variant="outline" onClick={handleSave} disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button disabled={exporting || !canExport} title={!canExport ? 'Complete Personal Info, Education, Skills, and Summary to export.' : undefined}>
                    <Download className="h-4 w-4 mr-2" />
                    {exporting ? 'Exporting...' : 'Export'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Export Resume</DialogTitle>
                    <DialogDescription>Choose a format to export your resume.</DialogDescription>
                  </DialogHeader>
                  {!canExport ? (
                    <div className="text-red-600 text-sm mb-4">Please complete Personal Info, Education, Skills, and Summary before exporting your resume.</div>
                  ) : null}
                  <div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('pdf')}
                        disabled={exporting || !canExport}
                        className="h-20 flex flex-col"
                      >
                        <FileText className="h-6 w-6 mb-2" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('docx')}
                        disabled={exporting || !canExport}
                        className="h-20 flex flex-col"
                      >
                        <FileText className="h-6 w-6 mb-2" />
                        Word
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('html')}
                        disabled={exporting || !canExport}
                        className="h-20 flex flex-col"
                      >
                        <FileText className="h-6 w-6 mb-2" />
                        HTML
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleExport('txt')}
                        disabled={exporting || !canExport}
                        className="h-20 flex flex-col"
                      >
                        <FileText className="h-6 w-6 mb-2" />
                        Text
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Preview Content */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
            {exportError && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded border border-red-300">
                {exportError}
              </div>
            )}
            <div className="border rounded-lg overflow-hidden max-h-[800px] overflow-y-auto">
              <ResumePreview 
                template={currentResume.template_id as any}
                resumeData={currentResume}
                templateConfig={currentTemplate?.config}
                isMobile={isMobile}
              />
            </div>
          </div>
          
          {/* Mobile Back Button */}
          <div className="md:hidden mt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowPreview(false)}
              className="w-full"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Editor
            </Button>
          </div>
        </div>
        
        {/* AIChat with Chatbase hidden in preview mode */}
        <AIChat hideChatbase={true} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pt-16 md:pt-20">
      <div className="hidden md:block"><BackButton /></div>
      <div className="max-w-full md:max-w-5xl mx-auto py-8 md:py-12 px-2 md:px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Resume Builder
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-gray-600 dark:text-gray-300">
                Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
              </p>
              {autoSaving && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Auto-saving...
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {completionScore}% Complete
                </span>
              </div>
            </div>
          </div>
          {/* Action Buttons: Desktop in header, mobile below form */}
          <div className="hidden md:flex space-x-2">
            <Button variant="outline" onClick={() => setShowTemplateSelector(true)}>
              <Palette className="h-4 w-4 mr-2" />
              Templates ({templates.length})
            </Button>
            <Button variant="outline" onClick={() => setShowPreview(true)}>
              <Eye className="h-4 w-4 mr-2" />
              Show Preview
            </Button>
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button disabled={exporting || !canExport} title={!canExport ? 'Complete Personal Info, Education, Skills, and Summary to export.' : undefined}>
                  <Download className="h-4 w-4 mr-2" />
                  {exporting ? 'Exporting...' : 'Export'}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Resume</DialogTitle>
                  <DialogDescription>Choose a format to export your resume.</DialogDescription>
                </DialogHeader>
                {!canExport ? (
                  <div className="text-red-600 text-sm mb-4">Please complete Personal Info, Education, Skills, and Summary before exporting your resume.</div>
                ) : null}
                <div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('pdf')}
                      disabled={exporting || !canExport}
                      className="h-20 flex flex-col"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('docx')}
                      disabled={exporting || !canExport}
                      className="h-20 flex flex-col"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Word
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('html')}
                      disabled={exporting || !canExport}
                      className="h-20 flex flex-col"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      HTML
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleExport('txt')}
                      disabled={exporting || !canExport}
                      className="h-20 flex flex-col"
                    >
                      <FileText className="h-6 w-6 mb-2" />
                      Text
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Progress Bar (desktop only) */}
        <div className="mb-8 hidden md:block">
          <div className="flex justify-between items-center mb-2">
            <Progress value={progress} className="h-2 flex-1 mr-4" />
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {completionScore}% Complete
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
            {steps.map((step, index) => (
              <span
                key={step.id}
                className={`cursor-pointer transition-colors ${
                  index <= currentStep ? 'text-primary font-medium' : ''
                }`}
                onClick={() => setCurrentStep(index)}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Template Info */}
        {currentTemplate && (
          <div className="mb-6">
            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <Palette className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-900 dark:text-blue-100">
                Using template: <strong>{currentTemplate.name}</strong> ({currentTemplate.category})
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTemplateSelector(true)}
                className="ml-auto text-blue-600 hover:text-blue-700"
              >
                Change Template
              </Button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <CurrentStepComponent />
          
          {/* Navigation Buttons */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-4 md:mt-8 w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            
            {isLastStep ? (
              <Button
                onClick={handleFinish}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Check className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Finish Resume'}
              </Button>
            ) : (
              <Button 
                onClick={handleNext}
                disabled={currentStep === 2 && !isEducationComplete()} // Disable on education step if not complete
                title={currentStep === 2 && !isEducationComplete() ? 'Please fill in Institution, Degree, and Field of Study for at least one education entry' : undefined}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex flex-col gap-2 md:hidden mt-4">
          <Button variant="outline" onClick={() => setShowPreview(true)} className="w-full">
            <Eye className="h-4 w-4 mr-2" />
            Show Preview
          </Button>
          <Button variant="outline" onClick={handleSave} disabled={saving} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button disabled={exporting || !canExport} className="w-full" title={!canExport ? 'Complete Personal Info, Education, Skills, and Summary to export.' : undefined}>
                <Download className="h-4 w-4 mr-2" />
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Export Resume</DialogTitle>
                <DialogDescription>Choose a format to export your resume.</DialogDescription>
              </DialogHeader>
              {!canExport ? (
                <div className="text-red-600 text-sm mb-4">Please complete Personal Info, Education, Skills, and Summary before exporting your resume.</div>
              ) : null}
              <div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('pdf')}
                    disabled={exporting || !canExport}
                    className="h-20 flex flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('docx')}
                    disabled={exporting || !canExport}
                    className="h-20 flex flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Word
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('html')}
                    disabled={exporting || !canExport}
                    className="h-20 flex flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    HTML
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleExport('txt')}
                    disabled={exporting || !canExport}
                    className="h-20 flex flex-col"
                  >
                    <FileText className="h-6 w-6 mb-2" />
                    Text
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        
        {/* AIChat component */}
        <AIChat />
      </div>
    </div>
  )
}