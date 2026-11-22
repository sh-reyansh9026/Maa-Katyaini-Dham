import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'

const AdminLayout = () => {
  const { isSignedIn, isLoaded } = useAuth()
  const { user } = useUser()
  const location = useLocation()

  const isAdmin = user?.publicMetadata?.role === 'admin'

  if (!isSignedIn || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-text mb-4">Access Denied</h1>
          <p className="text-muted mb-8">You don't have permission to access this page.</p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  const adminNavItems = [
    { path: '/admin', label: 'Dashboard' },
    { path: '/admin/bookings', label: 'Bookings' },
    { path: '/admin/rooms', label: 'Rooms' },
    { path: '/admin/halls', label: 'Mandaps' },
    { path: '/admin/availability', label: 'Availability' },
    { path: '/admin/settings', label: 'Settings' },
  ]

  return (
    <div className="min-h-screen flex bg-bg text-text">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border flex-shrink-0">
        <div className="p-6">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-fg font-serif text-xl font-bold">म</span>
            </div>
            <span className="font-serif text-lg font-semibold text-text">Admin</span>
          </Link>
        </div>
        <nav className="px-4">
          {adminNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors mb-1 ${
                location.pathname === item.path
                  ? 'bg-primary text-primary-fg'
                  : 'text-muted hover:bg-surface-alt hover:text-text'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout
