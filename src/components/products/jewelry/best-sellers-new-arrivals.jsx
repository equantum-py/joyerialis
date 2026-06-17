import React, { useState } from 'react';
import Link from 'next/link';
import { useGetProductTypeQuery } from '@/redux/features/productApi';
import { formatGs } from '@/utils/price';
import ErrorMsg from '@/components/common/error-msg';

const BEST_TABS = ['Lab', 'Anillos', 'Pulseras', 'Aros', 'Collares', 'Piercing'];
const NEW_TABS = ['Piercing', 'Colores', 'Lab', 'Anillos', 'Aros'];

const CompactCard = ({ product, badgeLabel, badgeBg }) => {
  const { _id, img, title, price } = product;
  return (
    <Link href={`/product-details/${_id}`} style={{ textDecoration: 'none', display: 'block', color: 'inherit' }}>
      <div style={{ overflow: 'hidden' }}>
        <div style={{ position: 'relative', paddingBottom: '100%', overflow: 'hidden', backgroundColor: '#F5F5F5' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={img}
            alt={title}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {badgeLabel && (
            <span style={{
              position: 'absolute',
              top: 7,
              left: 7,
              background: badgeBg || '#C4956A',
              color: '#fff',
              fontSize: '9px',
              fontWeight: 700,
              letterSpacing: '0.07em',
              padding: '3px 7px',
              textTransform: 'uppercase',
              lineHeight: 1.3,
            }}>
              {badgeLabel}
            </span>
          )}
        </div>
        <div style={{ padding: '8px 2px 4px', textAlign: 'center' }}>
          <p style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '11px',
            color: '#444',
            marginBottom: '3px',
            lineHeight: 1.3,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
          }}>
            {title}
          </p>
          <span style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '12px',
            fontWeight: 600,
            color: '#1A1A1A',
          }}>
            {formatGs(price)}
          </span>
        </div>
      </div>
    </Link>
  );
};

const TabBar = ({ tabs, active, onSelect }) => (
  <div style={{
    display: 'flex',
    gap: 0,
    overflowX: 'auto',
    borderBottom: '1px solid #E8E8E8',
    marginBottom: '20px',
    scrollbarWidth: 'none',
  }}>
    {tabs.map(t => (
      <button
        key={t}
        onClick={() => onSelect(t)}
        style={{
          fontFamily: "'Jost', sans-serif",
          fontSize: '11px',
          fontWeight: active === t ? 600 : 400,
          color: active === t ? '#C4956A' : '#777',
          background: 'none',
          border: 'none',
          borderBottom: active === t ? '2px solid #C4956A' : '2px solid transparent',
          padding: '8px 12px',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
          transition: 'all 0.2s',
          marginBottom: '-1px',
          textTransform: 'capitalize',
        }}
      >
        {t}
      </button>
    ))}
  </div>
);

const SectionHeader = ({ title, href }) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  }}>
    <h3 style={{
      fontFamily: "'Jost', sans-serif",
      fontSize: '16px',
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#1A1A1A',
      marginBottom: 0,
    }}>
      {title}
    </h3>
    <Link href={href} style={{
      fontFamily: "'Jost', sans-serif",
      fontSize: '10px',
      fontWeight: 600,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#C4956A',
      textDecoration: 'none',
    }}>
      Comprar Todo
    </Link>
  </div>
);

const BestSellersNewArrivals = () => {
  const [bestTab, setBestTab] = useState(BEST_TABS[0]);
  const [newTab, setNewTab] = useState(NEW_TABS[0]);

  const { data: bestSellers, isLoading: bl, isError: be } =
    useGetProductTypeQuery({ type: 'jewelry', query: 'topSeller=true' });
  const { data: newArrivals, isLoading: nl, isError: ne } =
    useGetProductTypeQuery({ type: 'jewelry', query: 'new=true' });

  const bestItems = (bestSellers?.data || []).slice(0, 5);
  const newItems = (newArrivals?.data || []).slice(0, 5);

  return (
    <section style={{ backgroundColor: '#F5F5F5', padding: '60px 0' }}>
      <div className="container">
        <div className="row gx-5">

          {/* LOS MÁS VENDIDOS */}
          <div className="col-xl-6 col-lg-6 mb-5 mb-lg-0">
            <SectionHeader title="Los Más Vendidos" href="/shop" />
            <TabBar tabs={BEST_TABS} active={bestTab} onSelect={setBestTab} />
            {be ? (
              <ErrorMsg msg="Error cargando productos" />
            ) : bl ? (
              <div style={{ height: '160px' }} />
            ) : bestItems.length === 0 ? (
              <ErrorMsg msg="No hay productos" />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {bestItems.map(p => (
                  <CompactCard key={p._id} product={p} badgeLabel="Más Vendido" badgeBg="#9E6845" />
                ))}
              </div>
            )}
          </div>

          {/* NUEVAS LLEGADAS */}
          <div className="col-xl-6 col-lg-6">
            <SectionHeader title="Nuevas Llegadas" href="/shop" />
            <TabBar tabs={NEW_TABS} active={newTab} onSelect={setNewTab} />
            {ne ? (
              <ErrorMsg msg="Error cargando productos" />
            ) : nl ? (
              <div style={{ height: '160px' }} />
            ) : newItems.length === 0 ? (
              <ErrorMsg msg="No hay productos" />
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
                {newItems.map(p => (
                  <CompactCard key={p._id} product={p} badgeLabel="New" badgeBg="#B8956A" />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default BestSellersNewArrivals;
