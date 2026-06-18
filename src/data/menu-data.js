import home_1 from '@assets/img/menu/menu-home-1.jpg';
import home_2 from '@assets/img/menu/menu-home-2.jpg';
import home_3 from '@assets/img/menu/menu-home-3.jpg';
import home_4 from '@assets/img/menu/menu-home-4.jpg';

const menu_data = [
  {
    id: 1,
    homes: true,
    title: 'Inicio',
    link: '/',
    home_pages: [
      {
        img: home_1,
        title: 'Electronics',
        link: '/'
      },
      {
        img: home_2,
        title: 'Fashion',
        link: '/home-2'
      },
      {
        img: home_3,
        title: 'Beauty',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Jewelry',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    products: true,
    title: 'Productos',
    link: '/shop',
    product_pages: [
      {
        title: 'Tienda',
        link: '/shop',
        mega_menus: [
          { title: 'Categorías', link: '/shop-category' },
          { title: 'Catálogo', link: '/shop' },
          { title: 'Detalle del Producto', link: '/product-details' },
        ]
      },
      {
        title: 'Productos',
        link: '/product-details',
        mega_menus: [
          { title: 'Producto', link: '/product-details' },
          { title: 'Con Video', link: '/product-details-video' },
          { title: 'Oferta Especial', link: '/product-details-countdown' },
          { title: 'Variaciones', link: '/product-details-swatches' },
        ]
      },
      {
        title: 'Mi Compra',
        link: '/shop',
        mega_menus: [
          { title: 'Carrito', link: '/cart' },
          { title: 'Comparar', link: '/compare' },
          { title: 'Favoritos', link: '/wishlist' },
          { title: 'Finalizar Compra', link: '/checkout' },
          { title: 'Mi Cuenta', link: '/profile' },
        ]
      },
      {
        title: 'Mi Cuenta',
        link: '/shop',
        mega_menus: [
          { title: 'Iniciar Sesión', link: '/login' },
          { title: 'Registrarse', link: '/register' },
          { title: 'Recuperar Contraseña', link: '/forgot' },
          { title: '404 Error', link: '/404' },
        ]
      },
    ]
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Tienda',
    link: '/shop',
    sub_menus: [
      { title: 'Tienda', link: '/shop' },
      { title: 'Barra Lateral Derecha', link: '/shop-right-sidebar' },
      { title: 'Barra Lateral Oculta', link: '/shop-hidden-sidebar' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Promociones',
    link: '/coupon',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Grid', link: '/blog-grid' },
      { title: 'Blog List', link: '/blog-list' },
      { title: 'Blog Details', link: '/blog-details' },
      { title: 'Blog Details Full Width', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Contacto',
    link: '/contact',
  },
]

export default menu_data;

// mobile_menu
export const mobile_menu = [
  {
    id: 1,
    homes: true,
    title: 'Inicio',
    link: '/',
    home_pages: [
      {
        img: home_1,
        title: 'Electronics',
        link: '/'
      },
      {
        img: home_2,
        title: 'Fashion',
        link: '/home-2'
      },
      {
        img: home_3,
        title: 'Beauty',
        link: '/home-3'
      },
      {
        img: home_4,
        title: 'Jewelry',
        link: '/home-4'
      }
    ]
  },
  {
    id: 2,
    sub_menu: true,
    title: 'Productos',
    link: '/shop',
    sub_menus: [
      { title: 'Tienda', link: '/shop' },
{ title: 'Barra Lateral Derecha', link: '/shop-right-sidebar' },
{ title: 'Barra Lateral Oculta', link: '/shop-hidden-sidebar' },
{ title: 'Categorías', link: '/shop-category' },
{ title: 'Producto', link: '/product-details' },
{ title: 'Con Video', link: '/product-details-video' },
{ title: 'Oferta Especial', link: '/product-details-countdown' },
{ title: 'Variaciones', link: '/product-details-swatches' },
    ],
  },
  {
    id: 3,
    sub_menu: true,
    title: 'Mi Compra',
    link: '/cart',
    sub_menus: [
      { title: 'Carrito', link: '/cart' },
      { title: 'Comparar', link: '/compare' },
      { title: 'Favoritos', link: '/wishlist' },
      { title: 'Finalizar Compra', link: '/checkout' },
      { title: 'Mi Cuenta', link: '/profile' },
    ],
  },
  {
    id: 4,
    sub_menu: true,
    title: 'Mi cuenta',
    link: '/login',
    sub_menus: [
      { title: 'Iniciar Sesión', link: '/login' },
      { title: 'Registrarse', link: '/register' },
      { title: 'Recuperar Contraseña', link: '/forgot' },
      { title: '404 Error', link: '/404' },
    ],
  },
  {
    id: 4,
    single_link: true,
    title: 'Promociones',
    link: '/coupon',
  },
  {
    id: 5,
    sub_menu: true,
    title: 'Blog',
    link: '/blog',
    sub_menus: [
      { title: 'Blog Standard', link: '/blog' },
      { title: 'Blog Grid', link: '/blog-grid' },
      { title: 'Blog List', link: '/blog-list' },
      { title: 'Blog Details', link: '/blog-details' },
      { title: 'Blog Details Full Width', link: '/blog-details-2' },
    ]
  },
  {
    id: 6,
    single_link: true,
    title: 'Contacto',
    link: '/contact',
  },
]