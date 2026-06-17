import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";

import HeaderFour from '@/layout/headers/header-4';
import JewelryBanner from '@/components/banner/jewelry-banner';
import FeatureAreaThree from '@/components/features/feature-area-3';

import InstagramAreaFour from '@/components/instagram/instagram-area-4';
import PopularProducts from '@/components/products/jewelry/popular-products';
import ProductArea from '@/components/products/jewelry/product-area';

import JewelryMiddleBanner from '@/components/banner/jewelry-middle-banner';

import JewelryCollectionBanner from '@/components/shop-banner/jewelry-collection-banner';

import FooterTwo from '@/layout/footers/footer-2';

export default function Home() {
return ( <Wrapper> <SEO pageTitle="Joyerialis" />

```
  <HeaderFour />

  <JewelryBanner />

  <FeatureAreaThree />

  <InstagramAreaFour />

  <PopularProducts />

  <ProductArea />

  <JewelryMiddleBanner />

  <JewelryCollectionBanner />

  <FooterTwo />
</Wrapper>
```

);
}
