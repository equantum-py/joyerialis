import React, { useState } from 'react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { Search, CartTwo, Menu } from '@/svg';
import SearchBar from './header-com/search-bar';
import OffCanvas from '@/components/common/off-canvas';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import useCartInfo from '@/hooks/use-cart-info';
import { openCartMini } from '@/redux/features/cartSlice';

const LOGO_SRC = 'https://raw.githubusercontent.com/equantum-py/joyerialis/main/public/assets/img/logo/jolie-logo-2.svg';

const HeaderFour = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { quantity } = useCartInfo();
  const dispatch = useDispatch();

  return (
    <>
      <style>{`
        .jolie-topbar{height:38px;background:#f6ddd3;color:#795044;font:500 12px/38px 'Montserrat',sans-serif;letter-spacing:.02em}
        .jolie-topbar-inner{display:grid;grid-template-columns:1fr 1fr 1fr;align-items:center}.jolie-topbar-center{text-align:center}.jolie-topbar-right{text-align:right}
        .jolie-header{background:#fffdfb;border-bottom:1px solid #f1e2dc;position:relative;z-index:20}
        .jolie-header-inner{height:122px;display:grid;grid-template-columns:300px 1fr 220px;align-items:center;gap:24px;position:relative}
        .jolie-logo-link{display:inline-flex;align-items:center;justify-content:flex-start;text-decoration:none}
        .jolie-logo-img{display:block;width:220px;height:96px;object-fit:contain;object-position:left center}
        .jolie-nav{display:flex;justify-content:center;gap:34px;align-items:center}.jolie-nav a{font:500 12px/1 'Montserrat',sans-serif;letter-spacing:.15em;text-transform:uppercase;color:#5a3e32;text-decoration:none;position:relative;padding:50px 0}.jolie-nav a:hover,.jolie-nav a.active{color:#c98268}.jolie-nav a.active:after{content:'';position:absolute;left:0;right:0;bottom:34px;height:1px;background:#c98268}
        .jolie-actions{display:flex;justify-content:flex-end;align-items:center;gap:22px}.jolie-action{background:none;border:0;padding:0;color:#5a3e32;position:relative;display:inline-flex;cursor:pointer}.jolie-cart-count{position:absolute;right:-9px;top:-8px;background:#c98268;color:#fff;border-radius:50%;min-width:17px;height:17px;padding:0 4px;font:600 9px/17px 'Montserrat',sans-serif;text-align:center}.jolie-mobile-logo{display:none}
        @media(max-width:1199px){
          .jolie-header-inner{height:82px;display:flex;align-items:center;justify-content:space-between;position:relative;padding-left:14px;padding-right:14px}
          .jolie-nav,.jolie-desktop-logo{display:none}
          .jolie-mobile-logo{display:block;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:2}
          .jolie-mobile-logo .jolie-logo-link{display:flex;justify-content:center;align-items:center}
          .jolie-mobile-logo .jolie-logo-img{width:128px;height:54px;object-fit:contain}
          .jolie-actions{margin-left:auto;z-index:3}.jolie-menu-btn{display:inline-flex}
        }
        @media(min-width:1200px){.jolie-menu-btn{display:none!important}}
        @media(max-width:767px){.jolie-topbar-inner{grid-template-columns:1fr}.jolie-topbar-center,.jolie-topbar-right{display:none}.jolie-topbar{text-align:center}.jolie-header-inner{height:74px;padding-left:12px;padding-right:12px}.jolie-actions{gap:14px}.jolie-actions .hide-xs{display:none}.jolie-mobile-logo .jolie-logo-img{width:120px;height:48px}}
      `}</style>
      <div className="jolie-topbar"><div className="container jolie-topbar-inner"><div>▱ Envíos a todo Paraguay</div><div className="jolie-topbar-center">Joyas que expresan tu esencia ✦</div><div className="jolie-topbar-right">Instagram &nbsp;&nbsp; Facebook</div></div></div>
      <header className="jolie-header"><div className="container jolie-header-inner">
        <div className="jolie-desktop-logo"><Link href="/" className="jolie-logo-link"><img src={LOGO_SRC} alt="Jolie Jewelry" className="jolie-logo-img"/></Link></div>
        <nav className="jolie-nav" aria-label="Principal"><Link href="/" className="active">Inicio</Link><Link href="/shop">Tienda</Link><Link href="/shop?collection=true">Colecciones</Link><Link href="/about">Sobre Jolie</Link><Link href="/contact">Contacto</Link></nav>
        <div className="jolie-mobile-logo"><Link href="/" className="jolie-logo-link"><img src={LOGO_SRC} alt="Jolie Jewelry" className="jolie-logo-img"/></Link></div>
        <div className="jolie-actions"><button className="jolie-action hide-xs" onClick={()=>setIsSearchOpen(true)} aria-label="Buscar"><Search/></button><Link href="/profile" className="jolie-action hide-xs" aria-label="Cuenta"><span style={{fontSize:22}}>♡</span></Link><button className="jolie-action" onClick={()=>dispatch(openCartMini())} aria-label="Carrito"><CartTwo/>{quantity>0&&<span className="jolie-cart-count">{quantity}</span>}</button><button className="jolie-action jolie-menu-btn" onClick={()=>setIsCanvasOpen(true)} aria-label="Menú"><Menu/></button></div>
      </div></header>
      <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen}/><CartMiniSidebar/><OffCanvas isOffCanvasOpen={isOffCanvasOpen} setIsCanvasOpen={setIsCanvasOpen} categoryType="jewelry"/>
    </>
  );
};
export default HeaderFour;