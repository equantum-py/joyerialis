import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
// internal
import { CartTwo, Menu, Search, Wishlist } from '@/svg';
import Menus from './header-com/menus';
import useSticky from '@/hooks/use-sticky';
import SearchBar from './header-com/search-bar';
import OffCanvas from '@/components/common/off-canvas';
import useCartInfo from '@/hooks/use-cart-info';
import CartMiniSidebar from '@/components/common/cart-mini-sidebar';
import { openCartMini } from '@/redux/features/cartSlice';

const COPPER = '#AF7A54';
const BLUSH  = '#FBE9D4';

const badgeStyle = {
  position: 'absolute',
  top: '-6px',
  right: '-10px',
  display: 'inline-block',
  width: '16px',
  height: '16px',
  lineHeight: '16px',
  textAlign: 'center',
  borderRadius: '50%',
  backgroundColor: COPPER,
  color: '#FFFFFF',
  fontSize: '9px',
  fontWeight: '500',
  fontFamily: "'Jost', sans-serif",
  letterSpacing: 0,
};

// Shared base for every icon button / link
const iconBase = {
  color: '#2B2B2B',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  lineHeight: 1,
  position: 'relative',
  transition: 'color 0.25s ease',
};

const HeaderFour = () => {
  const [isSearchOpen, setIsSearchOpen]   = useState(false);
  const [isOffCanvasOpen, setIsCanvasOpen] = useState(false);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { quantity } = useCartInfo();
  const { sticky }   = useSticky();
  const dispatch     = useDispatch();

  return (
    <>
      <Head>
        {/* Wordmark font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        {/*
          Scoped style override — targets only #header-sticky descendants.
          Fixes menu-style-1 hover color (default is blue) → copper,
          and sets luxury typographic treatment on nav links.
        */}
        <style>{`
          /* Nav links: always dark, Jost, small-caps feel */
          #header-sticky .main-menu.menu-style-1 > nav > ul > li > a {
            font-family: 'Jost', sans-serif !important;
            font-weight: 400 !important;
            font-size: 11px !important;
            letter-spacing: 0.12em !important;
            text-transform: uppercase !important;
            color: #2B2B2B !important;
            padding: 22px 0 !important;
          }

          /* Dropdown caret */
          #header-sticky .main-menu.menu-style-1 > nav > ul > li.has-dropdown > a::after {
            color: #2B2B2B !important;
            font-size: 11px !important;
          }

          /* Hover: copper */
          #header-sticky .main-menu.menu-style-1 > nav > ul > li:hover > a {
            color: ${COPPER} !important;
          }
          #header-sticky .main-menu.menu-style-1 > nav > ul > li:hover > a::after {
            color: ${COPPER} !important;
          }

          /* Submenu links */
          #header-sticky .tp-submenu li a {
            font-family: 'Jost', sans-serif !important;
            font-weight: 300 !important;
            font-size: 12px !important;
            letter-spacing: 0.04em !important;
            text-transform: none !important;
            color: #555555 !important;
          }
          #header-sticky .tp-submenu li:hover > a {
            color: ${COPPER} !important;
          }

          /* Icon button hover */
          #header-sticky .jy-icon:hover {
            color: ${COPPER} !important;
          }
        `}</style>
      </Head>

      <header>
        <div
          id="header-sticky"
          className={`tp-header-area tp-header-sticky tp-header-transparent tp-header-height${sticky ? ' header-sticky' : ''}`}
          style={{
            backgroundColor: '#FFFFFF',
            borderBottom: `1px solid ${BLUSH}`,
            boxShadow: sticky ? '0px 2px 24px rgba(175, 122, 84, 0.08)' : 'none',
            transition: 'box-shadow 0.4s ease',
          }}
        >
          {/* Inner wrapper — controls horizontal rhythm */}
          <div style={{ padding: '0 48px' }}>
            <div className="container-fluid">
              <div className="row align-items-center" style={{ minHeight: '68px' }}>

                {/* ── LEFT  Navigation ─────────────────────────────────── */}
                <div className="col-xl-4 col-lg-4 d-none d-lg-flex align-items-center">
                  <div className="main-menu menu-style-1 p-relative">
                    <nav className="tp-main-menu-content">
                      <Menus />
                    </nav>
                  </div>
                </div>

                {/* ── CENTER  Wordmark ──────────────────────────────────── */}
                <div className="col-xl-4 col-lg-4 col-6 text-center">
                  <Link
                    href="/"
                    style={{
                      fontFamily: "'Cormorant Garamond', Garamond, Georgia, serif",
                      fontSize: '21px',
                      fontWeight: '300',
                      letterSpacing: '0.44em',
                      color: COPPER,
                      textDecoration: 'none',
                      display: 'inline-block',
                      lineHeight: 1,
                      // compensate trailing space created by letter-spacing
                      paddingRight: '0.44em',
                    }}
                  >
                    JOYERIALIS
                  </Link>
                </div>

                {/* ── RIGHT  Search / Wishlist / Cart ──────────────────── */}
                <div className="col-xl-4 col-lg-4 col-6">
                  <div
                    className="d-flex align-items-center justify-content-end"
                    style={{ gap: '24px' }}
                  >

                    {/* Search */}
                    <div className="d-none d-sm-block">
                      <button
                        onClick={() => setIsSearchOpen(true)}
                        type="button"
                        className="jy-icon"
                        style={iconBase}
                        aria-label="Buscar"
                      >
                        <Search />
                      </button>
                    </div>

                    {/* Wishlist */}
                    <div className="d-none d-sm-block">
                      <Link
                        href="/wishlist"
                        className="jy-icon"
                        style={iconBase}
                        aria-label="Lista de deseos"
                      >
                        <Wishlist />
                        {wishlist.length > 0 && (
                          <span style={badgeStyle}>{wishlist.length}</span>
                        )}
                      </Link>
                    </div>

                    {/* Cart */}
                    <div className="d-none d-sm-block">
                      <button
                        onClick={() => dispatch(openCartMini())}
                        type="button"
                        className="cartmini-open-btn jy-icon"
                        style={iconBase}
                        aria-label="Carrito"
                      >
                        <CartTwo />
                        {quantity > 0 && (
                          <span style={badgeStyle}>{quantity}</span>
                        )}
                      </button>
                    </div>

                    {/* Mobile — hamburger only */}
                    <div className="d-lg-none">
                      <button
                        onClick={() => setIsCanvasOpen(true)}
                        type="button"
                        className="jy-icon"
                        style={iconBase}
                        aria-label="Menú"
                      >
                        <Menu />
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </header>

      <SearchBar isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} />
      <CartMiniSidebar />
      <OffCanvas
        isOffCanvasOpen={isOffCanvasOpen}
        setIsCanvasOpen={setIsCanvasOpen}
        categoryType="jewelry"
      />
    </>
  );
};

export default HeaderFour;
