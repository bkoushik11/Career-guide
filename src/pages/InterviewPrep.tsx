import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import InterviewControls from '@/components/interview/InterviewControls'
import FeedbackChat from '@/components/interview/FeedbackChat'
import BackButton from '@/components/ui/BackButton'
import SuggestionsTips from '@/components/interview/SuggestionsTips'
import QuestionCard from '@/components/interview/QuestionCard'
import { generateGeminiText } from '@/lib/gemini'

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

const aiCache = new Map<string, { suggestions: string[]; tips: string[] }>()

export default function InterviewPrep() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [feedback, setFeedback] = useState<AIFeedback | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isInterviewStarted, setIsInterviewStarted] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>("")

  // Gemini AI states
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [aiTips, setAiTips] = useState<string[]>([])
  const [loadingAI, setLoadingAI] = useState(false)
  const [aiError, setAiError] = useState<string>("")

  const nextClickCount = useRef(0)

  const currentQuestion = mockQuestions[currentQuestionIndex]

  // Helper to get cache key
  const getCacheKey = () =>
    `${selectedRole}|${currentQuestionIndex}|${currentQuestion.id}`

  // Fetch AI suggestions/tips with caching and latency reduction
  const fetchAISuggestionsAndTips = async () => {
    if (!selectedRole) return
    setLoadingAI(true)
    setAiError("")
    const cacheKey = getCacheKey()
    if (aiCache.has(cacheKey)) {
      const cached = aiCache.get(cacheKey)!
      setAiSuggestions(cached.suggestions)
      setAiTips(cached.tips)
      setLoadingAI(false)
      return
    }
    try {
      // Role-specific, short, emoji, dot-pointed, easy-to-read prompt
      const suggestionsPrompt = `For the role of ${selectedRole.replace('_', ' ')}, give 3 short, simple suggestions for answering a common interview question. Each suggestion should:
- Start with a dot (•)
- End with a relevant emoji
- End with a dot
- Be a single sentence under 15 words
Return as a plain list, no markdown, no asterisks, no numbers, each on a new line.`
      const tipsPrompt = `For the role of ${selectedRole.replace('_', ' ')}, give 3 short, simple tips for answering a common interview question. Each tip should:
- Start with a dot (•)
- End with a relevant emoji
- End with a dot
- Be a single sentence under 15 words
Return as a plain list, no markdown, no asterisks, no numbers, each on a new line.`
      const [suggestionsText, tipsText] = await Promise.all([
        generateGeminiText(suggestionsPrompt),
        generateGeminiText(tipsPrompt),
      ])
      const suggestions = suggestionsText
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
      const tips = tipsText
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean)
      aiCache.set(cacheKey, { suggestions, tips })
      setAiSuggestions(suggestions)
      setAiTips(tips)
    } catch (err) {
      setAiError(
        "Failed to fetch AI suggestions & tips. Please check your Gemini API key and network connection."
      )
      setAiSuggestions([])
      setAiTips([])
    } finally {
      setLoadingAI(false)
    }
  }

  // Fetch on role/question change
  useEffect(() => {
    fetchAISuggestionsAndTips()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRole, currentQuestionIndex])

  const handleStartInterview = () => {
    setIsInterviewStarted(true)
    // In a real implementation, this would open Google Meet or video call
    console.log('Starting interview session...')
  }

  const handleRetry = () => {
    setFeedback(null)
    setShowFeedback(false)
  }

  // Navigation logic with guard
  const handleNext = () => {
    nextClickCount.current += 1
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
      setShowAnswer(false)
    }
    // Prevent going out of bounds
    else {
      setCurrentQuestionIndex(mockQuestions.length - 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
      setShowAnswer(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="hidden md:block"><BackButton /></div>
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
              value={selectedRole}
              onChange={e => { setSelectedRole(e.target.value); setCurrentQuestionIndex(0); }}
            >
              <option value="">-- Select --</option>
              <option value="hr">HR</option>
              <option value="software_engineer">Software Engineer</option>
              <option value="data_analyst">Data Analyst</option>
              <option value="ai_engineer">AI Engineer</option>
            </select>
          </div>
          {selectedRole && selectedRole !== "hr" && (
            <div className="mt-2 text-blue-700 dark:text-blue-300 text-sm font-medium">
              Role-specific questions and features integrating soon.
            </div>
          )}
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
            <QuestionCard
              question={currentQuestion.question_text}
              answer={currentQuestion.answer}
              showAnswer={showAnswer}
              onToggleAnswer={() => setShowAnswer((prev) => !prev)}
            />

            <div className="flex gap-4 mt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentQuestionIndex === mockQuestions.length - 1}
              >
                Next
              </Button>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <SuggestionsTips
              suggestions={aiSuggestions}
              tips={aiTips}
              loading={loadingAI}
              error={aiError}
              onRefresh={fetchAISuggestionsAndTips}
            />
            {/* Feedback Chat if needed */}
            {showFeedback && (
              <FeedbackChat
                feedback={feedback}
                onRetry={handleRetry}
                onNext={() => {}}
                canGoNext={false}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}