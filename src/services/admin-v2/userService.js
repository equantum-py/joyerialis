let usersCollection = [
  { id: 'USR-001', name: 'Super Admin', email: 'super@joyerialis.com', role: 'SUPER_ADMIN', status: 'Activo', lastLogin: '2026-06-29 11:30' },
  { id: 'USR-002', name: 'Admin Pedidos', email: 'admin@joyerialis.com', role: 'ADMIN', status: 'Activo', lastLogin: '2026-06-28 15:45' },
  { id: 'USR-003', name: 'Editor Catálogo', email: 'editor@joyerialis.com', role: 'EDITOR', status: 'Activo', lastLogin: '2026-06-27 09:12' },
];

export const userService = {
  async getAll({ search = '', role = '', page = 1, limit = 10 } = {}) {
    let result = [...usersCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    if (role) {
      result = result.filter(u => u.role === role);
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
    const user = usersCollection.find(u => u.id === id);
    if (!user) throw new Error('Usuario no encontrado');
    return { ...user };
  },

  async create(data) {
    const newUser = {
      id: `USR-${Date.now().toString().slice(-3)}`,
      name: data.name,
      email: data.email,
      role: data.role || 'EDITOR',
      status: data.status || 'Activo',
      lastLogin: 'Nunca',
    };
    usersCollection = [newUser, ...usersCollection];
    return newUser;
  },

  async update(id, data) {
    const index = usersCollection.findIndex(u => u.id === id);
    if (index === -1) throw new Error('Usuario no encontrado');
    usersCollection[index] = { ...usersCollection[index], ...data };
    return usersCollection[index];
  },

  async delete(id) {
    usersCollection = usersCollection.filter(u => u.id !== id);
    return { success: true };
  }
};
