import { initialProductForm } from './product.constants'

function ProductsView({
  productForm,
  setProductForm,
  searchQuery,
  setSearchQuery,
  productMessage,
  productError,
  productLoading,
  products,
  onSearch,
  onClearSearch,
  onSubmit,
  onReload,
  onEdit,
  onDelete,
}) {
  return (
    <section className="panel">
      <h2>CRUD de productos</h2>
      <form className="form" onSubmit={onSearch}>
        <label>
          Buscar por nombre o descripcion
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Ejemplo: galleta"
          />
        </label>
        <div className="row-actions">
          <button type="submit">Buscar</button>
          <button type="button" className="secondary" onClick={onClearSearch}>
            Limpiar
          </button>
        </div>
      </form>
      <form className="form grid" onSubmit={onSubmit}>
        <label>
          Nombre
          <input
            type="text"
            value={productForm.name}
            onChange={(event) => setProductForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
        </label>
        <label>
          Descripcion
          <input
            type="text"
            value={productForm.description}
            onChange={(event) => setProductForm((prev) => ({ ...prev, description: event.target.value }))}
            required
          />
        </label>
        <label>
          Precio
          <input
            type="number"
            min="0"
            step="0.01"
            value={productForm.price}
            onChange={(event) => setProductForm((prev) => ({ ...prev, price: event.target.value }))}
            required
          />
        </label>
        <label>
          Stock
          <input
            type="number"
            min="0"
            value={productForm.stock}
            onChange={(event) => setProductForm((prev) => ({ ...prev, stock: event.target.value }))}
            required
          />
        </label>
        <div className="row-actions">
          <button type="submit">{productForm.id ? 'Actualizar producto' : 'Crear producto'}</button>
          {productForm.id && (
            <button type="button" className="secondary" onClick={() => setProductForm(initialProductForm)}>
              Cancelar edicion
            </button>
          )}
          <button type="button" className="secondary" onClick={onReload}>
            Recargar lista
          </button>
        </div>
        {productMessage && <p className="success">{productMessage}</p>}
        {productError && <p className="error">{productError}</p>}
      </form>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Descripcion</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productLoading && (
              <tr>
                <td colSpan="6">Cargando productos...</td>
              </tr>
            )}
            {!productLoading && products.length === 0 && (
              <tr>
                <td colSpan="6">No hay productos.</td>
              </tr>
            )}
            {!productLoading &&
              products.map((product) => {
                const id = product.id ?? product.productId
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{product.name}</td>
                    <td>{product.desccription ?? product.description}</td>
                    <td>{product.price}</td>
                    <td>{product.stock}</td>
                    <td className="inline-actions">
                      <button type="button" className="secondary" onClick={() => onEdit(product)}>
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

export default ProductsView
