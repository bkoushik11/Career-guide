import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sparkles, FileText, CheckCircle, Users, ArrowRight, Bot, Target, Rocket, Shield, Video, MessageSquare, TrendingUp, Clock, Compass, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/authStore'

export default function Landing() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "AI Resume Builder",
      description:
        "Create professional resumes with our intelligent builder that adapts to your experience.",
      color: "from-blue-500 to-cyan-500",
      delay: "0ms",
      link: user ? "/resume-builder" : "/auth/signup",
      isClickable: true,
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "ATS Optimization",
      description:
        "Ensure your resume passes Applicant Tracking Systems with our advanced analysis.",
      color: "from-purple-500 to-pink-500",
      delay: "200ms",
      link: "/ats-optimization",
      isClickable: true,
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Cover Letter Generator",
      description:
        "Craft compelling cover letters that match your resume and target role.",
      color: "from-pink-500 to-red-500",
      delay: "400ms",
      link: "/cover-letter",
      isClickable: true,
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Interview Preparation",
      description:
        "Practice mock interviews with our AI-powered practice sessions.",
      color: "from-red-500 to-orange-500",
      delay: "600ms",
      link: "/interview-prep",
      isClickable: true,
    },
  ];

  const howItWorks = [
    {
      step: "01",
      title: "Fill Your Details",
      description: "Input your experience, skills, and career goals with our intuitive form.",
      icon: <FileText className="h-12 w-12" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      step: "02", 
      title: "Pick a Template",
      description: "Choose from our collection of ATS-optimized, professional templates.",
      icon: <Sparkles className="h-12 w-12" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      step: "03",
      title: "Get Instant Feedback",
      description: "Receive AI-powered suggestions to optimize your resume for success.",
      icon: <TrendingUp className="h-12 w-12" />,
      color: "from-pink-500 to-red-500"
    }
  ]



  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-2 md:px-0">
        {/* Back Button */}
        <div className="fixed top-6 left-6 z-50 hidden md:block">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            size="icon"
            className="bg-white/90 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-gray-900 dark:text-white border border-gray-400 dark:border-white/30 backdrop-blur-md transition-all duration-300 group w-12 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-teal-500/10"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-full md:max-w-7xl mx-auto px-2 md:px-4 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Main Headline */}
            <h1 className="text-4xl md:text-8xl font-bold text-white leading-tight mb-6 md:mb-8">
              Build Smarter{' '}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300">
                  Resumes
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 blur-2xl opacity-30"></span>
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-red-300">
                Ace Every Interview
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base md:text-2xl text-blue-100 mb-8 md:mb-12 max-w-full md:max-w-3xl mx-auto leading-relaxed">
              Transform your career with AI-powered resume building and interview preparation. 
              <br className="hidden md:block" />
              Get hired faster with personalized feedback and optimization.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-center w-full md:w-auto">
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 transform hover:scale-105">
                <Link to={user ? "/dashboard" : "/auth/signup"}>
                  <Rocket className="h-6 w-6 mr-2" />
                  Build My Resume
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-purple-400 text-purple-300 hover:bg-purple-400/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
                <Link to="/interview-prep">
                  <Video className="h-6 w-6 mr-2" />
                  Try Interview AI
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center items-center gap-8 text-blue-200">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>ATS Optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                <span>5-Minute Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-400" />
                <span>50K+ Users</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>

        {/* Mobile Back Button */}
        <div className="md:hidden fixed top-4 right-4 z-50">
          <Button
            onClick={handleBackClick}
            variant="ghost"
            size="icon"
            className="bg-white/90 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-gray-900 dark:text-white border border-gray-400 dark:border-white/30 backdrop-blur-md transition-all duration-300 group w-12 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105"
          >
            <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-10 md:py-20 bg-white dark:bg-gray-900 relative px-2 md:px-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Three simple steps to transform your career prospects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
            {howItWorks.map((step, index) => (
              <div
                key={index}
                className="relative group"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <CardHeader className="text-center pb-4">
                    <div className={`mx-auto w-20 h-20 rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <div className="text-white">
                        {step.icon}
                      </div>
                    </div>
                    <div className={`text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${step.color} mb-2`}>
                      {step.step}
                    </div>
                    <CardTitle className="text-gray-900 dark:text-white text-xl">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Connecting Line */}
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 dark:from-gray-600 to-transparent transform -translate-y-1/2 z-10"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="py-10 md:py-20 bg-gray-50 dark:bg-gray-900 relative overflow-hidden px-2 md:px-0">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center mb-8 md:mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2">
              <Bot className="h-4 w-4 mr-2" />
              AI-Powered
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Intelligent Career Tools
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Leverage cutting-edge AI to optimize every aspect of your job search
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-all duration-500 transform hover:scale-105 hover:shadow-2xl overflow-hidden relative ${
                  feature.isClickable ? 'cursor-pointer' : ''
                }`}
                style={{ animationDelay: feature.delay }}
                onClick={feature.isClickable ? () => navigate(feature.link) : undefined}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                <CardHeader className="relative z-10">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {feature.icon}
                    </div>
                  </div>
                  <CardTitle className="text-gray-900 dark:text-white text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 dark:group-hover:from-white dark:group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative z-10">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                  {feature.isClickable && (
                    <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300">
                      <span className="text-sm font-medium">Get Started</span>
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">💬 Testimonials</h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">
            We're currently collecting feedback from early users. Testimonials coming soon — and they'll be 100% real ✨
          </p>
        </div>
      </section>

      {/* Why CareerGuide Section */}
      <section className="py-10 md:py-20 bg-gray-50 dark:bg-gray-900 px-2 md:px-0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12">✨ Why CareerGuide?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            {/* Card 1 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-2">✅ Built by job seekers, for job seekers</h3>
              <p className="text-gray-600 dark:text-gray-300">Every feature was designed to solve real challenges we faced while applying for jobs — and to help others skip the struggle.</p>
            </div>
            {/* Card 2 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-2">🔍 More than just resume creation</h3>
              <p className="text-gray-600 dark:text-gray-300">CareerGuide also helps with cover letters, ATS compatibility, and live AI interview prep — all in one place.</p>
            </div>
            {/* Card 3 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-2">🔐 Your data stays private</h3>
              <p className="text-gray-600 dark:text-gray-300">Your resume and interview data are never shared. What you create stays securely with you.</p>
            </div>
            {/* Card 4 */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-8">
              <h3 className="text-xl font-semibold mb-2">🚀 Designed for speed and simplicity</h3>
              <p className="text-gray-600 dark:text-gray-300">Create and customize documents in minutes — no fluff, no friction. Just job-ready output.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-10 md:py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden px-2 md:px-0">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-full md:max-w-4xl mx-auto text-center px-2 md:px-4 relative z-10">
          <h2 className="text-2xl md:text-5xl font-bold text-white mb-4 md:mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-base md:text-xl text-blue-100 mb-6 md:mb-8 leading-relaxed">
            Join thousands of professionals who have already landed their dream jobs with our AI-powered platform.
          </p>
          
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 justify-center items-center w-full md:w-auto">
            <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105">
              <Link to={user ? "/dashboard" : "/auth/signup"}>
                <Rocket className="h-6 w-6 mr-2" />
                Get Started for Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold rounded-xl backdrop-blur-sm">
              <Link to="/templates">
                <Sparkles className="h-6 w-6 mr-2" />
                View Templates
              </Link>
            </Button>
          </div>

          {/* Free Forever Badge */}
          <div className="mt-4 md:mt-8">
            <Badge className="bg-green-500 text-white px-6 py-2 text-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Free Forever Plan Available
            </Badge>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 px-2 md:px-0">
        <div className="max-w-full md:max-w-7xl mx-auto px-2 md:px-4 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Compass className="h-8 w-8 text-blue-500" />
                <span className="text-2xl font-bold text-white">CareerGuide</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Empowering careers with AI-powered resume building and interview preparation tools.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <Users className="h-5 w-5 text-gray-400 hover:text-white" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">
                  <MessageSquare className="h-5 w-5 text-gray-400 hover:text-white" />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resume-builder" className="hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link to="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
                <li><Link to="/cover-letter" className="hover:text-white transition-colors">Cover Letters</Link></li>
                <li><Link to="/ats-optimization" className="hover:text-white transition-colors">ATS Optimization</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerGuide. All rights reserved. Built with ❤️ for job seekers.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}