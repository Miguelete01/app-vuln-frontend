function Topbar({ openMenu, onToggleMenu, onNavigate, onLogout }) {
  return (
    <header className="topbar">
      <p className="brand">App Vulnerability</p>
      <nav>
        <button
          type="button"
          className="menu-trigger"
          onClick={() => onToggleMenu('catalogs')}
        >
          Catalogos
        </button>
        {openMenu === 'catalogs' && (
          <div className="submenu">
            <button
              type="button"
              onClick={() => {
                onNavigate('products')
              }}
            >
              Productos
            </button>
          </div>
        )}
      </nav>
      <nav>
        <button
          type="button"
          className="menu-trigger"
          onClick={() => onToggleMenu('admin')}
        >
          Administrador
        </button>
        {openMenu === 'admin' && (
          <div className="submenu">
            <button
              type="button"
              onClick={() => {
                onNavigate('users')
              }}
            >
              Usuarios
            </button>
          </div>
        )}
      </nav>
      <button type="button" className="danger" onClick={onLogout}>
        Cerrar sesion
      </button>
    </header>
  )
}

export default Topbar
