import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './app/routes'
import { AuthProvider } from './auth/AuthProvider'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  )
}