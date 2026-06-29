let currentSettings = {
  companyName: 'Joyerialis S.A.',
  supportEmail: 'soporte@joyerialis.com',
  phone: '+54 9 11 5555-4444',
  address: 'Av. Alvear 1890, Buenos Aires',
  currency: 'USD ($)',
  taxRate: 21,
  seoTitle: 'Joyerialis - Joyería Fina y Exclusiva',
  seoDesc: 'Descubre el catálogo más exclusivo de anillos, collares y pulseras de alta gama.',
  logo: '/assets/img/logo/logo.png',
  favicon: '/assets/img/logo/favicon.png',
  paymentMethods: ['Tarjeta de Crédito', 'Stripe', 'Transferencia Bancaria'],
  emailNotifications: true,
};

export const settingService = {
  async getSettings() {
    return { ...currentSettings };
  },

  async updateSettings(data) {
    currentSettings = { ...currentSettings, ...data };
    return { ...currentSettings };
  }
};
