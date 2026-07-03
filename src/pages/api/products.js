import { prisma } from '@/lib/prisma';

const PUBLIC_PRODUCT_STATUS = 'active';

function toSlug(value) {
  return String(value || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getPublicStatus(product) {
  const status = String(product.status || '').toLowerCase();

  if (status !== PUBLIC_PRODUCT_STATUS || product.quantity <= 0) {
    return 'out-of-stock';
  }

  return 'in-stock';
}

function serializeProduct(product) {
  const categoryName = product.categoryName || product.category?.name || 'General';
  const categorySlug = product.category?.slug || toSlug(categoryName);
  const price = Number(product.price || 0);

  return {
    _id: product.id,
    id: product.id,
    sku: product.sku || '',
    title: product.title,
    slug: product.slug,
    price,
    discount: Number(product.discount || 0),
    description: product.description || '',
    status: getPublicStatus(product),
    adminStatus: product.status || '',
    quantity: product.quantity || 0,
    img: product.img || '/assets/img/product/product-placeholder.svg',
    categoryName,
    category: {
      name: categoryName,
      slug: categorySlug,
    },
    parent: categoryName,
    children: categoryName,
    productType: product.category?.productType || 'jewelry',
    brand: {
      name: product.brandName || 'Joyerialis',
    },
    brandName: product.brandName || 'Joyerialis',
    tags: product.tags?.length ? product.tags : [categoryName],
    reviews: [],
    rating: product.rating || 0,
    topSeller: Boolean(product.topSeller),
    new: Boolean(product.new),
    featured: Boolean(product.featured),
    imageURLs: product.img
      ? [{ img: product.img, color: { name: 'Principal' } }]
      : [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
}

function applyQueryFlags(where, query) {
  if (query.new === 'true') where.new = true;
  if (query.topSeller === 'true') where.topSeller = true;
  if (query.featured === 'true') where.featured = true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { id, slug, search = '', category = '', limit = '100' } = req.query;
    const take = Math.min(Math.max(Number(limit) || 100, 1), 100);

    const baseWhere = {
      status: PUBLIC_PRODUCT_STATUS,
      quantity: { gt: 0 },
    };

    if (id || slug) {
      const lookup = String(id || slug);
      const product = await prisma.product.findFirst({
        where: {
          AND: [
            baseWhere,
            {
              OR: [{ id: lookup }, { slug: lookup }, { sku: lookup }],
            },
          ],
        },
        include: { category: true },
      });

      if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
      return res.status(200).json(serializeProduct(product));
    }

    const where = {
      AND: [
        baseWhere,
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { sku: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { categoryName: category } : {},
      ],
    };

    applyQueryFlags(where.AND[0], req.query);

    const products = await prisma.product.findMany({
      where,
      include: { category: true },
      orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      take,
    });

    return res.status(200).json({
      data: products.map(serializeProduct),
      total: products.length,
    });
  } catch (error) {
    console.error('[api/products] Public products error', {
      name: error.name,
      code: error.code,
      message: error.message,
    });

    return res.status(500).json({
      data: [],
      total: 0,
      message: 'No se pudieron cargar los productos.',
    });
  }
}
