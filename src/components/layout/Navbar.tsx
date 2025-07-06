import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Menu, Moon, Sun, X, User, LogOut, Settings, Sparkles, Zap, FileText, Video } from 'lucide-react'
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
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-lg border-b border-gray-200/20 dark:border-gray-700/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Logo />

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 relative"
                >
                  <FileText className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/interview-prep" 
                  className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 relative"
                >
                  <Video className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  Interview Prep
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  to="/subscription" 
                  className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-all duration-300 relative"
                >
                  <Zap className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span className="relative">
                    Upgrade
                    <span className="absolute -top-1 -right-3 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></span>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-amber-500 to-orange-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            ) : (
              <>
                <a 
                  href="#features" 
                  className="group text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-all duration-300 relative"
                >
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <a 
                  href="#pricing" 
                  className="group text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 font-medium transition-all duration-300 relative"
                >
                  Pricing
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-300"></span>
                </a>
                <Link 
                  to="/templates" 
                  className="group text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 font-medium transition-all duration-300 relative"
                >
                  Templates
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 group-hover:w-full transition-all duration-300"></span>
                </Link>
              </>
            )}
            
            <Button 
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className="relative group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500 group-hover:rotate-180 transition-transform duration-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600 group-hover:rotate-12 transition-transform duration-300" />
              )}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="relative group hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                  >
                    <User className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/20 dark:border-gray-700/20">
                  <DropdownMenuItem onClick={() => navigate('/profile')} className="group cursor-pointer">
                    <Settings className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
                    Profile & Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="group cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/auth/signin')}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate('/auth/signup')}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
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
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
            >
              {isMenuOpen ? (
                <X size={24} className="transform rotate-180 transition-transform duration-300" />
              ) : (
                <Menu size={24} className="transition-transform duration-300" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl rounded-b-2xl border-b border-gray-200/20 dark:border-gray-700/20 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-6 space-y-4">
              {user ? (
                <>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FileText className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link 
                    to="/interview-prep" 
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 py-3 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Video className="h-5 w-5" />
                    Interview Prep
                  </Link>
                  <Link 
                    to="/subscription" 
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 py-3 px-4 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Zap className="h-5 w-5" />
                    <span className="relative">
                      Upgrade
                      <span className="absolute -top-1 -right-2 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full animate-pulse"></span>
                    </span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-3 px-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Settings className="h-5 w-5" />
                    Profile
                  </Link>
                  <Button 
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }} 
                    variant="outline" 
                    className="w-full justify-start gap-3 text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950/50"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <a 
                    href="#features" 
                    className="block text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 py-3 px-4 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Features
                  </a>
                  <a 
                    href="#pricing" 
                    className="block text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 py-3 px-4 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Pricing
                  </a>
                  <Link 
                    to="/templates" 
                    className="block text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-teal-400 py-3 px-4 rounded-xl hover:bg-teal-50 dark:hover:bg-teal-950/50 transition-all duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Templates
                  </Link>
                  <div className="pt-4 space-y-3">
                    <Button 
                      onClick={() => {
                        navigate('/auth/signin')
                        setIsMenuOpen(false)
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => {
                        navigate('/auth/signup')
                        setIsMenuOpen(false)
                      }} 
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}