import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slider_img_1 from '@assets/img/slider/4/slider-1.png';

const JewelryBanner = () => {
  return (
    <>
      <style>{`
        @keyframes jyFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .jy-eyebrow  { animation: jyFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.12s both; }
        .jy-divider  { animation: jyFadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.28s both; }
        .jy-headline { animation: jyFadeUp 1.0s cubic-bezier(0.22,1,0.36,1) 0.28s both; }
        .jy-body     { animation: jyFadeUp 1.0s cubic-bezier(0.22,1,0.36,1) 0.44s both; }
        .jy-cta      { animation: jyFadeUp 1.0s cubic-bezier(0.22,1,0.36,1) 0.60s both; }
        .jy-image    { animation: jyFadeUp 1.4s cubic-bezier(0.22,1,0.36,1) 0.05s both; }

        .jy-section {
          position: relative;
          background-color: #FBE9D4;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .jy-image-wrap {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          pointer-events: none;
          z-index: 0;
        }
        .jy-image-wrap img {
          height: 88vh !important;
          width: auto !important;
          object-fit: contain;
          object-position: bottom center;
          opacity: 0.55;
        }

        .jy-content-wrap {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 120px 0 100px;
        }

        .jy-eyebrow-text {
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #AF7A54;
          margin-bottom: 24px;
        }

        .jy-rule {
          display: block;
          width: 36px;
          height: 1px;
          background-color: #AF7A54;
          margin: 0 auto 36px;
        }

        .jy-title {
          font-family: 'Cormorant Garamond', 'EB Garamond', Georgia, serif;
          font-size: clamp(40px, 5.5vw, 76px);
          font-weight: 300;
          line-height: 1.08;
          letter-spacing: 0.01em;
          color: #1A1A1A;
          margin-bottom: 36px;
        }

        .jy-subtitle {
          font-family: 'Jost', sans-serif;
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.06em;
          line-height: 1.9;
          color: #8C6E62;
          max-width: 320px;
          margin: 0 auto 52px;
        }

        .jy-btn {
          display: inline-block;
          font-family: 'Jost', sans-serif;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #FFFFFF;
          background-color: #AF7A54;
          border: none;
          padding: 17px 48px;
          text-decoration: none;
          transition: background-color 0.35s ease, letter-spacing 0.35s ease;
        }
        .jy-btn:hover {
          background-color: #9A6944;
          color: #FFFFFF;
          letter-spacing: 0.28em;
        }

        @media (max-width: 767px) {
          .jy-image-wrap img {
            height: 55vh !important;
            opacity: 0.35;
          }
          .jy-content-wrap {
            padding: 100px 0 80px;
          }
        }
      `}</style>

      <section className="jy-section">

        {/* Hero image — full-height, bottom-anchored, editorial fade */}
        <div className="jy-image-wrap jy-image">
          <Image
            src={slider_img_1}
            alt="Joyerialis — Colección"
            priority
          />
        </div>

        {/* Editorial typography block — centered */}
        <div className="jy-content-wrap">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-11 col-md-8 col-lg-6 col-xl-5 text-center">

                <p className="jy-eyebrow-text jy-eyebrow">JOYERIALIS</p>

                <h1 className="jy-title jy-headline">
                  Elegancia que<br />trasciende<br />el tiempo
                </h1>

                <span className="jy-rule jy-divider" />

                <p className="jy-subtitle jy-body">
                  Piezas diseñadas para acompañar los momentos más importantes de tu vida.
                </p>

                <div className="jy-cta">
                  <Link href="/shop" className="jy-btn">
                    Explorar Colección
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>

      </section>
    </>
  );
};

export default JewelryBanner;
