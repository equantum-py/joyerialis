import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function serializeProduct(product) {
  if (!product) return null;
  const images = [...(product.images || [])].sort((a, b) => a.sortOrder - b.sortOrder);
  const mainImage = product.img || images[0]?.url || '';

  return {
    ...product,
    price: Number(product.price),
    category: product.categoryName || product.category?.name || 'General',
    img: mainImage,
    images: images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt || '',
      sortOrder: image.sortOrder,
    })),
  };
}

function parseNumber(value, fieldName) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new Error(`${fieldName} debe ser numérico.`);
  return number;
}

function normalizeImages(images = [], mainImageUrl = '') {
  if (!Array.isArray(images)) return [];
  const seen = new Set();
  const normalized = [];

  images.forEach((image) => {
    if (!image?.url || seen.has(image.url)) return;
    seen.add(image.url);
    normalized.push({
      url: image.url,
      alt: image.alt || '',
      sortOrder: normalized.length,
    });
  });

  if (mainImageUrl) {
    const mainIndex = normalized.findIndex((image) => image.url === mainImageUrl);
    if (mainIndex > 0) {
      const [mainImage] = normalized.splice(mainIndex, 1);
      normalized.unshift(mainImage);
    }
  }

  return normalized.map((image, sortOrder) => ({ ...image, sortOrder }));
}

function validateProductPayload(data, { partial = false } = {}) {
  const errors = {};

  if (!partial || data.title !== undefined) {
    if (!String(data.title || '').trim()) errors.title = 'El nombre es obligatorio.';
  }

  if (!partial || data.price !== undefined) {
    if (data.price === undefined || data.price === '') errors.price = 'El precio es obligatorio.';
    else if (!Number.isFinite(Number(data.price))) errors.price = 'El precio debe ser numérico.';
  }

  if (!partial || data.quantity !== undefined) {
    if (data.quantity === undefined || data.quantity === '') errors.quantity = 'La cantidad es obligatoria.';
    else if (!Number.isInteger(Number(data.quantity))) errors.quantity = 'La cantidad debe ser numérica.';
  }

  if (!partial || data.status !== undefined) {
    if (!String(data.status || '').trim()) errors.status = 'El estado es obligatorio.';
  }

  const slug = String(data.slug || '').trim() || slugify(data.title);
  if (!partial && !slug) errors.slug = 'El slug es obligatorio.';

  if (Object.keys(errors).length) {
    const error = new Error('Datos de producto inválidos.');
    error.statusCode = 400;
    error.details = errors;
    throw error;
  }

  return slug;
}

function buildProductData(data, slug) {
  const productData = {};

  if (data.sku !== undefined) productData.sku = String(data.sku || '').trim() || null;
  if (data.title !== undefined) productData.title = String(data.title).trim();
  if (slug) productData.slug = slug;
  if (data.price !== undefined) productData.price = new Prisma.Decimal(parseNumber(data.price, 'El precio'));
  if (data.quantity !== undefined) productData.quantity = parseInt(parseNumber(data.quantity, 'La cantidad'), 10);
  if (data.status !== undefined) productData.status = String(data.status).trim();
  if (data.category !== undefined || data.categoryName !== undefined) productData.categoryName = String(data.category || data.categoryName || 'General');
  if (data.img !== undefined) productData.img = data.img || null;
  if (data.description !== undefined) productData.description = data.description || '';
  if (data.seoTitle !== undefined) productData.seoTitle = data.seoTitle || data.title || '';
  if (data.seoDesc !== undefined) productData.seoDesc = data.seoDesc || '';

  return productData;
}

async function logProductAction(action, product, details = {}) {
  try {
    await prisma.activityLog.create({
      data: {
        action,
        details: JSON.stringify(details),
        userName: 'Sistema ERP',
        target: product?.title || product?.id || 'Producto',
        module: 'Productos',
      },
    });
  } catch (error) {
    // El CRUD no debe fallar si el log no se registra.
  }
}

function handlePrismaError(error, res) {
  if (error.code === 'P2002') {
    return res.status(409).json({ message: 'Ya existe un producto con el mismo SKU o slug.' });
  }
  if (error.code === 'P2025') {
    return res.status(404).json({ message: 'Producto no encontrado.' });
  }

  return res.status(error.statusCode || 500).json({
    message: error.message || 'Error de servidor.',
    errors: error.details,
  });
}

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { id, search = '', category = '', status = '', sortBy = 'title', sortDir = 'asc', page = 1, limit = 10 } = req.query;
      const include = { images: true, category: true };

      if (id) {
        const product = await prisma.product.findFirst({
          where: { OR: [{ id }, { sku: id }, { slug: id }] },
          include,
        });
        if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
        return res.status(200).json(serializeProduct(product));
      }

      const where = {
        AND: [
          search ? { OR: [{ title: { contains: search, mode: 'insensitive' } }, { sku: { contains: search, mode: 'insensitive' } }] } : {},
          category ? { categoryName: category } : {},
          status === 'active' ? { status: 'active' } : {},
          status === 'inactive' ? { status: 'inactive' } : {},
          status === 'low_stock' ? { quantity: { lt: 15 } } : {},
        ],
      };

      const allowedSortFields = ['title', 'sku', 'price', 'quantity', 'status', 'categoryName', 'createdAt', 'updatedAt'];
      const orderField = sortBy === 'category' ? 'categoryName' : sortBy;
      const orderBy = allowedSortFields.includes(orderField) ? { [orderField]: sortDir === 'desc' ? 'desc' : 'asc' } : { title: 'asc' };
      const pageNum = Math.max(Number(page) || 1, 1);
      const limitNum = Math.max(Number(limit) || 10, 1);

      const [items, total] = await prisma.$transaction([
        prisma.product.findMany({ where, include, orderBy, skip: (pageNum - 1) * limitNum, take: limitNum }),
        prisma.product.count({ where }),
      ]);

      return res.status(200).json({
        data: items.map(serializeProduct),
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      });
    }

    if (method === 'POST') {
      const data = req.body || {};
      const slug = validateProductPayload(data);
      const images = normalizeImages(data.images, data.img);
      const img = data.img || images[0]?.url || null;

      const newProduct = await prisma.product.create({
        data: {
          ...buildProductData({ ...data, img }, slug),
          seoTitle: data.seoTitle || data.title,
          seoDesc: data.seoDesc || '',
          images: images.length ? { create: images } : undefined,
        },
        include: { images: true, category: true },
      });

      await logProductAction('CREATE_PRODUCT', newProduct, { id: newProduct.id });
      return res.status(201).json(serializeProduct(newProduct));
    }

    if (method === 'PUT') {
      const { id, action, ids, status, ...updateData } = req.body || {};

      if (action === 'bulkUpdateStatus') {
        if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Debe seleccionar productos.' });
        if (!status) return res.status(400).json({ message: 'Debe indicar un estado.' });
        const result = await prisma.product.updateMany({ where: { id: { in: ids } }, data: { status } });
        return res.status(200).json({ success: true, count: result.count });
      }

      if (!id) return res.status(400).json({ message: 'Debe indicar el producto a actualizar.' });
      const slug = validateProductPayload(updateData, { partial: true });
      const images = normalizeImages(updateData.images, updateData.img);
      const img = updateData.img || images[0]?.url || null;

      const updated = await prisma.$transaction(async (tx) => {
        await tx.productImage.deleteMany({ where: { productId: id } });
        return tx.product.update({
          where: { id },
          data: {
            ...buildProductData({ ...updateData, img }, slug),
            images: images.length ? { create: images } : undefined,
          },
          include: { images: true, category: true },
        });
      });

      await logProductAction('UPDATE_PRODUCT', updated, { id: updated.id });
      return res.status(200).json(serializeProduct(updated));
    }

    if (method === 'DELETE') {
      const { id, action, ids } = req.body || {};

      if (action === 'bulkDelete') {
        if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ message: 'Debe seleccionar productos.' });
        const result = await prisma.product.deleteMany({ where: { id: { in: ids } } });
        return res.status(200).json({ success: true, count: result.count });
      }

      if (!id) return res.status(400).json({ message: 'Debe indicar el producto a eliminar.' });
      const deleted = await prisma.product.delete({ where: { id } });
      await logProductAction('DELETE_PRODUCT', deleted, { id: deleted.id });
      return res.status(200).json({ success: true, id: deleted.id });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return handlePrismaError(error, res);
  }
}
