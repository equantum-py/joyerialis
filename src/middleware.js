import { NextResponse } from 'next/server';

// MODO DESARROLLO: Autenticación temporalmente deshabilitada
// para acelerar el desarrollo del panel administrativo.
// Se reactivará al finalizar todas las funcionalidades.

export async function middleware(req) {
    const path = req.nextUrl.pathname;

  // TEMPORALMENTE PERMITIR ACCESO LIBRE A TODAS LAS RUTAS /admin
  // Redirigir /admin/login al dashboard
  if (path === '/admin/login') {
        return NextResponse.redirect(new URL('/admin', req.url));
  }

  // Permitir acceso libre a todo /admin
  return NextResponse.next();
}

// Proteger todas las subrutas de /admin
export const config = {
    matcher: ['/admin/:path*']
};
