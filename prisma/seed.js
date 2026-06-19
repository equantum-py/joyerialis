const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

// Helper para convertir textos en slugs URL seguros
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD') // Eliminar tildes y diacríticos
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-') // Cambiar espacios por guiones
    .replace(/[^\w\-]+/g, '') // Eliminar caracteres especiales
    .replace(/\-\-+/g, '-') // Colapsar guiones repetidos
    .replace(/^-+/, '') // Quitar guiones al inicio
    .replace(/-+$/, ''); // Quitar guiones al final
}

async function main() {
  console.log('Iniciando proceso de sembrado (seed) de base de datos...');

  // 1. Limpiar base de datos (evita duplicados al re-ejecutar)
  console.log('Limpiando tablas de base de datos...');
  await prisma.setting.deleteMany({});
  await prisma.heroSlide.deleteMany({});
  await prisma.homeSection.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.collection.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.activityLog.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Sembrar usuarios administrativos iniciales
  console.log('Insertando usuarios administrativos...');
  // Contraseña encriptada en Bcrypt para "admin123"
  const passwordHash = '$2a$10$tPxG/K5F.nU1s64R7K98zOshh32W.cK0h6vX8WqJ2TCOpZlVw1vK.';
  
  await prisma.user.createMany({
    data: [
      {
        id: 'usr-001',
        name: 'Super Admin',
        email: 'super@joyerialis.com',
        password: passwordHash,
        role: 'SUPER_ADMIN'
      },
      {
        id: 'usr-002',
        name: 'Administrador',
        email: 'admin@joyerialis.com',
        password: passwordHash,
        role: 'ADMIN'
      },
      {
        id: 'usr-003',
        name: 'Editor Catálogo',
        email: 'editor@joyerialis.com',
        password: passwordHash,
        role: 'EDITOR'
      }
    ]
  });

  // 3. Sembrar configuraciones base iniciales
  console.log('Insertando configuraciones de tienda...');
  await prisma.setting.createMany({
    data: [
      { key: 'store_name', value: 'Joyerialis' },
      { key: 'store_email', value: 'contacto@joyerialis.com' },
      { key: 'currency', value: 'CLP' },
      { key: 'wa_enabled', value: 'true' },
      { key: 'wa_number', value: '+56912345678' },
      { key: 'wa_default_message', value: 'Hola, estoy interesado en este producto de Joyerialis:' }
    ]
  });

  // 4. Leer JSONs de datos estáticos
  console.log('Cargando archivos JSON locales...');
  const categoriesPath = path.join(__dirname, '..', 'src', 'data', 'joyerialis-categories.json');
  const productsPath = path.join(__dirname, '..', 'src', 'data', 'joyerialis-products.json');

  const categoriesRaw = JSON.parse(fs.readFileSync(categoriesPath, 'utf8'));
  const productsRaw = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  const categoriesData = categoriesRaw.result || [];
  const productsData = productsRaw.data || [];

  // 5. Sembrar Categorías
  console.log(`Migrando ${categoriesData.length} categorías...`);
  const categoryIdMap = new Map(); // Para mapear los IDs del JSON a los registros creados

  for (const cat of categoriesData) {
    const slug = slugify(cat.parent || 'categoria');
    const createdCategory = await prisma.category.create({
      data: {
        id: cat._id,
        name: cat.parent,
        slug: slug,
        productType: cat.productType || 'jewelry',
        img: cat.img || null
      }
    });
    categoryIdMap.set(cat._id, createdCategory.id);
  }

  // 6. Sembrar Productos e Imágenes asociadas
  console.log(`Migrando ${productsData.length} productos...`);
  let productsCount = 0;

  for (const prod of productsData) {
    const baseSlug = slugify(prod.title || 'producto');
    // Para asegurar que el slug sea único agregamos el ID corto al final
    const slug = `${baseSlug}-${prod._id}`;

    // Determinar categoría asociada
    const jsonCategoryId = prod.category?._id;
    const dbCategoryId = categoryIdMap.has(jsonCategoryId) ? categoryIdMap.get(jsonCategoryId) : null;

    // Crear el producto en la base de datos
    const createdProduct = await prisma.product.create({
      data: {
        id: prod._id,
        sku: prod.sku || null,
        title: prod.title,
        slug: slug,
        price: prod.price || 0,
        discount: prod.discount || 0,
        description: prod.description || '',
        status: prod.status === 'in-stock' ? 'in-stock' : 'out-of-stock',
        rating: prod.rating || 4.5,
        quantity: prod.quantity || 0,
        topSeller: prod.topSeller || false,
        new: prod.new || false,
        featured: prod.featured || false,
        tags: prod.tags || [],
        brandName: prod.brand?.name || 'Joyerialis',
        categoryId: dbCategoryId
      }
    });

    // Crear imágenes asociadas del producto (tabla normalizada)
    // 1. Guardar la imagen principal
    if (prod.img) {
      await prisma.productImage.create({
        data: {
          url: prod.img,
          alt: `${prod.title} - Imagen Principal`,
          sortOrder: 0,
          productId: createdProduct.id
        }
      });
    }

    // 2. Guardar imágenes extras si existen en "imageURLs"
    if (Array.isArray(prod.imageURLs)) {
      let sortOrder = 1;
      for (const imgUrl of prod.imageURLs) {
        if (imgUrl && imgUrl !== prod.img) {
          await prisma.productImage.create({
            data: {
              url: imgUrl,
              alt: `${prod.title} - Imagen Adicional ${sortOrder}`,
              sortOrder: sortOrder,
              productId: createdProduct.id
            }
          });
          sortOrder++;
        }
      }
    }

    productsCount++;
  }

  console.log(`Migración completada con éxito.`);
  console.log(`- ${productsCount} productos migrados.`);
  console.log(`- ${categoryIdMap.size} categorías migradas.`);
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución del sembrado:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
