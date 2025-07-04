import React from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useResumeStore } from '@/store/resumeStore'
import { Sparkles } from 'lucide-react'

export default function SummaryStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()

  const handleSummaryChange = (value: string) => {
    updateCurrentResume({ summary: value })
  }

  const handleAISuggest = async () => {
    // TODO: Implement AI suggestions based on experience and skills
    const aiSuggestion = "Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable applications and leading cross-functional teams to achieve project goals."
    updateCurrentResume({ summary: aiSuggestion })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Professional Summary</h2>
        <Button variant="outline" onClick={handleAISuggest}>
          <Sparkles className="h-4 w-4 mr-2" />
          AI Suggest
        </Button>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          placeholder="Write a compelling summary that highlights your key achievements, skills, and career objectives..."
          className="min-h-[150px]"
          value={currentResume?.summary || ''}
          onChange={(e) => handleSummaryChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Tip: Keep it concise (2-3 sentences) and focus on your most relevant qualifications.
        </p>
      </div>
    </div>
  )
}