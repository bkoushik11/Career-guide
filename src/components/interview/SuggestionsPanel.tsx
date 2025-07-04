import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lightbulb, Target, Clock, Star } from 'lucide-react'

interface SuggestionsPanelProps {
  suggestions: string[]
  questionCategory: string
  difficulty: string
}

export default function SuggestionsPanel({ suggestions, questionCategory, difficulty }: SuggestionsPanelProps) {
  const getIcon = (index: number) => {
    const icons = [Lightbulb, Target, Clock, Star]
    const IconComponent = icons[index % icons.length]
    return <IconComponent className="h-4 w-4" />
  }

  const getIconColor = (index: number) => {
    const colors = ['text-yellow-500', 'text-blue-500', 'text-green-500', 'text-purple-500']
    return colors[index % colors.length]
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-500" />
            AI Suggestions
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">{questionCategory}</Badge>
            <Badge variant="secondary">{difficulty}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
              💡 Smart Tips for This Question
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              These suggestions update automatically based on your answer and the question type.
            </p>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
              >
                <div className={`mt-0.5 ${getIconColor(index)}`}>
                  {getIcon(index)}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  {suggestion}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
            <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-center gap-2">
              <Star className="h-4 w-4" />
              Pro Tips
            </h4>
            <ul className="text-xs text-amber-800 dark:text-amber-200 space-y-1">
              <li>• Take a moment to think before answering</li>
              <li>• Speak clearly and maintain good posture</li>
              <li>• Use specific examples from your experience</li>
              <li>• Keep your answers concise but comprehensive</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}