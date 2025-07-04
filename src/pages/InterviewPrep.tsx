import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
// import { Video, Play, Pause, RotateCcw, ArrowRight, ArrowLeft, Lightbulb, MessageSquare, Mic, Send } from 'lucide-react'
import InterviewControls from '@/components/interview/InterviewControls'
import FeedbackChat from '@/components/interview/FeedbackChat'

interface InterviewQuestion {
  id: string
  question_text: string
  answer: string
}

interface AIFeedback {
  clarity_score: number
  confidence_score: number
  relevance_score: number
  suggestions: string[]
  overall_feedback: string
}

const mockQuestions: InterviewQuestion[] = [
  {
    id: '1',
    question_text: 'Tell me about yourself and your professional background.',
    answer: 'Keep your answer to 2-3 minutes maximum. Focus on professional achievements relevant to the role. Structure your response chronologically or by themes. End with why you\'re interested in this specific position.'
  },
  {
    id: '2',
    question_text: 'Describe a challenging project you worked on and how you overcame obstacles.',
    answer: 'Use the STAR method (Situation, Task, Action, Result). Choose a project that demonstrates relevant skills. Focus on your specific contributions and decisions. Quantify the impact of your solution when possible.'
  },
  {
    id: '3',
    question_text: 'Where do you see yourself in 5 years, and how does this role fit into your career goals?',
    answer: 'Show ambition but be realistic about timelines. Align your goals with the company\'s growth opportunities. Demonstrate that you\'ve thought about your career path. Mention skills you want to develop that benefit both you and the company.'
  }
]

export default function InterviewPrep() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [loading, setLoading] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / mockQuestions.length) * 100

  const handleStartInterview = () => {
    setIsInterviewStarted(true)
    // In a real implementation, this would open Google Meet or video call
    console.log('Starting interview session...')
  }

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return

    setLoading(true)
    
    // Simulate API call for AI feedback
    setTimeout(() => {
      const mockFeedback: AIFeedback = {
        clarity_score: Math.floor(Math.random() * 30) + 70,
        confidence_score: Math.floor(Math.random() * 30) + 70,
        relevance_score: Math.floor(Math.random() * 30) + 70,
        suggestions: [
          'Great use of specific examples! Consider adding more quantifiable results.',
          'Your answer shows good structure. Try to be more concise in the opening.',
          'Excellent connection to the role requirements. Add more personal reflection.',
          'Strong technical details. Consider explaining the business impact more clearly.'
        ],
        overall_feedback: 'Your answer demonstrates good understanding of the question and provides relevant examples. Focus on being more concise and adding quantifiable results to make your response even stronger.'
      }
      
      setFeedback(mockFeedback)
      setShowFeedback(true)
      setLoading(false)
    }, 2000)
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setAnswer('')
      setFeedback(null)
      setShowFeedback(false)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      setAnswer('')
      setFeedback(null)
      setShowFeedback(false)
    }
  }

  const handleRetry = () => {
    setAnswer('')
    setFeedback(null)
    setShowFeedback(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            AI Interview Practice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Practice with AI-powered interview questions and get real-time feedback and suggestions.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <label htmlFor="role-select" className="text-gray-700 dark:text-gray-300 font-medium">Select Role:</label>
            <select
              id="role-select"
              className="border rounded px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              // You can add value/onChange here if you want to handle role selection in state
            >
              <option value="hr">HR</option>
              <option value="software_engineer">Software Engineer</option>
              <option value="data_analyst">Data Analyst</option>
              <option value="ai_engineer">AI Engineer</option>
            </select>
          </div>
          <hr className="my-4 border-gray-300 dark:border-gray-700" />
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Interview Controls */}
            <InterviewControls 
              isStarted={isInterviewStarted}
              onStart={handleStartInterview}
            />

            {/* Current Question */}
            <Card>
              <CardHeader>
                <CardTitle
                  className="text-xl cursor-pointer hover:text-blue-600"
                  onClick={() => setShowAnswer((prev) => !prev)}
                >
                  {currentQuestion.question_text}
                </CardTitle>
              </CardHeader>
              {showAnswer && (
                <CardContent>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-blue-800 dark:text-blue-200 mt-1">
                      {currentQuestion.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>

            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => { setCurrentQuestionIndex((i) => Math.max(i - 1, 0)); setShowAnswer(false); }}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => { setCurrentQuestionIndex((i) => Math.min(i + 1, mockQuestions.length - 1)); setShowAnswer(false); }}
                disabled={currentQuestionIndex === mockQuestions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* AI Suggestions Section */}
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-100 mb-2">AI Suggestions</h3>
              <ul className="list-disc pl-5 text-yellow-900 dark:text-yellow-100 text-sm space-y-1">
                {currentQuestion.id === '1' && (
                  <>
                    <li>Keep your answer concise and relevant to the job.</li>
                    <li>Highlight your most impressive achievements.</li>
                    <li>Show enthusiasm for the position.</li>
                  </>
                )}
                {currentQuestion.id === '2' && (
                  <>
                    <li>Describe the challenge clearly and your specific role.</li>
                    <li>Emphasize problem-solving and teamwork.</li>
                    <li>Quantify your results if possible.</li>
                  </>
                )}
                {currentQuestion.id === '3' && (
                  <>
                    <li>Align your goals with the company's vision.</li>
                    <li>Show ambition but remain realistic.</li>
                    <li>Mention skills you want to develop.</li>
                  </>
                )}
              </ul>
            </div>
            {/* Tips Section */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="font-semibold text-blue-800 dark:text-blue-100 mb-2">Tips</h3>
              <ul className="list-disc pl-5 text-blue-900 dark:text-blue-100 text-sm space-y-1">
                {currentQuestion.id === '1' && (
                  <>
                    <li>Structure your answer chronologically or by themes.</li>
                    <li>End with why you're interested in this specific position.</li>
                  </>
                )}
                {currentQuestion.id === '2' && (
                  <>
                    <li>Use the STAR method (Situation, Task, Action, Result).</li>
                    <li>Choose a project that demonstrates relevant skills.</li>
                    <li>Focus on your specific contributions and decisions.</li>
                  </>
                )}
                {currentQuestion.id === '3' && (
                  <>
                    <li>Demonstrate that you've thought about your career path.</li>
                    <li>Mention skills you want to develop that benefit both you and the company.</li>
                  </>
                )}
              </ul>
            </div>
            {/* Feedback Chat if needed */}
            {showFeedback && (
              <FeedbackChat
                feedback={feedback}
                onRetry={handleRetry}
                onNext={handleNextQuestion}
                canGoNext={currentQuestionIndex < mockQuestions.length - 1}
              />
            )}
          </div>
        </div>

        {/* Navigation Controls removed as requested */}
      </div>
    </div>
  )
}