import { initialUserForm } from './user.constants'

function UsersView({
  userForm,
  setUserForm,
  userMessage,
  userError,
  userLoading,
  users,
  onSubmit,
  onReload,
  onEdit,
  onDelete,
}) {
  return (
    <section className="panel">
      <h2>CRUD de usuarios</h2>
      <form className="form grid" onSubmit={onSubmit}>
        <label>
          Usuario
          <input
            type="text"
            value={userForm.username}
            onChange={(event) => setUserForm((prev) => ({ ...prev, username: event.target.value }))}
            required
          />
        </label>
        <label>
          Correo
          <input
            type="email"
            value={userForm.email}
            onChange={(event) => setUserForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
        </label>
        <label>
          Contrasena
          <input
            type="password"
            value={userForm.password}
            onChange={(event) => setUserForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder={userForm.id ? 'Solo si deseas cambiarla' : ''}
            required={!userForm.id}
          />
        </label>
        <label>
          Rol
          <input
            type="text"
            value={userForm.role}
            onChange={(event) => setUserForm((prev) => ({ ...prev, role: event.target.value }))}
            required
          />
        </label>
        <div className="row-actions">
          <button type="submit">{userForm.id ? 'Actualizar usuario' : 'Crear usuario'}</button>
          {userForm.id && (
            <button type="button" className="secondary" onClick={() => setUserForm(initialUserForm)}>
              Cancelar edicion
            </button>
          )}
          <button type="button" className="secondary" onClick={onReload}>
            Recargar lista
          </button>
        </div>
        {userMessage && <p className="success">{userMessage}</p>}
        {userError && <p className="error">{userError}</p>}
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {userLoading && (
              <tr>
                <td colSpan="5">Cargando usuarios...</td>
              </tr>
            )}
            {!userLoading && users.length === 0 && (
              <tr>
                <td colSpan="5">No hay usuarios.</td>
              </tr>
            )}
            {!userLoading &&
              users.map((user) => {
                const id = user.id ?? user.userId
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{user.username ?? user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td className="inline-actions">
                      <button type="button" className="secondary" onClick={() => onEdit(user)}>
                        Editar
                      </button>
                      <button type="button" className="danger" onClick={() => onDelete(id)}>
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default UsersView
