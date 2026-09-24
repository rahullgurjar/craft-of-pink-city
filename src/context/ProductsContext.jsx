import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { products as defaultProducts } from '../data/products'

const ProductsContext = createContext(null)

const CUSTOM_PRODUCTS_KEY = 'cpc_custom_products_v2'
const PRODUCT_OVERRIDES_KEY = 'cpc_product_overrides_v2'
const DELETED_PRODUCT_IDS_KEY = 'cpc_deleted_product_ids_v2'

export function ProductsProvider({ children }) {
  // 1. Custom staff-created products
  const [customProducts, setCustomProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_PRODUCTS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // 2. Overrides for any default product (e.g. edited price, title, badge, stock)
  const [productOverrides, setProductOverrides] = useState(() => {
    try {
      const saved = localStorage.getItem(PRODUCT_OVERRIDES_KEY)
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  // 3. Deleted/Archived product IDs
  const [deletedProductIds, setDeletedProductIds] = useState(() => {
    try {
      const saved = localStorage.getItem(DELETED_PRODUCT_IDS_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_PRODUCTS_KEY, JSON.stringify(customProducts))
    } catch (e) {
      console.error('Failed to save custom products:', e)
    }
  }, [customProducts])

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(productOverrides))
    } catch (e) {
      console.error('Failed to save product overrides:', e)
    }
  }, [productOverrides])

  useEffect(() => {
    try {
      localStorage.setItem(DELETED_PRODUCT_IDS_KEY, JSON.stringify(deletedProductIds))
    } catch (e) {
      console.error('Failed to save deleted product IDs:', e)
    }
  }, [deletedProductIds])

  // Combine and compute active catalog
  const allProducts = useMemo(() => {
    const combined = []

    // Process default products
    defaultProducts.forEach((p) => {
      if (deletedProductIds.includes(p.id)) return
      const override = productOverrides[p.id] || {}
      combined.push({
        ...p,
        ...override,
        isCustom: false,
      })
    })

    // Add custom products
    customProducts.forEach((cp) => {
      if (deletedProductIds.includes(cp.id)) return
      const override = productOverrides[cp.id] || {}
      combined.push({
        ...cp,
        ...override,
        isCustom: true,
      })
    })

    return combined
  }, [customProducts, productOverrides, deletedProductIds])

  // Storefront active products (excludes out_of_stock if hidden or explicitly marked draft)
  const products = useMemo(() => {
    return allProducts.filter((p) => p.status !== 'draft' && p.status !== 'hidden')
  }, [allProducts])

  // Dynamic category list
  const categories = useMemo(() => {
    const cats = new Set(['All'])
    products.forEach((p) => {
      if (p.category) cats.add(p.category)
    })
    return Array.from(cats)
  }, [products])

  // ADD NEW PRODUCT
  const addProduct = (newProd) => {
    const slug = newProd.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const id = `custom-${slug}-${Date.now().toString().slice(-4)}`

    const formattedProduct = {
      id,
      name: newProd.name.trim(),
      category: newProd.category || 'Quilted Bags',
      price: newProd.price.startsWith('₹') ? newProd.price : `₹${newProd.price}`,
      image: newProd.image || 'pouch-sunshine-yellow.jpg',
      badge: newProd.badge || 'New Arrival',
      description: newProd.description || 'Handcrafted Jaipuri pure cotton accessory.',
      details: newProd.details || ['100% Pure Quilted Cotton', 'Hand Block Printed in Jaipur'],
      dimensions: newProd.dimensions || 'Standard Artisan Size',
      status: newProd.status || 'in_stock',
      createdAt: new Date().toISOString(),
      isCustom: true,
    }

    setCustomProducts((prev) => [formattedProduct, ...prev])
    return formattedProduct
  }

  // UPDATE EXISTING PRODUCT
  const updateProduct = (id, updatedFields) => {
    // Check if it's in customProducts
    const isCustom = customProducts.some((p) => p.id === id)

    if (isCustom) {
      setCustomProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
      )
    } else {
      setProductOverrides((prev) => ({
        ...prev,
        [id]: { ...(prev[id] || {}), ...updatedFields },
      }))
    }
  }

  // DELETE / ARCHIVE PRODUCT
  const deleteProduct = (id) => {
    setDeletedProductIds((prev) => [...new Set([...prev, id])])
  }

  // RESTORE / UN-DELETE
  const restoreProduct = (id) => {
    setDeletedProductIds((prev) => prev.filter((item) => item !== id))
  }

  // RESET CATALOG TO DEFAULTS
  const resetCatalogToDefaults = () => {
    setCustomProducts([])
    setProductOverrides({})
    setDeletedProductIds([])
    localStorage.removeItem(CUSTOM_PRODUCTS_KEY)
    localStorage.removeItem(PRODUCT_OVERRIDES_KEY)
    localStorage.removeItem(DELETED_PRODUCT_IDS_KEY)
  }

  return (
    <ProductsContext.Provider
      value={{
        products,
        allProducts,
        categories,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        resetCatalogToDefaults,
        customProductsCount: customProducts.length,
      }}
    >
      {children}
    </ProductsContext.Provider>
  )
}

export function useProducts() {
  const context = useContext(ProductsContext)
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider')
  }
  return context
}
