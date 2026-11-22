import React from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>404 - Page Not Found - Maa Katyaini Dham</title>
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="font-display text-6xl font-bold text-text mb-4">404</h1>
          <p className="text-xl text-muted mb-8">Page not found</p>
          <Link
            to="/"
            className="px-6 py-3 bg-primary text-primary-fg rounded-lg font-medium hover:bg-primary-hover transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
