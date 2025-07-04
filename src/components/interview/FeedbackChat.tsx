import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, RotateCcw, ArrowRight, TrendingUp, MessageCircle, CheckCircle } from 'lucide-react'

interface AIFeedback {
  clarity_score: number
  confidence_score: number
  relevance_score: number
  suggestions: string[]
  overall_feedback: string
}

interface FeedbackChatProps {
  feedback: AIFeedback | null
  onRetry: () => void
  onNext: () => void
  canGoNext: boolean
}

export default function FeedbackChat({ feedback, onRetry, onNext, canGoNext }: FeedbackChatProps) {
  if (!feedback) return null

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600 dark:text-green-400'
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    if (score >= 70) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  }

  const averageScore = Math.round((feedback.clarity_score + feedback.confidence_score + feedback.relevance_score) / 3)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          AI Feedback & Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-900 dark:text-blue-100">Overall Score</span>
          </div>
          <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
            {averageScore}/100
          </div>
          <Badge className={getScoreBadge(averageScore)}>
            {averageScore >= 85 ? 'Excellent' : averageScore >= 70 ? 'Good' : 'Needs Improvement'}
          </Badge>
        </div>

        {/* Detailed Scores */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`text-xl font-bold ${getScoreColor(feedback.clarity_score)}`}>
              {feedback.clarity_score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Clarity</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`text-xl font-bold ${getScoreColor(feedback.confidence_score)}`}>
              {feedback.confidence_score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Confidence</div>
          </div>
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className={`text-xl font-bold ${getScoreColor(feedback.relevance_score)}`}>
              {feedback.relevance_score}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">Relevance</div>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-900 dark:text-blue-100">AI Analysis</span>
          </div>
          <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
            {feedback.overall_feedback}
          </p>
        </div>

        {/* Improvement Suggestions */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" />
            Suggestions for Improvement
          </h4>
          <div className="space-y-2">
            {feedback.suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
              >
                <div className="w-6 h-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">
                    {index + 1}
                  </span>
                </div>
                <p className="text-sm text-green-800 dark:text-green-200 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            <RotateCcw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Button 
            onClick={onNext} 
            className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
            disabled={!canGoNext}
          >
            {canGoNext ? (
              <>
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              'Interview Complete!'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}