import Head from "next/head";

const SEO = ({ pageTitle, description, image, canonical, jsonLd, noIndex = true }) => (
  <>
    <Head>
      <title>{pageTitle && `${pageTitle} - Joyerialis`}</title>
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="description" content={description || "Joyerialis"} />
      <meta name="robots" content={noIndex ? "noindex, follow" : "index, follow"} />
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
      {pageTitle && <meta property="og:title" content={`${pageTitle} - Joyerialis`} />}
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {jsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
      <link rel="icon" href="/favicon.png" />
    </Head>
  </>
);

export default SEO;
