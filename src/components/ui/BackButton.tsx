import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from './button'

interface BackButtonProps {
  className?: string
}

export default function BackButton({ className = "" }: BackButtonProps) {
  const navigate = useNavigate()

  const handleBackClick = () => {
    if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className={`fixed top-4 left-6 z-50 ${className}`}>
      <Button
        onClick={handleBackClick}
        variant="ghost"
        size="icon"
        className="bg-white/90 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 text-gray-900 dark:text-white border border-gray-400 dark:border-white/30 backdrop-blur-md transition-all duration-300 group w-12 h-12 rounded-full shadow-lg hover:shadow-xl hover:scale-105"
      >
        <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform duration-300" />
      </Button>
    </div>
  )
} 