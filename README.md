# Joyerialis – Plataforma eCommerce de Joyería

Joyerialis es una plataforma eCommerce moderna construida con Next.js, Express.js, MongoDB, Redux Toolkit, RTK Query, Stripe, Bootstrap 5 y Sass.

## Stack Tecnológico

- **Next.js** — Framework React para producción
- **Express.js** — Backend Node.js
- **MongoDB + Mongoose** — Base de datos
- **Redux Toolkit + RTK Query** — Gestión de estado y fetching de datos
- **Stripe** — Pasarela de pagos
- **Nodemailer** — Envío de emails
- **Bootstrap 5** — Framework CSS responsive
- **FontAwesome** — Iconografía

## Instalación

1. Clonar el repositorio e instalar dependencias:

   ```bash
   npm install
   ```

2. Configurar variables de entorno.

3. Iniciar en desarrollo:

   ```bash
   npm run dev
   ```

4. Build para producción:

   ```bash
   npm run build
   npm start
   ```

## Contacto

Para consultas técnicas: contacto@joyerialis.com

## ERP Admin V2: carga de imágenes con Vercel Blob

El endpoint `POST /api/admin-v2/media/upload` usa `@vercel/blob` desde una Pages API route de Next.js. Para producción necesita un token de lectura/escritura del Blob Store asociado al proyecto correcto.

Variables requeridas en Vercel para `ealis.com.py`:

- `BLOB_READ_WRITE_TOKEN`: token Read/Write del Blob Store conectado al proyecto `ealis.com.py`. `BLOB_STORE_ID` por sí solo no autoriza `put()` en `@vercel/blob` para este endpoint.
- `DATABASE_URL`: URL pooled de Neon del proyecto Joyerialis real.
- `DIRECT_URL`: URL directa de Neon del proyecto Joyerialis real.
- `NEXTAUTH_SECRET` y `NEXTAUTH_URL` según el dominio productivo.

Cómo agregar `BLOB_READ_WRITE_TOKEN`:

1. Entrar a Vercel con la cuenta/equipo donde está desplegado `ealis.com.py`.
2. Abrir el proyecto `ealis.com.py` (no `cooperativavidayluz.com.py`).
3. Ir a Storage / Blob y abrir el Blob Store usado por Joyerialis.
4. Copiar o crear el token Read/Write del store.
5. En Project Settings / Environment Variables agregar `BLOB_READ_WRITE_TOKEN` para Production (y Preview si aplica).
6. Redeploy del proyecto para que la función serverless reciba la variable.

Prueba productiva esperada: subir un JPEG/PNG/WEBP/AVIF menor o igual a 5MB desde `/admin-v2/productos`. Si falta el token, el endpoint responde JSON `503` con `code: "BLOB_CREDENTIALS_MISSING"`; no debe devolver HTML 500 genérico ni mostrar éxito falso.
