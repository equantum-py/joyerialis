import React from 'react';

const COPPER = '#C4956A';
const TEXT = '#2B2B2B';
const SUBTLE = '#9A8F8A';

const TruckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

const RefundIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const DiscountIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="8" r="1.5" />
    <circle cx="16" cy="16" r="1.5" />
    <line x1="5" y1="19" x2="19" y2="5" />
    <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
  </svg>
);

const SupportIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
    <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3z" />
    <path d="M3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
  </svg>
);

const trust_items = [
  { icon: <TruckIcon />, title: 'Envío Gratuito', subtitle: 'En todos tus pedidos' },
  { icon: <RefundIcon />, title: 'Devoluciones', subtitle: 'Garantía de reembolso' },
  { icon: <DiscountIcon />, title: 'Descuento Exclusivo', subtitle: 'Pedidos desde $140.00' },
  { icon: <SupportIcon />, title: 'Soporte 24/7', subtitle: 'Atención las 24 horas' },
];

const FeatureAreaThree = () => (
  <section
    className="tp-feature-area"
    style={{
      backgroundColor: '#FFFFFF',
      borderTop: '1px solid #EBEBEB',
      borderBottom: '1px solid #EBEBEB',
      padding: '30px 0',
    }}
  >
    <div className="container">
      <div className="row">
        {trust_items.map((item, i) => (
          <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-6">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '10px 16px',
                position: 'relative',
              }}
            >
              {i < trust_items.length - 1 && (
                <span
                  className="d-none d-lg-block"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '1px',
                    height: '32px',
                    backgroundColor: '#E5E5E5',
                  }}
                />
              )}

              <span
                style={{
                  flexShrink: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: COPPER,
                }}
              >
                {item.icon}
              </span>

              <div>
                <h5
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '13px',
                    fontWeight: '600',
                    color: TEXT,
                    marginBottom: '2px',
                    lineHeight: 1.3,
                  }}
                >
                  {item.title}
                </h5>
                <p
                  style={{
                    fontFamily: "'Jost', sans-serif",
                    fontSize: '11px',
                    fontWeight: '300',
                    color: SUBTLE,
                    marginBottom: 0,
                    lineHeight: 1.4,
                  }}
                >
                  {item.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default FeatureAreaThree;
