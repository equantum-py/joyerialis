import React from 'react';

const MAUVE = '#C6A392';
const TEXT = '#2B2B2B';
const SUBTLE = '#9A8F8A';

// Thin-stroke 24×24 icons — luxury feel, currentColor
const ShippingIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// Diamond facet — on-brand for jewelry quality
const QualityIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2h12l4 7-10 13L2 9z" />
    <path d="M2 9h20" />
    <path d="M12 2l4 7-4 13" />
    <path d="M12 2L8 9l4 13" />
  </svg>
);

const SecureIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const SupportIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const trust_items = [
  {
    icon: <ShippingIcon />,
    title: 'Envíos a todo el país',
    subtitle: 'Entrega segura y rápida',
  },
  {
    icon: <QualityIcon />,
    title: 'Calidad garantizada',
    subtitle: 'Piezas seleccionadas cuidadosamente',
  },
  {
    icon: <SecureIcon />,
    title: 'Compra segura',
    subtitle: 'Protección en cada transacción',
  },
  {
    icon: <SupportIcon />,
    title: 'Atención personalizada',
    subtitle: 'Estamos para ayudarte',
  },
];

const FeatureAreaThree = () => {
  return (
    <section
      className="tp-feature-area"
      style={{
        backgroundColor: '#F5F5F5',
        borderTop: '1px solid #E8E0DA',
        borderBottom: '1px solid #E8E0DA',
        padding: '28px 0',
      }}
    >
      <div className="container">
        <div className="row">
          {trust_items.map((item, i) => (
            <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-6">
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '12px 16px',
                  position: 'relative',
                }}
              >
                {/* Vertical divider — desktop only, between items */}
                {i < trust_items.length - 1 && (
                  <span
                    className="d-none d-lg-block"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '1px',
                      height: '28px',
                      backgroundColor: '#DDD5CE',
                    }}
                  />
                )}

                {/* Icon */}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: MAUVE,
                    marginBottom: '10px',
                  }}
                >
                  {item.icon}
                </span>

                {/* Title */}
                <h5
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    fontWeight: '500',
                    letterSpacing: '0.04em',
                    color: TEXT,
                    marginBottom: '3px',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h5>

                {/* Subtitle */}
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    fontWeight: '300',
                    color: SUBTLE,
                    letterSpacing: '0.02em',
                    marginBottom: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaThree;
