import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slider_img_1 from '@assets/img/slider/4/slider-1.png';

const JewelryBanner = () => (
  <>
    <style>{`
      .jy-hero {
        position: relative;
        background-color: #EDD5B5;
        min-height: 580px;
        overflow: hidden;
        display: flex;
        align-items: center;
      }
      .jy-hero-img-wrap {
        position: absolute;
        right: 0;
        top: 0;
        height: 100%;
        width: 62%;
        pointer-events: none;
      }
      .jy-hero-text {
        position: relative;
        z-index: 2;
        padding: 120px 0 100px;
        width: 100%;
      }
      .jy-hero-h1 {
        font-family: 'Cormorant Garamond', Georgia, serif;
        font-size: clamp(40px, 5.5vw, 74px);
        font-weight: 400;
        line-height: 1.1;
        color: #FFFFFF;
        text-shadow: 0 2px 18px rgba(0,0,0,0.10);
        margin-bottom: 40px;
      }
      .jy-discover-btn {
        display: inline-block;
        font-family: 'Jost', sans-serif;
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        color: #FFFFFF;
        background-color: #7A4B2A;
        padding: 15px 42px;
        text-decoration: none;
        border: none;
        transition: background-color 0.25s;
      }
      .jy-discover-btn:hover {
        background-color: #5C3318;
        color: #FFFFFF;
      }
      .jy-arr {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        z-index: 3;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: rgba(255,255,255,0.85);
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background 0.2s;
      }
      .jy-arr:hover { background: #fff; }
      .jy-arr-prev { left: 24px; }
      .jy-arr-next { right: 24px; }

      @media (max-width: 767px) {
        .jy-hero { min-height: 420px; }
        .jy-hero-img-wrap { width: 100%; opacity: 0.3; }
        .jy-hero-text { padding: 100px 0 80px; }
      }
    `}</style>

    <section className="jy-hero">
      <div className="jy-hero-img-wrap">
        <Image
          src={slider_img_1}
          alt="Joyerialis — Colección"
          fill
          style={{ objectFit: 'contain', objectPosition: 'right bottom' }}
          priority
        />
      </div>

      <div className="jy-hero-text">
        <div className="container">
          <div className="row">
            <div className="col-xl-5 col-lg-6 col-md-7">
              <h1 className="jy-hero-h1">
                Crafted for<br />her moment
              </h1>
              <Link href="/shop" className="jy-discover-btn">
                Discover Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button className="jy-arr jy-arr-prev" type="button" aria-label="Anterior">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="jy-arr jy-arr-next" type="button" aria-label="Siguiente">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  </>
);

export default JewelryBanner;
