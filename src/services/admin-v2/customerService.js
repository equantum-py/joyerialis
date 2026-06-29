let customersCollection = [
  { id: 'CUST-001', name: 'Carlos Mendoza', email: 'carlos@mendoza.com', phone: '+54 9 11 5521-9823', ordersCount: 4, totalSpent: 5120, status: 'Activo', address: 'Av. Libertador 1240, Buenos Aires', registered: '2025-03-12' },
  { id: 'CUST-002', name: 'María Fernanda Ruiz', email: 'maria@ruiz.com', phone: '+54 9 11 4432-1122', ordersCount: 2, totalSpent: 3420, status: 'Activo', address: 'Callao 850, Buenos Aires', registered: '2025-06-15' },
  { id: 'CUST-003', name: 'Gonzalo Silva', email: 'gonzalo@silva.com', phone: '+54 9 11 3321-9988', ordersCount: 1, totalSpent: 890, status: 'Inactivo', address: 'Belgrano 430, Córdoba', registered: '2025-11-20' },
  { id: 'CUST-004', name: 'Lucía Blanco', email: 'lucia@blanco.com', phone: '+54 9 11 2211-7766', ordersCount: 5, totalSpent: 12450, status: 'VIP', address: 'Mendoza 1540, Rosario', registered: '2024-08-05' },
];

export const customerService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    let result = [...customersCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }

    if (status) {
      result = result.filter(c => c.status === status);
    }

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
    const customer = customersCollection.find(c => c.id === id);
    if (!customer) throw new Error('Cliente no encontrado');
    return { ...customer };
  },

  async create(data) {
    const newCustomer = {
      id: `CUST-${Date.now().toString().slice(-3)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      ordersCount: 0,
      totalSpent: 0,
      status: data.status || 'Activo',
      address: data.address || '',
      registered: new Date().toISOString().split('T')[0],
    };
    customersCollection = [newCustomer, ...customersCollection];
    return newCustomer;
  },

  async update(id, data) {
    const index = customersCollection.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cliente no encontrado');
    customersCollection[index] = { ...customersCollection[index], ...data };
    return customersCollection[index];
  },

  async delete(id) {
    customersCollection = customersCollection.filter(c => c.id !== id);
    return { success: true };
  }
};
