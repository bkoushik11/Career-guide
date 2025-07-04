import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, FileText, CheckCircle, PenTool, Zap, Users, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import TestimonialsSection from '@/components/TestimonialsSection'
import { useAuthStore } from '@/store/authStore'

export default function Landing() {
  const { user } = useAuthStore()

  const features = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "AI Resume Builder",
      description: "Create professional resumes with our intelligent builder that adapts to your experience.",
      color: "from-blue-500 to-purple-500",
    },
    {
      icon: <CheckCircle className="h-8 w-8" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our advanced analysis.",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: <PenTool className="h-8 w-8" />,
      title: "Cover Letter Generator",
      description: "Craft compelling cover letters that match your resume and target role.",
      color: "from-pink-500 to-red-500",
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Interview Preparation",
      description: "Practice with AI-powered interview questions and get personalized feedback.",
      color: "from-red-500 to-orange-500",
    },
  ]

  const stats = [
    { number: "50K+", label: "Resumes Created" },
    { number: "95%", label: "Success Rate" },
    { number: "24/7", label: "AI Support" },
    { number: "10+", label: "Templates" },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-teal-900">
        <div className="absolute inset-0 bg-mesh opacity-20"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10 pt-32 pb-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                  <Sparkles className="h-5 w-5 text-amber-400 mr-2" />
                  <span className="text-amber-400 font-medium">AI-Powered Resume Builder</span>
                </div>
                
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
                  Create Your{' '}
                  <span className="relative">
                    <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300">
                      Dream Resume
                    </span>
                    <span className="absolute inset-0 bg-gradient-to-r from-teal-300 via-cyan-300 to-teal-300 blur-lg opacity-30"></span>
                  </span>{' '}
                  in Minutes
                </h1>
                
                <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                  Craft professional resumes that stand out with our AI-powered platform. 
                  Get more interviews and land your dream job faster.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                    <Link to={user ? "/dashboard" : "/auth/signup"}>
                      Start Building Now
                      <ChevronRight className="h-5 w-5 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-teal-300 text-teal-300 hover:bg-teal-300/10">
                    <Link to="/templates">
                      View Templates
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="flex-1 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-xl transform rotate-2"></div>
                <img 
                  src="https://images.unsplash.com/photo-1586281380349-632531db7ed4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
                  alt="Resume Builder Demo" 
                  className="rounded-xl shadow-2xl relative z-10"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-teal-500/10 rounded-xl transform -rotate-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800" id="features">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive suite of AI-powered tools helps you create, optimize, and perfect your job application materials.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              if (feature.title === 'AI Resume Builder') {
                return (
                  <Link
                    to={user ? "/resume-builder" : "/auth/signup"}
                    key={index}
                    style={{ textDecoration: 'none' }}
                  >
                    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`mb-4 text-white p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              } else if (feature.title === 'Interview Preparation') {
                return (
                  <Link to="/interview-prep" key={index} style={{ textDecoration: 'none' }}>
                    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`mb-4 text-white p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              } else if (feature.title === 'Cover Letter Generator') {
                return (
                  <Link to="/cover-letter" key={index} style={{ textDecoration: 'none' }}>
                    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`mb-4 text-white p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              } else if (feature.title === 'ATS Optimization') {
                return (
                  <Link to="/ats-optimization" key={index} style={{ textDecoration: 'none' }}>
                    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                      <CardHeader>
                        <div className={`mb-4 text-white p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                          {feature.icon}
                        </div>
                        <CardTitle className="text-xl">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-base">{feature.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </Link>
                );
              } else {
                return (
                  <Card key={index} className="group hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                    <CardHeader>
                      <div className={`mb-4 text-white p-3 rounded-lg bg-gradient-to-r ${feature.color} w-fit`}>
                        {feature.icon}
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">{feature.description}</CardDescription>
                    </CardContent>
                  </Card>
                );
              }
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of professionals who have already landed their dream jobs with our AI-powered platform.
          </p>
          <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
            <Link to={user ? "/dashboard" : "/auth/signup"}>
              Get Started for Free
              <ChevronRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}