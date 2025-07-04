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

  const handleCreateResume = () => {
    if (!user) return
    
    const newResume = createNewResume(user.id)
    setCurrentResume(newResume)
    navigate('/resume-builder')
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your resumes and track your job application progress.
            </p>
          </div>
          <Button onClick={handleCreateResume} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Resume
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resumes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Templates Available</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{templates.length}</div>
              <Link to="/templates" className="text-xs text-muted-foreground hover:text-primary">
                Browse templates →
              </Link>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg. Completion</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {resumes.length > 0 
                  ? Math.round(resumes.reduce((sum, resume) => sum + getCompletionScore(resume), 0) / resumes.length)
                  : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Resumes Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Your Resumes</h2>
          {resumes.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No resumes yet
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Get started by creating your first resume with our AI-powered builder.
                </p>
                <Button onClick={handleCreateResume}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume) => {
                const templateInfo = getTemplateInfo(resume.template_id)
                const completionScore = getCompletionScore(resume)
                return (
                  <Card key={resume.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{resume.title}</CardTitle>
                          <CardDescription className="mt-1">
                            Last updated: {new Date(resume.updated_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        {templateInfo && (
                          <Badge variant="outline" className="ml-2">
                            {templateInfo.name}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Completion Progress */}
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Completion</span>
                            <span className="font-medium">{completionScore}%</span>
                          </div>
                          <Progress value={completionScore} className="h-2" />
                        </div>

                        {/* Resume Stats */}
                        <div className="flex justify-between text-sm text-muted-foreground">
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
                              onClick={() => handleEditResume(resume.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteResume(resume.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button 
                            size="sm"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/templates">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Browse Templates
                </CardTitle>
                <CardDescription>
                  Explore our collection of {templates.length} professional resume templates
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/interview-prep">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Interview Preparation
                </CardTitle>
                <CardDescription>
                  Practice with AI-powered interview questions and get feedback
                </CardDescription>
              </CardHeader>
            </Link>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link to="/subscription">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Upgrade to Premium
                </CardTitle>
                <CardDescription>
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