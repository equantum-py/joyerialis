let couponsCollection = [
  { id: 'CUP-001', code: 'VERANO2026', discount: 15, discountType: 'percentage', startDate: '2026-06-01', endDate: '2026-07-31', usageLimit: 100, usedCount: 24, status: 'Activo', minAmount: 500 },
  { id: 'CUP-002', code: 'BIENVENIDA10', discount: 10, discountType: 'percentage', startDate: '2026-01-01', endDate: '2026-12-31', usageLimit: 500, usedCount: 142, status: 'Activo', minAmount: 0 },
  { id: 'CUP-003', code: 'HOTSALE50', discount: 50, discountType: 'fixed', startDate: '2026-05-10', endDate: '2026-05-17', usageLimit: 50, usedCount: 50, status: 'Inactivo', minAmount: 200 },
];

export const couponService = {
  async getAll({ search = '', status = '', page = 1, limit = 10 } = {}) {
    let result = [...couponsCollection];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(c => c.code.toLowerCase().includes(q));
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
    const coupon = couponsCollection.find(c => c.id === id);
    if (!coupon) throw new Error('Cupón no encontrado');
    return { ...coupon };
  },

  async create(data) {
    const newCoupon = {
      id: `CUP-${Date.now().toString().slice(-3)}`,
      code: data.code.toUpperCase(),
      discount: Number(data.discount || 0),
      discountType: data.discountType || 'percentage',
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      endDate: data.endDate || '2026-12-31',
      usageLimit: Number(data.usageLimit || 100),
      usedCount: 0,
      status: data.status || 'Activo',
      minAmount: Number(data.minAmount || 0),
    };
    couponsCollection = [newCoupon, ...couponsCollection];
    return newCoupon;
  },

  async update(id, data) {
    const index = couponsCollection.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Cupón no encontrado');
    couponsCollection[index] = { ...couponsCollection[index], ...data };
    return couponsCollection[index];
  },

  async delete(id) {
    couponsCollection = couponsCollection.filter(c => c.id !== id);
    return { success: true };
  }
};
