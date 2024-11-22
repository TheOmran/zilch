import type { LoginInput } from '@/types/user'
import { create } from 'zustand'

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: LoginInput | null
  signIn: (user: LoginInput) => Promise<void>
  signOut: () => void
}

export const useAuth = create<AuthState>((set) => ({
  isAuthenticated: false,
  isLoading: false,
  user: null,
  signIn: async (user: LoginInput) => {
    set({ isLoading: true })

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      if (user) {
        set({
          isAuthenticated: true,
          user
        })
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },
  signOut: () => {
    set({
      isAuthenticated: false,
      user: null
    })
  }
}))
