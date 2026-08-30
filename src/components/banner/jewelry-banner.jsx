import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import slider_img_1 from '@assets/img/slider/4/slider-1.png';

const JewelryBanner = () => (
  <>
    <style>{`
      .jolie-hero { position:relative; min-height:560px; overflow:hidden; background:linear-gradient(90deg,#fff7f2 0%,#fae9df 43%,#f3dfd2 100%); display:flex; align-items:center; }
      .jolie-hero-media { position:absolute; right:0; top:0; width:58%; height:100%; }
      .jolie-hero-content { position:relative; z-index:2; width:100%; padding:90px 0; }
      .jolie-hero-title { font-family:'Cormorant Garamond',Georgia,serif; color:#704130; font-size:clamp(54px,6vw,82px); font-weight:400; line-height:.92; letter-spacing:-.02em; margin:0 0 24px; }
      .jolie-hero-title span { color:#c8795d; font-family:Georgia,serif; font-size:.75em; }
      .jolie-hero-copy { font-family:'Jost',sans-serif; color:#4f413c; font-size:18px; line-height:1.6; max-width:440px; margin-bottom:30px; }
      .jolie-hero-btn { display:inline-block; padding:14px 26px; border-radius:8px; background:#d98d6d; color:#fff; font-size:12px; font-weight:600; letter-spacing:.04em; text-transform:uppercase; }
      .jolie-hero-btn:hover { background:#b96e52; color:#fff; }
      .jolie-hero-dots { display:flex; gap:10px; margin-top:38px; }
      .jolie-hero-dot { width:10px; height:10px; border-radius:50%; background:#ead5ca; }
      .jolie-hero-dot.active { background:#d98d6d; }
      @media(max-width:767px){
        .jolie-hero { min-height:650px; align-items:flex-start; }
        .jolie-hero-media { top:auto; bottom:0; width:100%; height:52%; opacity:.92; }
        .jolie-hero-media:after { content:''; position:absolute; inset:0; background:linear-gradient(180deg,#fff7f2 0%,rgba(255,247,242,0) 45%); z-index:1; }
        .jolie-hero-content { padding:58px 0 300px; }
        .jolie-hero-title { font-size:54px; }
        .jolie-hero-copy { font-size:16px; max-width:330px; }
      }
    `}</style>
    <section className="jolie-hero">
      <div className="jolie-hero-media">
        <Image src={slider_img_1} alt="Jolie Jewelry colección" fill style={{objectFit:'cover',objectPosition:'center'}} priority />
      </div>
      <div className="jolie-hero-content">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 col-md-7">
              <h1 className="jolie-hero-title">La belleza<br/>de ser tú <span>♡</span></h1>
              <p className="jolie-hero-copy">Joyas delicadas y coloridas para expresar tu esencia en cada detalle.</p>
              <Link href="/shop" className="jolie-hero-btn">Descubrir colección</Link>
              <div className="jolie-hero-dots" aria-hidden="true"><i className="jolie-hero-dot active"/><i className="jolie-hero-dot"/><i className="jolie-hero-dot"/></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>
);

export default JewelryBanner;
