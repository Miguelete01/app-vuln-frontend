import { API_BASE_URL } from '../../config/api'

function LoginView({ loginForm, setLoginForm, loginLoading, loginError, onSubmit }) {
  return (
    <section className="card login-card">
      <h1>Inicio de sesion</h1>
      <p className="muted">Conecta con el backend en {API_BASE_URL}</p>
      <form className="form" onSubmit={onSubmit}>
        <label>
          Usuario o correo
          <input
            type="text"
            value={loginForm.userOrEmail}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, userOrEmail: event.target.value }))}
            required
          />
        </label>
        <label>
          Contrasena
          <input
            type="password"
            value={loginForm.password}
            onChange={(event) => setLoginForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
        </label>
        <button type="submit" disabled={loginLoading}>
          {loginLoading ? 'Ingresando...' : 'Entrar'}
        </button>
        {loginError && <p className="error">{loginError}</p>}
      </form>
    </section>
  )
}

export default LoginView
