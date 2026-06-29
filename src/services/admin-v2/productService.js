import productsData from '@/data/joyerialis-products.json';

// Simulación de base de datos en memoria para soportar CRUD completo en admin-v2
let productsCollection = [...(productsData?.data || [])];

export const productService = {
  async getAll({ search = '', category = '', status = '', sortBy = 'title', sortDir = 'asc', page = 1, limit = 10 } = {}) {
    let result = [...productsCollection];

    // Filtrado por búsqueda
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.title?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q));
    }

    // Filtrado por categoría
    if (category) {
      result = result.filter(p => p.category === category || p.category_name === category);
    }

    // Filtrado por estado
    if (status) {
      if (status === 'active') result = result.filter(p => p.status !== 'inactive');
      if (status === 'low_stock') result = result.filter(p => p.quantity < 15);
    }

    // Ordenamiento
    result.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    // Paginación
    const total = result.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedData = result.slice(startIndex, startIndex + limit);

    return {
      data: paginatedData,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id) {
    const product = productsCollection.find(p => p.id === id || p._id === id);
    if (!product) throw new Error('Producto no encontrado');
    return { ...product };
  },

  async create(productData) {
    const newProduct = {
      id: `prod-${Date.now()}`,
      sku: productData.sku || `SKU-${Date.now()}`,
      title: productData.title,
      price: Number(productData.price || 0),
      quantity: Number(productData.quantity || 0),
      category: productData.category || 'general',
      status: productData.status || 'active',
      img: productData.img || '/assets/img/product/default.jpg',
      seoTitle: productData.seoTitle || productData.title,
      seoDesc: productData.seoDesc || '',
      createdAt: new Date().toISOString(),
    };
    productsCollection = [newProduct, ...productsCollection];
    return newProduct;
  },

  async update(id, productData) {
    const index = productsCollection.findIndex(p => p.id === id || p._id === id);
    if (index === -1) throw new Error('Producto no encontrado');
    productsCollection[index] = { ...productsCollection[index], ...productData };
    return productsCollection[index];
  },

  async delete(id) {
    productsCollection = productsCollection.filter(p => p.id !== id && p._id !== id);
    return { success: true };
  },

  async bulkUpdateStatus(ids, status) {
    productsCollection = productsCollection.map(p => {
      if (ids.includes(p.id) || ids.includes(p._id)) {
        return { ...p, status };
      }
      return p;
    });
    return { success: true };
  },

  async bulkDelete(ids) {
    productsCollection = productsCollection.filter(p => !ids.includes(p.id) && !ids.includes(p._id));
    return { success: true };
  }
};
