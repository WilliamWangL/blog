import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Sun, Moon, Menu, X, Palette } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

type Theme = 'minimal-light' | 'minimal-dark' | 'organic'

export default function Layout({ children }: LayoutProps) {
  const [theme, setTheme] = useState<Theme>('organic')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const root = document.documentElement
    // Remove all theme classes
    root.classList.remove('dark', 'theme-organic')
    
    if (theme === 'minimal-dark') {
      root.classList.add('dark')
    } else if (theme === 'organic') {
      root.classList.add('theme-organic')
    }
  }, [theme])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Beauty', href: '/category/beauty' },
    { name: 'Living', href: '/category/living' },
    { name: 'Travel', href: '/category/travel' },
    { name: 'Appliances', href: '/category/3c-appliances' },
    { name: 'Fashion', href: '/category/fashion' },
  ]

  return (
    <div className="min-h-screen transition-colors duration-500">
      <nav className="fixed top-0 w-full z-50 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800/50 nav-glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link to="/" className="text-xl font-light tracking-widest uppercase gradient-text">
                TechReview
              </Link>
              <div className="hidden md:flex space-x-8 ml-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors nav-link"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4 relative">
              <form onSubmit={handleSearch} className="hidden sm:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-48 pl-10 pr-4 py-2 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-gray-400 dark:focus:border-gray-500 transition-colors search-input"
                  />
                  <Search className="absolute left-4 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </form>
              
              {/* Theme Switcher */}
              <div className="relative">
                <button
                  onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors theme-btn"
                  title="Switch Theme"
                >
                  <Palette className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                
                {isThemeMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 backdrop-blur-xl theme-dropdown">
                    <button
                      onClick={() => { setTheme('minimal-light'); setIsThemeMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'minimal-light' ? 'text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800`}
                    >
                      Minimal Light (极简白)
                    </button>
                    <button
                      onClick={() => { setTheme('minimal-dark'); setIsThemeMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'minimal-dark' ? 'text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800`}
                    >
                      Editorial Dark (杂志黑)
                    </button>
                    <button
                      onClick={() => { setTheme('organic'); setIsThemeMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm ${theme === 'organic' ? 'text-primary-600 font-medium' : 'text-gray-600 dark:text-gray-300'} hover:bg-gray-50 dark:hover:bg-gray-800`}
                    >
                      Wabi-Sabi (现代原木)
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
      <main className="pt-16 min-h-screen main-content">{children}</main>
    </div>
  )
}