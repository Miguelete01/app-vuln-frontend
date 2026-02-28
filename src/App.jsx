import { useMemo } from 'react'
import './App.css'
import Topbar from './components/layout/Topbar'
import LoginView from './features/auth/LoginView'
import ProductsView from './features/products/ProductsView'
import UsersView from './features/users/UsersView'
import { API_BASE_URL } from './config/api'
import { useAuth } from './hooks/useAuth'
import { useProducts } from './hooks/useProducts'
import { useUsers } from './hooks/useUsers'

function App() {
  const {
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
  } = useAuth()

  const authHeaders = useMemo(() => {
    const headers = { 'Content-Type': 'application/json' }
    if (authToken) {
      headers.Authorization = `Bearer ${authToken}`
    }
    return headers
  }, [authToken])

  const {
    products,
    productForm,
    searchQuery,
    productLoading,
    productError,
    productMessage,
    setProductForm,
    setSearchQuery,
    fetchProducts,
    handleSearchSubmit,
    handleClearSearch,
    handleSubmitProduct,
    handleEditProduct,
    handleDeleteProduct,
    resetProducts,
  } = useProducts({
    authHeaders,
    canLoad: isAuthenticated && activeView === 'products',
  })

  const {
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
  } = useUsers({
    authHeaders,
    canLoad: isAuthenticated && activeView === 'users',
  })

  function handleLogout() {
    logout()
    resetProducts()
    resetUsers()
  }

  return (
    <div className="app-shell">
      {isAuthenticated && (
        <Topbar
          openMenu={openMenu}
          onToggleMenu={handleToggleMenu}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      )}

      <main>
        {!isAuthenticated && (
          <LoginView
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            loginLoading={loginLoading}
            loginError={loginError}
            onSubmit={handleLogin}
          />
        )}
        {isAuthenticated && activeView === 'products' && (
          <ProductsView
            productForm={productForm}
            setProductForm={setProductForm}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            productMessage={productMessage}
            productError={productError}
            productLoading={productLoading}
            products={products}
            onSearch={handleSearchSubmit}
            onClearSearch={handleClearSearch}
            onSubmit={handleSubmitProduct}
            onReload={fetchProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
          />
        )}
        {isAuthenticated && activeView === 'users' && (
          <UsersView
            userForm={userForm}
            setUserForm={setUserForm}
            userMessage={userMessage}
            userError={userError}
            userLoading={userLoading}
            users={users}
            onSubmit={handleSubmitUser}
            onReload={fetchUsers}
            onEdit={handleEditUser}
            onDelete={handleDeleteUser}
          />
        )}
      </main>
      <div className="footer-note">
        <small>Base URL configurada: {API_BASE_URL}</small>
      </div>
    </div>
  )
}

export default App
