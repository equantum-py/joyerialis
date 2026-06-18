import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
// internal
import social_data from '@/data/social-data';
import { Email, Location } from '@/svg';
import logo from '@assets/img/logo/logo.svg';
import pay from '@assets/img/footer/footer-pay.png';

const FooterTwo = () => {
  return (
    <>
      <footer>
        <div className="tp-footer-area tp-footer-style-2 tp-footer-style-3 tp-footer-style-4" data-bg-color="#F5F5F5" style={{ backgroundColor: `rgb(245, 245, 245)` }}>
          <div className="tp-footer-top pt-95 pb-40">
            <div className="container">
              <div className="row">
                <div className="col-xl-3 col-lg-3 col-md-4 col-sm-6">
                  <div className="tp-footer-widget footer-col-4-1 mb-50">
                    <div className="tp-footer-logo">
                      <Link href="/">
                        <Image src={logo} alt="logo" />
                      </Link>
                    </div>
                    <div className="tp-footer-widget-content">
                      <div className="tp-footer-talk mb-20">
                        <span>¿Tienes preguntas? Llámanos</span>
                        <h4><a href="tel:+595210000000">+595 21 000 000</a></h4>
                      </div>
                      <div className="tp-footer-contact">
                        <div className="tp-footer-contact-item d-flex align-items-start">
                          <div className="tp-footer-contact-icon">
                            <span>
                              <Email />
                            </span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p><a href="mailto:contacto@joyerialis.com">contacto@joyerialis.com</a></p>
                          </div>
                        </div>
                        <div className="tp-footer-contact-item d-flex align-items-start">
                          <div className="tp-footer-contact-icon">
                            <span>
                              <Location />
                            </span>
                          </div>
                          <div className="tp-footer-contact-content">
                            <p>Asunción, Paraguay</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <div className="tp-footer-widget footer-col-4-2 mb-50">
                    <h4 className="tp-footer-widget-title">Mi cuenta</h4>
                    <div className="tp-footer-widget-content">
                      <ul>
                        <li><Link href="/profile">Rastrear pedidos</Link></li>
                        <li><Link href="/contact">Envíos</Link></li>
                        <li><Link href="/wishlist">Lista de deseos</Link></li>
                        <li><Link href="/profile">Mi cuenta</Link></li>
                        <li><Link href="/profile">Historial de pedidos</Link></li>
                        <li><Link href="/contact">Devoluciones</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-3 col-lg-2 col-md-4 col-sm-5">
                  <div className="tp-footer-widget footer-col-4-3 mb-50">
                    <h4 className="tp-footer-widget-title">Información</h4>
                    <div className="tp-footer-widget-content">
                      <ul>
                        <li><Link href="/blog">Nuestra historia</Link></li>
                        <li><Link href="/contact">Empleos</Link></li>
                        <li><Link href="/contact">Política de privacidad</Link></li>
                        <li><Link href="/contact">Términos y condiciones</Link></li>
                        <li><Link href="/blog">Últimas noticias</Link></li>
                        <li><Link href="/contact">Contáctanos</Link></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-4 col-md-6 col-sm-7">
                  <div className="tp-footer-widget footer-col-4-4 mb-50">
                    <h4 className="tp-footer-widget-title">Suscríbete.</h4>
                    <div className="tp-footer-widget-content">
                      <div className="tp-footer-subscribe">
                        <p>Mantente informado de nuestras novedades</p>
                        <div className="tp-footer-subscribe-form mb-30">
                          <form action="#">
                            <div className="tp-footer-subscribe-input">
                              <input type="email" placeholder="Ingresa tu correo" />
                              <button type="submit">Suscribirse</button>
                            </div>
                          </form>
                        </div>
                        <div className="tp-footer-social-4 tp-footer-social">
                          <h4 className="tp-footer-social-title-4">Síguenos en</h4>
                          {social_data.map(s => <a href={s.link} key={s.id} target="_blank">
                            <i className={s.icon}></i>
                          </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="tp-footer-bottom">
            <div className="container">
              <div className="tp-footer-bottom-wrapper">
                <div className="row align-items-center">
                  <div className="col-md-6">
                    <div className="tp-footer-copyright">
                      <p>© {new Date().getFullYear()} Todos los derechos reservados | <Link href="/">Joyerialis</Link>.</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="tp-footer-payment text-md-end">
                      <p>
                        <Image src={pay} alt="pay" />
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterTwo;