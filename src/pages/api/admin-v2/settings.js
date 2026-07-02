import { prisma } from '@/lib/prisma';

const defaultSettings = {
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

function mapSettings(settingsDb) {
  const mapped = { ...defaultSettings };

  settingsDb.forEach((setting) => {
    try {
      mapped[setting.key] = JSON.parse(setting.value);
    } catch {
      mapped[setting.key] = setting.value;
    }
  });

  return mapped;
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      try {
        const settingsDb = await prisma.setting.findMany();
        if (settingsDb && settingsDb.length > 0) {
          return res.status(200).json(mapSettings(settingsDb));
        }
      } catch (e) {
        return res.status(500).json({
          message: 'Error al obtener configuraciones desde la base de datos',
          error: e.message || 'Prisma error',
        });
      }

      return res.status(200).json(defaultSettings);
    }

    if (method === 'PUT') {
      const data = req.body;
      try {
        for (const key of Object.keys(data)) {
          const val = typeof data[key] === 'object' ? JSON.stringify(data[key]) : String(data[key]);
          await prisma.setting.upsert({
            where: { key },
            update: { value: val },
            create: { key, value: val }
          });
        }
        const savedSettings = await prisma.setting.findMany();
        return res.status(200).json(mapSettings(savedSettings));
      } catch (e) {
        return res.status(500).json({
          message: 'Error al guardar configuraciones en la base de datos',
          error: e.message || 'Prisma error',
        });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
