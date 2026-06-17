import React, { useState } from 'react';
import Image from 'next/image';
import Slider from 'react-slick';
import Link from 'next/link';
// internal
import slider_img_1 from '@assets/img/slider/4/slider-1.png';
import slider_img_2 from '@assets/img/slider/4/slider-2.png';
import { ArrowNextTwo, ArrowPrevTwo } from '@/svg';

const slider_data = [
  { subtitle: 'New Collection', title: 'Crafted for\nher moment', img: slider_img_1 },
  { subtitle: 'Timeless Design', title: 'Worn with\nintention', img: slider_img_2 },
];

const JewelryBanner = () => {
  const [sliderRef, setSliderRef] = useState(null);

  const slider_setting = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    centerMode: false,
  };

  return (
    <section className="tp-slider-area p-relative z-index-1 fix">
      <Slider {...slider_setting} ref={(slider) => setSliderRef(slider)} className="tp-slider-active-4">
        {slider_data.map((item, i) => (
          <div key={i} className="tp-slider-item-4 tp-slider-height-4 p-relative d-flex align-items-center">
            <div className="tp-slider-thumb-4">
              <Image src={item.img} alt="slider img" priority={i === 0} />
            </div>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-xl-6 col-lg-8 col-md-10 text-center">
                  <div className="tp-slider-content-4 p-relative z-index-1">
                    <span>{item.subtitle}</span>
                    <h3 className="tp-slider-title-4" style={{ whiteSpace: 'pre-line' }}>{item.title}</h3>
                    <div className="tp-slider-btn-4">
                      <Link href="/shop" className="tp-btn tp-btn-luxury">Discover Now</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>

      <button className="tp-slider-3-button-prev slick-arrow" onClick={() => sliderRef?.slickPrev()}>
        <ArrowPrevTwo />
      </button>
      <button className="tp-slider-3-button-next slick-arrow" onClick={() => sliderRef?.slickNext()}>
        <ArrowNextTwo />
      </button>
    </section>
  );
};

export default JewelryBanner;
