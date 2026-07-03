import React from 'react';
// internal
import SEO from '@/components/seo';
import HeaderTwo from '@/layout/headers/header-2';
import Footer from '@/layout/footers/footer';
import Wrapper from '@/layout/wrapper';
import ErrorMsg from '@/components/common/error-msg';
import { useGetProductQuery } from '@/redux/features/productApi';
import ProductDetailsBreadcrumb from '@/components/breadcrumb/product-details-breadcrumb';
import ProductDetailsArea from '@/components/product-details/product-details-area';
import PrdDetailsLoader from '@/components/loader/prd-details-loader';

const ProductDetailsPage = ({ query }) => {
  const { data: product, isLoading, isError } = useGetProductQuery(query.id);
  const canonicalPath = product?.canonicalSlug || product?.slug || product?._id;
  const canonicalUrl = canonicalPath ? `/product-details/${canonicalPath}` : undefined;
  const jsonLd = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.metaDescription || product.description,
        image: [product.img, ...(product.images || []).map((image) => image.url)].filter(Boolean),
        sku: product.sku || undefined,
        brand: { '@type': 'Brand', name: product.brandName || product.brand?.name || 'Joyerialis' },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'PYG',
          price: product.price,
          availability: product.status === 'in-stock' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          url: canonicalUrl,
        },
      }
    : null;
  // decide what to render
  let content = null;
  if (isLoading) {
    content = <PrdDetailsLoader loading={isLoading}/>;
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!isLoading && !isError && product) {
    content = (
      <>
        <ProductDetailsBreadcrumb category={product.category?.name || 'General'} title={product.title} />
        <ProductDetailsArea productItem={product} />
      </>
    );
  }
  return (
    <Wrapper>
      <SEO pageTitle={product?.metaTitle || product?.title || "Product Details"} description={product?.metaDescription} image={product?.ogImage || product?.img} canonical={canonicalUrl} jsonLd={jsonLd} noIndex={false} />
      <HeaderTwo style_2={true} />
      {content}
      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default ProductDetailsPage;

export const getServerSideProps = async (context) => {
  const { query } = context;

  return {
    props: {
      query,
    },
  };
};
