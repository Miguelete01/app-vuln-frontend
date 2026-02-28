import { useEffect, useState } from 'react'
import { endpoints } from '../config/api'
import { initialProductForm } from '../features/products/product.constants'
import { apiRequest } from '../services/apiClient'

export function useProducts({ authHeaders, canLoad }) {
  const [products, setProducts] = useState([])
  const [productForm, setProductForm] = useState(initialProductForm)
  const [searchQuery, setSearchQuery] = useState('')
  const [productLoading, setProductLoading] = useState(false)
  const [productError, setProductError] = useState('')
  const [productMessage, setProductMessage] = useState('')

  useEffect(() => {
    if (!canLoad) {
      return
    }
    void fetchProducts()
  }, [canLoad])

  async function fetchProducts(query = searchQuery) {
    setProductLoading(true)
    setProductError('')

    try {
      const params = new URLSearchParams({ query: query ?? '' })
      const payload = await apiRequest(`${endpoints.productSearch}?${params.toString()}`, {
        method: 'GET',
        headers: authHeaders,
      })
      setProducts(Array.isArray(payload) ? payload : payload?.items ?? [])
    } catch (error) {
      setProductError(error.message || 'No se pudieron cargar los productos.')
    } finally {
      setProductLoading(false)
    }
  }

  async function handleSubmitProduct(event) {
    event.preventDefault()
    setProductMessage('')
    setProductError('')

    const isEditing = Boolean(productForm.id)
    const path = isEditing ? `${endpoints.products}/${productForm.id}` : endpoints.products
    const method = isEditing ? 'PUT' : 'POST'

    try {
      await apiRequest(path, {
        method,
        headers: authHeaders,
        body: JSON.stringify({
          name: productForm.name,
          desccription: productForm.description,
          price: Number(productForm.price),
          stock: Number(productForm.stock),
        }),
      })
      setProductForm(initialProductForm)
      setProductMessage(isEditing ? 'Producto actualizado.' : 'Producto creado.')
      await fetchProducts()
    } catch (error) {
      setProductError(error.message || 'No se pudo guardar el producto.')
    }
  }

  function handleEditProduct(product) {
    setProductForm({
      id: product.id ?? product.productId ?? '',
      name: product.name ?? '',
      description: product.desccription ?? product.description ?? '',
      price: String(product.price ?? ''),
      stock: String(product.stock ?? ''),
    })
  }

  async function handleDeleteProduct(id) {
    setProductMessage('')
    setProductError('')

    try {
      await apiRequest(`${endpoints.products}/${id}`, {
        method: 'DELETE',
        headers: authHeaders,
      })
      setProductMessage('Producto eliminado.')
      await fetchProducts()
    } catch (error) {
      setProductError(error.message || 'No se pudo eliminar el producto.')
    }
  }

  async function handleSearchSubmit(event) {
    event.preventDefault()
    await fetchProducts(searchQuery)
  }

  async function handleClearSearch() {
    setSearchQuery('')
    await fetchProducts('')
  }

  function resetProducts() {
    setProducts([])
    setProductForm(initialProductForm)
    setSearchQuery('')
    setProductLoading(false)
    setProductError('')
    setProductMessage('')
  }

  return {
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
  }
}
