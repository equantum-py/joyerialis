import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || 'secret-placeholder-joyerialis-1234567890'
  });
  const path = req.nextUrl.pathname;

  // 1. Si intenta ingresar al login del admin y ya está autenticado, redirigir al dashboard (/admin)
  if (path === '/admin/login') {
    if (token) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
    return NextResponse.next();
  }

  // 2. Si intenta ingresar a cualquier otra ruta /admin y NO está autenticado, redirigir a /admin/login
  if (path.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }

    // Control de roles de accesibilidad (ej: EDITOR no puede entrar a configuracion)
    if (path.startsWith('/admin/configuracion') && token.role === 'EDITOR') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  return NextResponse.next();
}

// Proteger todas las subrutas de /admin
export const config = {
  matcher: ['/admin/:path*']
};
