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

  const galleryImages = (product.images || []).map((image) => ({
    id: image.id,
    img: image.url,
    url: image.url,
    alt: image.alt || product.title,
    sortOrder: image.sortOrder,
    publicId: image.publicId || '',
  }));

  const price = Number(product.price || 0);
  const brandName = product.brandName || product.brand?.name || 'Joyerialis';
  const collectionName = product.collectionName || product.collections?.[0]?.name || '';

  return {
    _id: product.id,
    id: product.id,
    sku: product.sku || '',
    title: product.title,
    slug: product.slug,
    price,
    discount: Number(product.discount || 0),
    description: product.description || '',

    metaTitle: product.metaTitle || product.seoTitle || product.title,
    metaDescription: product.metaDescription || product.seoDesc || product.description || '',
    ogImage: product.ogImage || product.img || '/assets/img/product/product-placeholder.svg',
    canonicalSlug: product.canonicalSlug || product.slug,

    status: getPublicStatus(product),
    adminStatus: product.status || '',
    quantity: product.quantity || 0,
    img: product.img || '/assets/img/product/product-placeholder.svg',

    categoryName,
    subcategoryName: product.subcategoryName || '',
    collectionName,
    collectionSlug: product.collections?.[0]?.slug || toSlug(collectionName),

    category: {
      name: categoryName,
      slug: categorySlug,
    },

    parent: categoryName,
    children: product.subcategoryName || categoryName,
    productType: product.category?.productType || 'jewelry',

    brand: {
      name: brandName,
      slug: product.brand?.slug || toSlug(brandName),
    },
    brandName,

    tags: product.tags?.length ? product.tags : [categoryName],
    reviews: [],
    rating: product.rating || 0,
    topSeller: Boolean(product.topSeller),
    new: Boolean(product.new),
    featured: Boolean(product.featured),

    imageURLs: [
      ...(product.img
        ? [
            {
              img: product.img,
              url: product.img,
              color: { name: 'Principal' },
              alt: product.title,
              sortOrder: -1,
            },
          ]
        : []),
      ...galleryImages,
    ],

    images: galleryImages,

    variants: (product.variants || []).map((variant) => ({
      ...variant,
      price: variant.price === null || variant.price === undefined ? null : Number(variant.price),
    })),

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
    const {
      id,
      slug,
      search = '',
      category = '',
      subcategory = '',
      brand = '',
      collection = '',
      limit = '100',
    } = req.query;

    const take = Math.min(Math.max(Number(limit) || 100, 1), 100);

    const baseWhere = {
      status: PUBLIC_PRODUCT_STATUS,
      quantity: { gt: 0 },
    };

    applyQueryFlags(baseWhere, req.query);

    const include = {
      category: true,
      brand: true,
      collections: true,
      images: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
      variants: {
        orderBy: {
          sortOrder: 'asc',
        },
      },
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
        include,
      });

      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }

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
        subcategory ? { subcategoryName: subcategory } : {},
        brand ? { brandName: brand } : {},
        collection
          ? {
              OR: [
                { collectionName: collection },
                {
                  collections: {
                    some: {
                      OR: [{ slug: collection }, { name: collection }],
                    },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const products = await prisma.product.findMany({
      where,
      include,
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