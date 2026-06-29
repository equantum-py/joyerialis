import { prisma } from '@/lib/prisma';
import categoriesData from '@/data/joyerialis-categories.json';

export default async function handler(req, res) {
  const { method } = req;

  try {
    if (method === 'GET') {
      const { id, search = '', sortBy = 'name', sortDir = 'asc' } = req.query;

      if (id) {
        try {
          const cat = await prisma.category.findFirst({
            where: { OR: [{ id }, { slug: id }] }
          });
          if (cat) return res.status(200).json(cat);
        } catch (e) {}
        const fallback = categoriesData?.result?.find(c => c.id === id || c._id === id);
        if (!fallback) return res.status(404).json({ message: 'Categoría no encontrada' });
        return res.status(200).json(fallback);
      }

      let items = [];
      try {
        items = await prisma.category.findMany();
      } catch (e) {}

      if (!items || items.length === 0) {
        items = [...(categoriesData?.result || [])];
      }

      if (search) {
        const q = search.toLowerCase();
        items = items.filter(c => c.name?.toLowerCase().includes(q) || c.slug?.toLowerCase().includes(q));
      }

      items.sort((a, b) => {
        let valA = a[sortBy] || '';
        let valB = b[sortBy] || '';
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortDir === 'asc' ? -1 : 1;
        if (valA > valB) return sortDir === 'asc' ? 1 : -1;
        return 0;
      });

      return res.status(200).json({
        data: items,
        total: items.length
      });
    }

    if (method === 'POST') {
      const data = req.body;
      const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
      try {
        const newCat = await prisma.category.create({
          data: {
            name: data.name,
            slug: slug,
            parent: data.parent || 'Ninguna',
            order: Number(data.order || 1),
            img: data.img || '/assets/img/category/default.jpg',
            metaTitle: data.seoTitle || data.name,
            metaDescription: data.seoDesc || '',
            status: data.status || 'active',
          }
        });
        return res.status(201).json(newCat);
      } catch (e) {
        const newCat = {
          id: `cat-${Date.now()}`,
          name: data.name,
          slug: slug,
          parent: data.parent || 'Ninguna',
          order: Number(data.order || 1),
          img: data.img || '/assets/img/category/default.jpg',
          seoTitle: data.seoTitle || data.name,
          seoDesc: data.seoDesc || '',
          status: data.status || 'active',
          createdAt: new Date().toISOString()
        };
        return res.status(201).json(newCat);
      }
    }

    if (method === 'PUT') {
      const { id, ...data } = req.body;
      try {
        const updated = await prisma.category.update({
          where: { id },
          data
        });
        return res.status(200).json(updated);
      } catch (e) {
        return res.status(200).json({ id, ...data });
      }
    }

    if (method === 'DELETE') {
      const { id } = req.body;
      try {
        await prisma.category.delete({ where: { id } });
      } catch (e) {}
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Server error' });
  }
}
