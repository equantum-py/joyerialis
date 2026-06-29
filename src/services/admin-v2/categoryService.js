import categoriesData from '@/data/joyerialis-categories.json';

let categoriesCollection = [...(categoriesData?.result || [])];

export const categoryService = {
  async getAll({ search = '', sortBy = 'name', sortDir = 'asc' } = {}) {
    let result = [...categoriesCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q));
    }

    result.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return {
      data: result,
      total: result.length
    };
  },

  async getById(id) {
    const cat = categoriesCollection.find(c => c.id === id || c._id === id);
    if (!cat) throw new Error('Categoría no encontrada');
    return { ...cat };
  },

  async create(data) {
    const newCat = {
      id: `cat-${Date.now()}`,
      name: data.name,
      slug: data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      parent: data.parent || 'Ninguna',
      order: Number(data.order || 1),
      img: data.img || '/assets/img/category/default.jpg',
      seoTitle: data.seoTitle || data.name,
      seoDesc: data.seoDesc || '',
      status: data.status || 'active',
      createdAt: new Date().toISOString()
    };
    categoriesCollection = [newCat, ...categoriesCollection];
    return newCat;
  },

  async update(id, data) {
    const index = categoriesCollection.findIndex(c => c.id === id || c._id === id);
    if (index === -1) throw new Error('Categoría no encontrada');
    categoriesCollection[index] = { ...categoriesCollection[index], ...data };
    return categoriesCollection[index];
  },

  async delete(id) {
    categoriesCollection = categoriesCollection.filter(c => c.id !== id && c._id !== id);
    return { success: true };
  }
};
