import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, ArrowLeft, ArrowRight, Play, ExternalLink, AlertCircle } from 'lucide-react'
import { startInterviewSession, TavusConversationResponse } from '@/services/tavusService'

interface InterviewControlsProps {
  isStarted: boolean
  onStart: () => void
}

export default function InterviewControls({
  isStarted,
  onStart
}: InterviewControlsProps) {
  const [isStartingSession, setIsStartingSession] = useState(false)
  const [sessionData, setSessionData] = useState<TavusConversationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleStartInterview = async () => {
    setIsStartingSession(true)
    setError(null)
    
    try {
      // Start the Tavus interview session
      const response = await startInterviewSession()
      setSessionData(response)
      
      // Open the conversation URL in a new tab/window
      if (response.conversation_url) {
        window.open(response.conversation_url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
      }
      
      // Call the parent onStart callback
      onStart()
      
      console.log('Interview session started:', response)
    } catch (err) {
      console.error('Failed to start interview session:', err)
      setError(err instanceof Error ? err.message : 'Failed to start interview session')
    } finally {
      setIsStartingSession(false)
    }
  }

  const openSessionUrl = () => {
    if (sessionData?.conversation_url) {
      window.open(sessionData.conversation_url, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="h-5 w-5" />
          Interview Session
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Error Display */}
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Error</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            </div>
          )}

          {/* Start Interview Button */}
          <Button 
            onClick={handleStartInterview}
            disabled={isStartingSession}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="lg"
          >
            {isStartingSession ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Starting Session...
              </>
            ) : isStarted ? (
              <>
                <Video className="h-5 w-5 mr-2" />
                Interview in Progress
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Start Interview Session
              </>
            )}
          </Button>
          
          {/* Session Status */}
          {isStarted && sessionData && (
            <div className="space-y-2">
              <div className="text-sm text-center text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 p-2 rounded-lg">
                🎥 Video interview session is active
              </div>
              
              {sessionData.conversation_url && (
                <Button
                  variant="outline"
                  onClick={openSessionUrl}
                  className="w-full"
                  size="sm"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Interview Window
                </Button>
              )}
              
              <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                Session ID: {sessionData.conversation_id}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p><strong>How it works:</strong></p>
            <p>1. Click "Start Interview Session" to begin</p>
            <p>2. A new window will open with your AI interviewer</p>
            <p>3. Practice answering questions in real-time</p>
            <p>4. Get instant feedback on your responses</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}