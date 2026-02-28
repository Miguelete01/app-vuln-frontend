import { useEffect, useState } from 'react'
import { endpoints } from '../config/api'
import { initialUserForm } from '../features/users/user.constants'
import { apiRequest } from '../services/apiClient'

export function useUsers({ authHeaders, canLoad }) {
  const [users, setUsers] = useState([])
  const [userForm, setUserForm] = useState(initialUserForm)
  const [userLoading, setUserLoading] = useState(false)
  const [userError, setUserError] = useState('')
  const [userMessage, setUserMessage] = useState('')

  useEffect(() => {
    if (!canLoad) {
      return
    }
    void fetchUsers()
  }, [canLoad])

  async function fetchUsers() {
    setUserLoading(true)
    setUserError('')

    try {
      const payload = await apiRequest(endpoints.users, {
        method: 'GET',
        headers: authHeaders,
      })
      setUsers(Array.isArray(payload) ? payload : payload?.items ?? [])
    } catch (error) {
      setUserError(error.message || 'No se pudieron cargar los usuarios.')
    } finally {
      setUserLoading(false)
    }
  }

  async function handleSubmitUser(event) {
    event.preventDefault()
    setUserMessage('')
    setUserError('')

    const isEditing = Boolean(userForm.id)
    const path = isEditing ? `${endpoints.users}/${userForm.id}` : endpoints.users
    const method = isEditing ? 'PUT' : 'POST'

    const payload = {
      username: userForm.username,
      email: userForm.email,
      role: userForm.role,
    }

    if (userForm.password) {
      payload.password = userForm.password
    }

    try {
      await apiRequest(path, {
        method,
        headers: authHeaders,
        body: JSON.stringify(payload),
      })
      setUserForm(initialUserForm)
      setUserMessage(isEditing ? 'Usuario actualizado.' : 'Usuario creado.')
      await fetchUsers()
    } catch (error) {
      setUserError(error.message || 'No se pudo guardar el usuario.')
    }
  }

  function handleEditUser(user) {
    setUserForm({
      id: user.id ?? user.userId ?? '',
      username: user.username ?? user.userName ?? '',
      email: user.email ?? '',
      password: '',
      role: user.role ?? '',
    })
  }

  async function handleDeleteUser(id) {
    setUserMessage('')
    setUserError('')

    try {
      await apiRequest(`${endpoints.users}/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setUserMessage('Usuario eliminado.')
      await fetchUsers()
    } catch (error) {
      setUserError(error.message || 'No se pudo eliminar el usuario.')
    }
  }

  function resetUsers() {
    setUsers([])
    setUserForm(initialUserForm)
    setUserLoading(false)
    setUserError('')
    setUserMessage('')
  }

  return {
    users,
    userForm,
    userLoading,
    userError,
    userMessage,
    setUserForm,
    fetchUsers,
    handleSubmitUser,
    handleEditUser,
    handleDeleteUser,
    resetUsers,
  }
}
