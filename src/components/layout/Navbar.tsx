import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, X, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import Logo from './Logo'

interface NavbarProps {
  isDark: boolean
  toggleTheme: () => void
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-900 dark:text-gray-300 hover:text-primary font-medium transition">
                  Dashboard
                </Link>
                <Link to="/interview-prep" className="text-gray-900 dark:text-gray-300 hover:text-primary font-medium transition">
                  Interview Prep
                </Link>
                <Link to="/subscription" className="text-gray-900 dark:text-gray-300 hover:text-primary font-medium transition">
                  Upgrade
                </Link>
              </>
            ) : (
              <>
                <a href="#features" className="text-gray-900 dark:text-gray-300 hover:text-primary font-medium transition">Features</a>
                <a href="#pricing" className="text-gray-900 dark:text-gray-300 hover:text-primary font-medium transition">Pricing</a>
              </>
            )}
            
            <Button 
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <Settings className="mr-2 h-4 w-4" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" onClick={() => navigate('/auth/signin')}>
                  Sign In
                </Button>
                <Button onClick={() => navigate('/auth/signup')}>
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Button 
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
            >
              {isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 absolute top-20 left-0 w-full shadow-lg rounded-b-lg">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <Link to="/dashboard" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Dashboard</Link>
                  <Link to="/interview-prep" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Interview Prep</Link>
                  <Link to="/subscription" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Upgrade</Link>
                  <Link to="/profile" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Profile</Link>
                  <Button onClick={handleSignOut} variant="outline" className="w-full">
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <a href="#features" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Features</a>
                  <a href="#pricing" className="block text-gray-900 dark:text-gray-300 hover:text-primary">Pricing</a>
                  <Button onClick={() => navigate('/auth/signin')} variant="outline" className="w-full">
                    Sign In
                  </Button>
                  <Button onClick={() => navigate('/auth/signup')} className="w-full">
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}