import Head from 'next/head';
import Link from 'next/link';
import SEO from '@/components/seo';
import Wrapper from '@/layout/wrapper';
import HeaderFour from '@/layout/headers/header-4';
import JewelryBanner from '@/components/banner/jewelry-banner';
import FooterTwo from '@/layout/footers/footer-2';

const collections = [
  { name: 'Collares', href: '/shop?category=Collares', image: '/assets/img/product/jewelry/1.jpg' },
  { name: 'Aros', href: '/shop?category=Aros', image: '/assets/img/product/jewelry/2.jpg' },
  { name: 'Pulseras', href: '/shop?category=Pulseras', image: '/assets/img/product/jewelry/3.jpg' },
  { name: 'Tobilleras', href: '/shop?category=Tobilleras', image: '/assets/img/product/jewelry/4.jpg' },
  { name: 'Nuevos', href: '/shop?new=true', image: '/assets/img/product/jewelry/5.jpg' },
];

export default function Home() {
  return (
    <Wrapper>
      <SEO
        pageTitle="Jolie Jewelry | Joyas que expresan tu esencia"
        description="Descubrí Jolie Jewelry: collares, aros, pulseras y accesorios delicados creados para acompañarte en cada momento. Envíos a todo Paraguay."
        noIndex={false}
      />
      <Head>
        <style>{`
          :root {
            --jolie-rose: #d98d6d;
            --jolie-rose-dark: #a85f47;
            --jolie-peach: #f7ddd1;
            --jolie-cream: #fffaf7;
            --jolie-ink: #4d3028;
            --jolie-muted: #806a63;
            --jolie-line: #ecd8cf;
          }
          body { background: var(--jolie-cream); }
          .jolie-home { color: var(--jolie-ink); }
          .jolie-section { padding: 72px 0; }
          .jolie-title {
            font-family: 'Cormorant Garamond', Georgia, serif;
            font-size: clamp(34px, 4vw, 54px);
            font-weight: 400;
            text-align: center;
            margin-bottom: 12px;
            color: var(--jolie-ink);
          }
          .jolie-subtitle { text-align: center; color: var(--jolie-muted); margin-bottom: 44px; }
          .jolie-benefits { background:#fff; border-top:1px solid var(--jolie-line); border-bottom:1px solid var(--jolie-line); }
          .jolie-benefit-grid { display:grid; grid-template-columns:repeat(4,1fr); }
          .jolie-benefit { padding:34px 26px; text-align:center; border-right:1px solid var(--jolie-line); }
          .jolie-benefit:last-child { border-right:0; }
          .jolie-benefit-icon { font-size:32px; color:var(--jolie-rose); margin-bottom:12px; }
          .jolie-benefit h3 { font-size:16px; font-weight:500; margin:0 0 5px; }
          .jolie-benefit p { font-size:13px; color:var(--jolie-muted); margin:0; }
          .jolie-collections { background:#fffdfa; }
          .jolie-collection-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:28px; }
          .jolie-collection { text-align:center; }
          .jolie-collection-img { width:100%; aspect-ratio:1/1; border-radius:50%; object-fit:cover; border:1px solid var(--jolie-line); background:#f8eee9; }
          .jolie-collection h3 { margin:18px 0 10px; font-size:15px; letter-spacing:.08em; text-transform:uppercase; }
          .jolie-outline-btn { display:inline-block; border:1px solid var(--jolie-rose); color:var(--jolie-rose-dark); padding:10px 24px; border-radius:8px; font-size:12px; font-weight:600; text-transform:uppercase; letter-spacing:.05em; }
          .jolie-outline-btn:hover { background:var(--jolie-rose); color:#fff; }
          .jolie-newsletter { background:linear-gradient(90deg,#fae8df,#f5d4c6); padding:28px 0; }
          .jolie-newsletter-wrap { display:grid; grid-template-columns:1fr 1fr; gap:36px; align-items:center; }
          .jolie-newsletter h3 { font-family:'Cormorant Garamond',Georgia,serif; font-size:30px; margin:0 0 4px; }
          .jolie-newsletter p { margin:0; color:var(--jolie-muted); }
          .jolie-newsletter-form { display:flex; }
          .jolie-newsletter-form input { flex:1; border:1px solid #e2c7bc; background:#fff; padding:14px 18px; border-radius:8px 0 0 8px; }
          .jolie-newsletter-form button { border:0; background:var(--jolie-rose); color:#fff; padding:0 26px; border-radius:0 8px 8px 0; font-weight:600; }
          .jolie-story { display:grid; grid-template-columns:1.05fr 1fr; min-height:420px; background:#fff; }
          .jolie-story-image { min-height:420px; background:url('/assets/img/banner/jewelry-banner-1.jpg') center/cover no-repeat; }
          .jolie-story-copy { padding:68px; display:flex; align-items:center; }
          .jolie-story-copy h2 { font-family:'Cormorant Garamond',Georgia,serif; font-size:48px; font-weight:400; line-height:1.05; margin-bottom:20px; }
          .jolie-story-copy p { color:var(--jolie-muted); line-height:1.8; max-width:580px; }
          .jolie-solid-btn { display:inline-block; margin-top:12px; background:var(--jolie-rose); color:#fff; padding:13px 24px; border-radius:8px; font-size:12px; font-weight:600; text-transform:uppercase; }
          @media (max-width: 991px) {
            .jolie-benefit-grid { grid-template-columns:repeat(2,1fr); }
            .jolie-benefit:nth-child(2) { border-right:0; }
            .jolie-collection-grid { grid-template-columns:repeat(2,1fr); }
            .jolie-collection:last-child { grid-column:1 / -1; max-width:260px; margin:0 auto; }
            .jolie-newsletter-wrap { grid-template-columns:1fr; }
            .jolie-story { grid-template-columns:1fr; }
          }
          @media (max-width: 575px) {
            .jolie-section { padding:50px 0; }
            .jolie-benefit-grid { grid-template-columns:1fr 1fr; }
            .jolie-benefit { padding:26px 14px; }
            .jolie-newsletter-form { flex-direction:column; gap:10px; }
            .jolie-newsletter-form input,.jolie-newsletter-form button { border-radius:8px; min-height:48px; }
            .jolie-story-copy { padding:42px 24px; }
            .jolie-story-copy h2 { font-size:40px; }
          }
        `}</style>
      </Head>

      <div className="jolie-home">
        <HeaderFour />
        <JewelryBanner />

        <section className="jolie-benefits">
          <div className="container">
            <div className="jolie-benefit-grid">
              {[
                ['🚚','Envíos a todo Paraguay','Rápidos y seguros'],
                ['🎁','Packaging especial','Para vos o para regalar'],
                ['♡','Calidad garantizada','Materiales seleccionados'],
                ['✦','Hecho con amor','Pensado en cada detalle'],
              ].map(([icon,title,text]) => (
                <div className="jolie-benefit" key={title}>
                  <div className="jolie-benefit-icon">{icon}</div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="jolie-section jolie-collections">
          <div className="container">
            <h2 className="jolie-title">Colecciones que cuentan tu historia</h2>
            <p className="jolie-subtitle">Elegí piezas que hablen de vos y acompañen tus momentos.</p>
            <div className="jolie-collection-grid">
              {collections.map((item) => (
                <article className="jolie-collection" key={item.name}>
                  <img className="jolie-collection-img" src={item.image} alt={item.name} />
                  <h3>{item.name}</h3>
                  <Link className="jolie-outline-btn" href={item.href}>Ver todo</Link>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="jolie-newsletter">
          <div className="container jolie-newsletter-wrap">
            <div>
              <h3>10% OFF en tu primera compra</h3>
              <p>Suscribite y recibí novedades, lanzamientos y beneficios exclusivos.</p>
            </div>
            <form className="jolie-newsletter-form" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Tu correo electrónico" aria-label="Tu correo electrónico" />
              <button type="submit">Suscribirme</button>
            </form>
          </div>
        </section>

        <section className="jolie-story">
          <div className="jolie-story-image" aria-hidden="true" />
          <div className="jolie-story-copy">
            <div>
              <h2>Más que joyas, pequeños recuerdos de quién sos.</h2>
              <p>En Jolie creemos que cada detalle tiene el poder de contar tu historia. Diseños delicados, femeninos y llenos de color para acompañarte en todos tus momentos.</p>
              <Link href="/about" className="jolie-solid-btn">Conocer más sobre Jolie</Link>
            </div>
          </div>
        </section>

        <FooterTwo />
      </div>
    </Wrapper>
  );
}
