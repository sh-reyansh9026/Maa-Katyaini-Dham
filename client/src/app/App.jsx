import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import { I18nextProvider } from 'react-i18next'
import Router from './Router'
import ThemeProvider from './ThemeProvider'
import i18n from '../lib/i18n'

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
    >
      <I18nextProvider i18n={i18n}>
        <ThemeProvider>
          <BrowserRouter>
            <Router />
          </BrowserRouter>
        </ThemeProvider>
      </I18nextProvider>
    </ClerkProvider>
  )
}

export default App
