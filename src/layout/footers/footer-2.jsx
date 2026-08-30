import React from 'react';
import Link from 'next/link';

const LOGO_SRC='https://raw.githubusercontent.com/equantum-py/joyerialis/main/public/assets/img/logo/jolie-logo.svg';

const FooterTwo=()=> (
  <footer className="jolie-footer">
    <style>{`
      .jolie-footer{background:#fffaf7;color:#5a3e32;border-top:1px solid #eeddd5;font-family:'Montserrat',sans-serif}.jolie-footer-main{padding:58px 0 44px}.jolie-footer-grid{display:grid;grid-template-columns:1.25fr repeat(4,1fr);gap:46px}.jolie-footer-logo{display:inline-block;margin:0 0 14px}.jolie-footer-logo img{display:block;width:132px;height:108px;object-fit:contain}.jolie-footer-brand p{font-size:13px;line-height:1.8;color:#806a63;max-width:220px}.jolie-footer h4{font-size:12px;text-transform:uppercase;letter-spacing:.13em;margin:5px 0 20px;color:#5a3e32}.jolie-footer ul{list-style:none;padding:0;margin:0}.jolie-footer li{margin:0 0 11px}.jolie-footer a,.jolie-footer li,.jolie-footer p{color:#806a63;font-size:12px}.jolie-footer a:hover{color:#c98268}.jolie-footer-bottom{border-top:1px solid #eeddd5;background:#f8e1d7;padding:16px 0}.jolie-footer-bottom-inner{display:flex;justify-content:space-between;font-size:11px;color:#806a63}@media(max-width:991px){.jolie-footer-grid{grid-template-columns:repeat(2,1fr)}}@media(max-width:575px){.jolie-footer-grid{grid-template-columns:1fr;gap:28px}.jolie-footer-main{padding:42px 0}.jolie-footer-logo img{width:120px;height:96px}.jolie-footer-bottom-inner{display:block;text-align:center;line-height:2}}
    `}</style>
    <div className="jolie-footer-main"><div className="container jolie-footer-grid">
      <div className="jolie-footer-brand"><Link href="/" className="jolie-footer-logo"><img src={LOGO_SRC} alt="Jolie Jewelry - Bonita y única"/></Link><p>Joyas que expresan tu esencia.<br/>Hechas con amor para vos.</p><p>Instagram &nbsp; Facebook</p></div>
      <div><h4>Tienda</h4><ul><li><Link href="/shop?category=Collares">Collares</Link></li><li><Link href="/shop?category=Aros">Aros</Link></li><li><Link href="/shop?category=Pulseras">Pulseras</Link></li><li><Link href="/shop?category=Tobilleras">Tobilleras</Link></li><li><Link href="/shop?new=true">Nuevos ingresos</Link></li></ul></div>
      <div><h4>Información</h4><ul><li><Link href="/about">Sobre Jolie</Link></li><li><Link href="/contact">Envíos y entregas</Link></li><li><Link href="/contact">Cambios y devoluciones</Link></li><li><Link href="/contact">Preguntas frecuentes</Link></li><li><Link href="/contact">Contacto</Link></li></ul></div>
      <div><h4>Ayuda</h4><ul><li><Link href="/contact">¿Cómo comprar?</Link></li><li><Link href="/contact">Formas de pago</Link></li><li><Link href="/contact">Términos y condiciones</Link></li><li><Link href="/contact">Políticas de privacidad</Link></li></ul></div>
      <div><h4>Contacto</h4><ul><li>WhatsApp Paraguay</li><li>hola@joliejewelry.com.py</li><li>Paraguay</li></ul></div>
    </div></div>
    <div className="jolie-footer-bottom"><div className="container jolie-footer-bottom-inner"><span>© {new Date().getFullYear()} Jolie Jewelry. Todos los derechos reservados.</span><span>Joyas que expresan tu esencia ♡</span></div></div>
  </footer>
);
export default FooterTwo;