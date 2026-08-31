import Head from "next/head";

const SEO = ({ pageTitle, description, image, canonical, jsonLd, noIndex = true }) => {
  const title = pageTitle || "Jolie Jewelry";
  const metaDescription = description || "Jolie Jewelry — Bonita y Única. Porque tu esencia es tu mejor joya.";

  return (
    <Head>
      <title>{title}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={metaDescription} />
      <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:site_name" content="Jolie Jewelry" />
      {image && <meta property="og:image" content={image} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <link rel="icon" type="image/svg+xml" href="https://raw.githubusercontent.com/equantum-py/joyerialis/main/public/assets/img/logo/jolie-logo-3.svg" />
      <link rel="shortcut icon" href="https://raw.githubusercontent.com/equantum-py/joyerialis/main/public/assets/img/logo/jolie-logo-3.svg" />
    </Head>
  );
};

export default SEO;
