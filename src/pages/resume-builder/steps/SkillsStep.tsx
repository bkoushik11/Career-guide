import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useResumeStore } from '@/store/resumeStore'
import { Plus, X } from 'lucide-react'

export default function SkillsStep() {
  const { currentResume, updateCurrentResume } = useResumeStore()
  const [newSkill, setNewSkill] = useState('')

  const skills = currentResume?.skills || []

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      updateCurrentResume({ skills: [...skills, newSkill.trim()] })
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    updateCurrentResume({ 
      skills: skills.filter(skill => skill !== skillToRemove) 
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Skills</h2>
      </div>

      <div className="space-y-4">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Label htmlFor="newSkill">Add Skill</Label>
            <Input
              id="newSkill"
              placeholder="e.g., JavaScript, React, Python"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyPress={handleKeyPress}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={addSkill} disabled={!newSkill.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {skills.length > 0 && (
          <div className="space-y-2">
            <Label>Your Skills</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>No skills added yet. Start by adding your technical and soft skills.</p>
          </div>
        )}
      </div>
    </div>
  )
}