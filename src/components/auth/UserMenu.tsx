'use client'

import React, { useState } from 'react'
import { useAuth } from './AuthProvider'
import styles from './UserMenu.module.css'

export const UserMenu: React.FC = () => {
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleSignOut = async () => {
    setIsLoggingOut(true)
    await signOut()
    setIsLoggingOut(false)
    setIsOpen(false)
  }

  const getUserDisplayName = () => {
    return user?.email || 'User'
  }

  const getUserInitial = () => {
    const email = user?.email || ''
    return email.charAt(0).toUpperCase()
  }

  return (
    <div className={styles.userMenu}>
      <button 
        className={styles.userButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className={styles.avatar}>
          {getUserInitial()}
        </div>
        <span className={styles.userName}>
          {getUserDisplayName()}
        </span>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none"
        >
          <path 
            d="M4 6L8 10L12 6" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>
            <div className={styles.userEmail}>
              {user?.email}
            </div>
            <div className={styles.userRole}>
              Administrator
            </div>
          </div>
          
          <div className={styles.divider}></div>
          
          <button 
            className={styles.signOutButton}
            onClick={handleSignOut}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <div className={styles.loadingSpinner}></div>
                Signing out...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path 
                    d="M6 14H3C2.73478 14 2.48043 13.8946 2.29289 13.7071C2.10536 13.5196 2 13.2652 2 13V3C2 2.73478 2.10536 2.48043 2.29289 2.29289C2.48043 2.10536 2.73478 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  />
                </svg>
                Sign Out
              </>
            )}
          </button>
        </div>
      )}

      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

export default UserMenu 