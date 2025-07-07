import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, FileText, Edit, Trash2, Download, Eye, Calendar, Award, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuthStore } from '@/store/authStore'
import { useResumeStore, createNewResume } from '@/store/resumeStore'
import { ExportService } from '@/services/exportService'
import AIChat from '../components/ui/AIChat'
import BackButton from '@/components/ui/BackButton'

export default function Dashboard() {
  const { user } = useAuthStore()
  const { resumes, setCurrentResume, deleteResume, loadResumes, templates, loadTemplates } = useResumeStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate('/auth/signin')
      return
    }
    
    loadResumes(user.id)
    loadTemplates()
  }, [user, navigate, loadResumes, loadTemplates])

  const handleCreateResume = async () => {
    if (!user) return

    // 1. Create the new resume object (without id)
    const newResumeData = createNewResume(user.id)

    // 2. Save the new resume to the backend to get a full Resume object
    try {
      const savedResume = await useResumeStore.getState().saveResume({
        ...newResumeData,
      } as any) // Type assertion for backend compatibility
      setCurrentResume(savedResume)
      navigate('/resume-builder')
    } catch (error) {
      console.error('Failed to create new resume:', error)
    }
  }

  const handleEditResume = (resumeId: string) => {
    const resume = resumes.find(r => r.id === resumeId)
    if (resume) {
      setCurrentResume(resume)
      navigate('/resume-builder')
    }
  }

  const handleDeleteResume = async (resumeId: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await deleteResume(resumeId)
      } catch (error) {
        console.error('Failed to delete resume:', error)
      }
    }
  }

  const handleDownloadResume = async (resume: any) => {
    try {
      const blob = await ExportService.exportToPDF(resume, resume.template_id)
      await ExportService.downloadFile(blob, `${resume.title}.pdf`)
    } catch (error) {
      console.error('Failed to download resume:', error)
    }
  }

  const getTemplateInfo = (templateId: string) => {
    return templates.find(t => t.id === templateId)
  }

  const getCompletionScore = (resume: any) => {
    let score = 0
    
    // Personal info (20 points)
    if (resume.personal_info?.firstName && resume.personal_info?.lastName && 
        resume.personal_info?.email && resume.personal_info?.phone) {
      score += 20
    }

    // Summary (15 points)
    if (resume.summary && resume.summary.length > 50) {
      score += 15
    }

    // Experience (25 points)
    if (resume.experience && resume.experience.length > 0) {
      score += 25
    }

    // Education (15 points)
    if (resume.education && resume.education.length > 0) {
      score += 15
    }

    // Skills (15 points)
    if (resume.skills && resume.skills.length >= 3) {
      score += 15
    }

    // Projects or Certifications (10 points)
    if ((resume.projects && resume.projects.length > 0) || 
        (resume.certifications && resume.certifications.length > 0)) {
      score += 10
    }

    return score
  }

  const totalDownloads = resumes.reduce((sum, resume) => sum + (resume.download_count || 0), 0)

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16">
      <div className="hidden md:block"><BackButton /></div>
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header Row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6 md:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-1 sm:mt-2">
              Manage your resumes and track your job application progress.
            </p>
          </div>
          <Button onClick={handleCreateResume} className="flex items-center gap-2 w-full md:w-auto justify-center">
            <Plus className="h-4 w-4" />
            <span className="text-sm sm:text-base">Create New Resume</span>
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="text-xl sm:text-2xl font-bold">{resumes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Templates Available</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="text-xl sm:text-2xl font-bold">{templates.length}</div>
              <Link to="/templates" className="text-xs text-muted-foreground hover:text-primary">
                Browse templates →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="text-xl sm:text-2xl font-bold">{totalDownloads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="text-xl sm:text-2xl font-bold">
                {resumes.length > 0 
                  ? Math.round(resumes.reduce((sum, resume) => sum + getCompletionScore(resume), 0) / resumes.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Grid */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Your Resumes</h2>
          {resumes.length === 0 ? (
            <Card className="text-center py-8 sm:py-12">
              <CardContent className="p-4 md:p-6">
                <FileText className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-1 sm:mb-2">
                  No resumes yet
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-3 sm:mb-4">
                  Get started by creating your first resume with our AI-powered builder.
                </p>
                <Button onClick={handleCreateResume} className="w-full sm:w-auto justify-center">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="text-sm sm:text-base">Create Your First Resume</span>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {resumes.map((resume) => {
                const templateInfo = getTemplateInfo(resume.template_id)
                const completionScore = getCompletionScore(resume)
                return (
                  <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg">{resume.title}</CardTitle>
                          <CardDescription className="mt-1 text-xs sm:text-sm">
                            Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {templateInfo && (
                          <Badge variant="outline" className="ml-2 px-2 py-0.5 text-xs sm:text-sm">
                            {templateInfo.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6">
                      <div className="space-y-3 sm:space-y-4">
                        {/* Completion Progress */}
                        <div className="space-y-1 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-muted-foreground">Completion</span>
                            <span className="font-medium">{completionScore}%</span>
                          </div>
                          <Progress value={completionScore} className="h-2" />
                        </div>

                        {/* Resume Stats */}
                        <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                          <span>Experience: {resume.experience?.length || 0}</span>
                          <span>Skills: {resume.skills?.length || 0}</span>
                          <span>Downloads: {resume.download_count || 0}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-between items-center">
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs sm:text-sm"
                              onClick={() => handleEditResume(resume.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="px-2 py-1 text-xs sm:text-sm"
                              onClick={() => handleDeleteResume(resume.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            size="sm"
                            className="px-2 py-1 text-xs sm:text-sm"
                            onClick={() => handleDownloadResume(resume)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/templates">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Eye className="h-5 w-5" />
                  Browse Templates
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Explore our collection of {templates.length} professional resume templates
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/interview-prep">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Award className="h-5 w-5" />
                  Interview Preparation
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Practice with AI-powered interview questions and get feedback
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/subscription">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <Plus className="h-5 w-5" />
                  Upgrade to Premium
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Unlock advanced features and unlimited resume downloads
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
        </div>
      </div>
      <AIChat />
    </div>
  )
}