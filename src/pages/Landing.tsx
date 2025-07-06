import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Sparkles, FileText, CheckCircle, PenTool, Zap, Users, Award, Play, Star, ArrowRight, Bot, Target, Rocket, Shield, Video, MessageSquare, TrendingUp, Clock, Compass } from 'lucide-react'
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
    }
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
    { number: "10+", label: "Templates", icon: <Sparkles className="h-6 w-6" /> }
  ]

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Rest of the JSX code */}
    </div>
  )
}