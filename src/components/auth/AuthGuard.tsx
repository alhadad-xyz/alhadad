'use client'

import React from 'react'
import { useAuth } from './AuthProvider'
import LoginForm from './LoginForm'
import styles from './AuthGuard.module.css'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ 
  children, 
  fallback 
}) => {
  const { user, loading } = useAuth()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>
          <div className={styles.spinner}></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show login form or custom fallback
  if (!user) {
    return fallback || <LoginForm />
  }

  // If authenticated, render protected content
  return <>{children}</>
}

export default AuthGuard 