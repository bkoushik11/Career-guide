import React from 'react'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function Logo() {
  return (
    <Link to="/" className="relative group cursor-pointer">
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
      <div className="relative flex items-center space-x-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
          <div className="relative bg-white dark:bg-gray-800 p-2 rounded-full flex items-center justify-center">
            <Compass className="w-8 h-8 text-primary transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-12" />
          </div>
        </div>
        <div className="font-bold text-xl">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-teal-500">
            CareerGuide
          </span>
        </div>
      </div>
    </Link>
  )
}