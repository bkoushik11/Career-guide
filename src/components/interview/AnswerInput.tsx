import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageSquare, Mic, Send, Sparkles } from 'lucide-react'

interface AnswerInputProps {
  answer: string
  onAnswerChange: (value: string) => void
  onSubmit: () => void
  loading: boolean
}

export default function AnswerInput({ answer, onAnswerChange, onSubmit, loading }: AnswerInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      onSubmit()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Your Answer
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Answer Input */}
        <div className="space-y-2">
          <Textarea
            placeholder="Type your answer here... (Ctrl + Enter to submit)"
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[150px] resize-none"
            disabled={loading}
          />
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <span>{answer.length} characters</span>
            <span>Ctrl + Enter to submit</span>
          </div>
        </div>

        {/* Recording Option */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">Voice Recording</span>
            </div>
            <Button variant="outline" size="sm" disabled>
              <Mic className="h-4 w-4 mr-2" />
              Coming Soon
            </Button>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Record your answer with voice for more realistic practice
          </p>
        </div>

        {/* Submit Button */}
        <Button 
          onClick={onSubmit}
          disabled={!answer.trim() || loading}
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          size="lg"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Analyzing Answer...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Submit & Get AI Feedback
            </>
          )}
        </Button>

        {/* Helpful Tips */}
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>💡 <strong>Tip:</strong> Structure your answer using the STAR method (Situation, Task, Action, Result)</p>
          <p>⏱️ <strong>Timing:</strong> Aim for 1-3 minutes for most answers</p>
          <p>🎯 <strong>Focus:</strong> Be specific and use concrete examples</p>
        </div>
      </CardContent>
    </Card>
  )
}