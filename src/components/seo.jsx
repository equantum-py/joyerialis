import Head from "next/head";

const SITE_URL = "https://joliejewelry.vercel.app";
const DEFAULT_IMAGE = `${SITE_URL}/assets/img/slider/4/slider-1.png`;
const FAVICON = `${SITE_URL}/assets/img/logo/jolie-logo-mobile.svg`;

const SEO = ({ pageTitle, description, image, canonical, jsonLd, noIndex = true }) => {
  const title = pageTitle || "Jolie Jewelry | Bonita y Única";
  const metaDescription = description || "Jolie Jewelry — Bonita y Única. Porque tu esencia es tu mejor joya.";
  const socialImage = image || DEFAULT_IMAGE;
  const canonicalUrl = canonical || SITE_URL;

  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content="website" />
      <meta property="og:locale" content="es_PY" />
      <meta property="og:site_name" content="Jolie Jewelry" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImage} />
      <meta property="og:image:secure_url" content={socialImage} />
      <meta property="og:image:alt" content="Jolie Jewelry — Bonita y Única" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />

      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}

      <link rel="icon" type="image/svg+xml" href={FAVICON} />
      <link rel="shortcut icon" href={FAVICON} />
    </Head>
  );
};

export default SEO;
