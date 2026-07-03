-- Safe catalog expansion for public filters, variants, gallery metadata and SEO.
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "parentId" TEXT;
DO $$ BEGIN
  ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS "Brand" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'active',
  "metaTitle" TEXT,
  "metaDescription" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_name_key" ON "Brand"("name");
CREATE UNIQUE INDEX IF NOT EXISTS "Brand_slug_key" ON "Brand"("slug");

ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "subcategoryName" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "collectionName" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "canonicalSlug" TEXT;
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "brandId" TEXT;
DO $$ BEGIN
  ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

ALTER TABLE "ProductImage" ADD COLUMN IF NOT EXISTS "publicId" TEXT;

CREATE TABLE IF NOT EXISTS "ProductVariant" (
  "id" TEXT NOT NULL,
  "size" TEXT,
  "color" TEXT,
  "material" TEXT,
  "stock" INTEGER NOT NULL DEFAULT 0,
  "price" DECIMAL(10,2),
  "sku" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "productId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ProductVariant_sku_key" ON "ProductVariant"("sku");
DO $$ BEGIN
  ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
