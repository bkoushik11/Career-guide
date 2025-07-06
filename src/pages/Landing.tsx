import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, FileText, CheckCircle, PenTool, Zap, Users, Award, Play, Star, ArrowRight, Bot, Target, Rocket, Shield, Video, MessageSquare, TrendingUp, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import TestimonialsSection from '@/components/TestimonialsSection'
import { useAuthStore } from '@/store/authStore'

export default function Landing() {
  const { user } = useAuthStore()
  const [currentDemo, setCurrentDemo] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentDemo((prev) => (prev + 1) % 3)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <Bot className="h-8 w-8" />,
      title: "GPT Resume Generation",
      description: "AI writes compelling bullet points tailored to your experience and target role.",
      color: "from-blue-500 to-cyan-500",
      delay: "0ms"
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with smart keyword analysis.",
      color: "from-purple-500 to-pink-500",
      delay: "200ms"
    },
    {
      icon: <Video className="h-8 w-8" />,
      title: "Video Interview Simulation",
      description: "Practice with AI-powered mock interviews and get real-time feedback.",
      color: "from-pink-500 to-red-500",
      delay: "400ms"
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      title: "Cover Letter Assistant",
      description: "Generate personalized cover letters that complement your resume perfectly.",
      color: "from-red-500 to-orange-500",
      delay: "600ms"
    },
  ]

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

  const demoScreens = [
    {
      title: "Resume Builder Wizard",
      description: "Step-by-step guidance with AI assistance",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "AI Feedback Chat",
      description: "Real-time suggestions and improvements",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Interview Prep",
      description: "Practice with AI-powered mock interviews",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
    }
  ]

  const stats = [
    { number: "50K+", label: "Resumes Created", icon: <FileText className="h-6 w-6" /> },
    { number: "95%", label: "Success Rate", icon: <TrendingUp className="h-6 w-6" /> },
    { number: "24/7", label: "AI Support", icon: <Bot className="h-6 w-6" /> },
    { number: "10+", label: "Templates", icon: <Sparkles className="h-6 w-6" /> },
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Hero Section */}
      <section className="min-h-screen relative flex items-center justify-center pt-20">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="text-center">
            {/* Animated Badge */}
            <div className={`inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Sparkles className="h-5 w-5 text-amber-400 mr-2 animate-pulse" />
              <span className="text-amber-400 font-medium">AI-Powered Career Platform</span>
              <Badge className="ml-3 bg-gradient-to-r from-green-400 to-blue-500 text-white border-0">
                Free Forever
              </Badge>
            </div>
            
            {/* Main Headline */}
            <h1 className={`text-6xl md:text-8xl font-bold text-white leading-tight mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Build Smarter{' '}
              <span className="relative">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 animate-pulse">
                  Resumes
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 blur-2xl opacity-30"></span>
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300">
                Ace Every Interview
              </span>
            </h1>
            
            {/* Subtext */}
            <p className={`text-xl md:text-2xl text-blue-100 mb-12 max-w-4xl mx-auto leading-relaxed transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Transform your career with AI-powered resume building and interview preparation. 
              <br className="hidden md:block" />
              Get hired faster with personalized feedback and optimization.
            </p>
            
            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Button asChild size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-105 transition-all duration-300">
                <Link to={user ? "/resume-builder" : "/auth/signup"}>
                  <Rocket className="h-6 w-6 mr-2" />
                  Build My Resume
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-2 border-cyan-300 text-cyan-300 hover:bg-cyan-300/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm">
                <Link to="/interview-prep">
                  <Play className="h-6 w-6 mr-2" />
                  Try Interview AI
                </Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className={`mt-16 flex flex-wrap justify-center items-center gap-8 text-blue-200 transform transition-all duration-1000 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-400" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                <span>50K+ Users</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span>4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              See CareerGuide in Action
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Watch how our AI-powered platform transforms your career journey with intelligent automation and personalized guidance.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Demo Navigation */}
            <div className="space-y-6">
              {demoScreens.map((demo, index) => (
                <Card 
                  key={index}
                  className={`cursor-pointer transition-all duration-500 transform hover:scale-105 ${
                    currentDemo === index 
                      ? 'ring-2 ring-blue-500 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950' 
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setCurrentDemo(index)}
                >
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        currentDemo === index 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{demo.title}</CardTitle>
                        <CardDescription className="text-base">{demo.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Demo Screen */}
            <div className="relative">
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={demoScreens[currentDemo].image}
                    alt={demoScreens[currentDemo].title}
                    className="w-full h-full object-cover transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{demoScreens[currentDemo].title}</h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{demoScreens[currentDemo].description}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full opacity-20 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-r from-pink-400 to-red-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gray-50 dark:bg-gray-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-red-600">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Get from zero to hired in three simple steps with our AI-powered career platform.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {howItWorks.map((step, index) => (
              <div 
                key={index}
                className="text-center group"
                style={{ animationDelay: step.delay }}
              >
                <div className="relative mb-8">
                  <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${step.color} flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-500 shadow-2xl`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{step.step}</span>
                  </div>
                  
                  {/* Connecting Line */}
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-gray-300 to-transparent dark:from-gray-600 transform translate-x-6"></div>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI-Powered Features */}
      <section className="py-32 bg-white dark:bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:via-purple-950 dark:to-pink-950"></div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
              AI-Powered Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Harness the power of artificial intelligence to supercharge your job search and career growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 transform hover:scale-105 hover:-translate-y-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl"
                style={{ animationDelay: feature.delay }}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`mb-6 mx-auto w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-600 transition-all duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed text-center">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="4"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        
        <div className="max-w-4xl mx-auto text-center px-4 relative">
          <h2 className="text-5xl font-bold text-white mb-8">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join thousands of professionals who have already landed their dream jobs with our AI-powered platform. 
            Start building your future today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300">
              <Link to={user ? "/dashboard" : "/auth/signup"}>
                <Rocket className="h-6 w-6 mr-2" />
                Get Started for Free
                <ArrowRight className="h-6 w-6 ml-2" />
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="border-2 border-purple-300 text-purple-300 hover:bg-purple-300/10 px-8 py-4 text-lg font-semibold rounded-full backdrop-blur-sm">
              <Link to="/templates">
                <Sparkles className="h-6 w-6 mr-2" />
                View Templates
              </Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-green-400" />
              <span>5 min setup</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-400" />
              <span>Join 50K+ users</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Compass className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  CareerGuide
                </span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Empowering careers with AI-powered resume building and interview preparation. 
                Your journey to success starts here.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Users className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
                  <Star className="h-5 w-5" />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/resume-builder" className="hover:text-white transition-colors">Resume Builder</Link></li>
                <li><Link to="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link></li>
                <li><Link to="/cover-letter" className="hover:text-white transition-colors">Cover Letters</Link></li>
                <li><Link to="/ats-optimization" className="hover:text-white transition-colors">ATS Optimization</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 CareerGuide. All rights reserved. Made with ❤️ for job seekers worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}