import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../../app/ThemeProvider'
import { useAuth, useUser, useClerk } from '@clerk/clerk-react'
import { changeLanguage } from '../../lib/i18n'

const Header = () => {
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const { signOut } = useClerk()
  const location = useLocation()

  const isAdmin = user?.publicMetadata?.role === 'admin'
 

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/rooms', label: 'Rooms' },
    { path: '/halls', label: 'Mandaps' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ]

  const handleLanguageChange = () => {
    const newLang = i18n.language === 'en' ? 'hi' : 'en'
    changeLanguage(newLang)
  }

  const handleSignOut = async () => {
    try {
      console.log('Attempting to sign out...')
      await signOut()
      console.log('Sign out successful')
    } catch (error) {
      console.error('Sign out error:', error)
      alert('Failed to sign out. Please try again.')
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-fg font-serif text-xl font-bold">म</span>
            </div>
            <span className="font-serif text-xl font-semibold text-text">Maa Katyaini Dham</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.path ? 'text-primary' : 'text-muted'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language toggle */}
            <button
              onClick={handleLanguageChange}
              className="text-sm font-medium text-muted hover:text-primary transition-colors"
            >
              {i18n.language === 'en' ? 'हिंदी' : 'English'}
            </button>

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-surface-alt hover:bg-border transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </button>

            {/* Auth buttons */}
            {isSignedIn ? (
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-sm font-medium text-muted hover:text-primary transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  to="/my-bookings"
                  className="text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleSignOut}
                  className="text-sm font-medium text-muted hover:text-primary transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="px-4 py-2 bg-primary text-primary-fg rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
