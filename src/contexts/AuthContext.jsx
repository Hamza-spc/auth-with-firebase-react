import { useEffect } from 'react'
import { auth } from '../firebase'
import { useDispatch, useSelector } from 'react-redux'
import { setUser, clearUser } from '../features/authSlice'

// Custom hook to access auth state and actions
export function useAuth() {
  const user = useSelector((state) => state.auth.user)
  const dispatch = useDispatch()

  // Auth functions
  function signup(email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
  }

  function login(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
  }

  function logout() {
    return auth.signOut()
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email)
  }

  // For updateEmail and updatePassword, use auth.currentUser directly
  function updateEmail(email) {
    return auth.currentUser.updateEmail(email)
  }

  function updatePassword(password) {
    return auth.currentUser.updatePassword(password)
  }

  // Listen for auth state changes and update Redux with serializable data
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        }))
      } else {
        dispatch(clearUser())
      }
    })
    return unsubscribe
  }, [dispatch])

  return {
    currentUser: user,
    signup,
    login,
    logout,
    resetPassword,
    updateEmail,
    updatePassword,
  }
}
