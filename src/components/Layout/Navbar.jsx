import { Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { TrophyIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()

  return (
    <nav className="bg-brutal-bg dark:bg-brutal-dark border-b-3 sm:border-b-4 border-black dark:border-brutal-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="text-xl sm:text-2xl lg:text-3xl font-black uppercase tracking-tight hover:text-brutal-primary transition-colors">
            ALGOVIZ
          </Link>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <Link 
              to="/" 
              className="hidden sm:block px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-sm uppercase tracking-wide border-3 border-black dark:border-brutal-bg hover:bg-black hover:text-white dark:hover:bg-brutal-bg dark:hover:text-brutal-dark transition-all"
            >
              BERANDA
            </Link>
            
            <Link 
              to="/quiz" 
              className="px-3 py-1.5 sm:px-4 sm:py-2 font-bold text-sm uppercase tracking-wide border-3 border-black dark:border-brutal-bg bg-brutal-warning text-white hover:bg-brutal-warning/80 transition-all flex items-center gap-1.5"
            >
              <TrophyIcon className="w-4 h-4" />
              <span className="hidden sm:inline">KUIS</span>
            </Link>
            
            <button
              onClick={toggleTheme}
              className="btn-brutal px-3 py-1.5 sm:px-4 sm:py-2 text-sm sm:text-base bg-brutal-primary text-white border-black dark:border-brutal-bg shadow-brutal-sm"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
