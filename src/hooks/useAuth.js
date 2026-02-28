import axios from 'axios'
import { API_BASE_URL, endpoints } from '../config/api'
import { useState } from 'react'

export function useAuth() {
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken') ?? '')
  const [activeView, setActiveView] = useState(() => (localStorage.getItem('authToken') ? 'products' : 'login'))
  const [openMenu, setOpenMenu] = useState('')
  const [loginForm, setLoginForm] = useState({ userOrEmail: '', password: '' })
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  const isAuthenticated = Boolean(authToken)

  async function handleLogin(event) {
    event.preventDefault()
    setLoginError('')
    setLoginLoading(true)

    try {
      const { data: payload } = await axios.post(`${API_BASE_URL}${endpoints.login}`, loginForm, {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json',
        },
      })

      const token = payload?.token || payload?.accessToken || payload?.jwt
      if (!token) {
        throw new Error('El backend no devolvio token.')
      }

      localStorage.setItem('authToken', token)
      setAuthToken(token)
      setActiveView('products')
      setLoginForm({ userOrEmail: '', password: '' })
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.title ||
        error?.response?.data?.error ||
        error?.message ||
        'No fue posible iniciar sesion.'
      setLoginError(message)
    } finally {
      setLoginLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem('authToken')
    setAuthToken('')
    setOpenMenu('')
    setActiveView('login')
  }

  function handleNavigate(view) {
    setActiveView(view)
    setOpenMenu('')
  }

  function handleToggleMenu(menu) {
    setOpenMenu((prev) => (prev === menu ? '' : menu))
  }

  return {
    authToken,
    activeView,
    openMenu,
    loginForm,
    loginError,
    loginLoading,
    isAuthenticated,
    setLoginForm,
    handleLogin,
    logout,
    handleNavigate,
    handleToggleMenu,
  }
}
