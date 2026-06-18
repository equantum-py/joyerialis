import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper';
// internal
import insta_1 from '@assets/img/instagram/4/instagram-1.jpg';
import insta_2 from '@assets/img/instagram/4/instagram-2.jpg';
import insta_3 from '@assets/img/instagram/4/instagram-3.jpg';
import insta_4 from '@assets/img/instagram/4/instagram-4.jpg';
import insta_5 from '@assets/img/instagram/4/instagram-5.jpg';
import insta_6 from '@assets/img/instagram/4/instagram-6.jpg';

const category_data = [
  { id: 1, name: 'Aretes',    link: '/shop?category=earrings',  img: insta_1 },
  { id: 2, name: 'Anillos',   link: '/shop?category=rings',     img: insta_2 },
  { id: 3, name: 'Collares',  link: '/shop?category=necklaces', img: insta_3 },
  { id: 4, name: 'Pulseras',  link: '/shop?category=bracelets', img: insta_4 },
  { id: 5, name: 'Conjuntos', link: '/shop',                    img: insta_5 },
  { id: 6, name: 'Medallas',  link: '/shop?category=medals',    img: insta_6 },
];

const CategoryCard = ({ item }) => (
  <Link href={item.link}>
    <div className="tp-instagram-item-2 tp-category-card w-img">
      <Image src={item.img} alt={item.name} style={{ width: '100%', height: '100%' }} />
      <div className="tp-category-label">
        <span>{item.name}</span>
      </div>
    </div>
  </Link>
);

const InstagramAreaFour = () => {
  return (
    <section className="tp-instagram-area tp-instagram-style-4 pt-60 pb-10">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-4 text-center mb-40">
              <h3 className="tp-section-title-4">Comprar por categoría</h3>
              <p>Encuentra la joya perfecta para cada ocasión.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: Swiper horizontal — 2 categorías visibles, scroll táctil */}
      <div
  className="d-block d-md-none"
  style={{
    paddingLeft: '12px',
    paddingRight: '12px',
    width: '100%',
    overflowX: 'hidden'
  }}
>
        <Swiper
  modules={[FreeMode]}
  slidesPerView={2}
  spaceBetween={8}
  freeMode={true}
  grabCursor={true}
  style={{ overflow: 'hidden' }}
>
          {category_data.map(item => (
            <SwiperSlide key={item.id}>
              <CategoryCard item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop / Tablet: Grid original sin modificar */}
      <div className="d-none d-md-block">
        <div className="container-fluid pl-20 pr-20">
          <div className="row row-cols-lg-6 row-cols-sm-2 gx-2 gy-2 gy-lg-0">
            {category_data.map(item => (
              <div className="col" key={item.id}>
                <CategoryCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstagramAreaFour;
