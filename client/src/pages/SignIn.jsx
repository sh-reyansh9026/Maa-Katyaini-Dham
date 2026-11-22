import React from 'react'
import { SignIn } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'

const SignInPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-fg font-serif text-xl font-bold">म</span>
            </div>
            <span className="font-serif text-xl font-semibold text-text">Maa Katyaini Dham</span>
          </Link>
        </div>
        <SignIn />
        <p className="text-center text-muted mt-4">
          Don't have an account? <Link to="/sign-up" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}

export default SignInPage
