import React from 'react';
import Image from 'next/image';
import bannerImg from '@assets/img/banner/4/banner-1.jpg';

const JewelryMiddleBanner = () => (
  <section style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
    <div style={{ position: 'relative', height: '480px', width: '100%' }}>
      <Image
        src={bannerImg}
        alt="Joyerialis Collection"
        fill
        style={{ objectFit: 'cover', objectPosition: 'center top' }}
        priority={false}
      />
    </div>
  </section>
);

export default JewelryMiddleBanner;
