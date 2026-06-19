import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { findUserByEmail } from '@/services/userService';
import bcrypt from 'bcryptjs';

export const authOptions = {
providers: [
CredentialsProvider({
name: 'Credentials',
credentials: {
email: { label: 'Email', type: 'email' },
password: { label: 'Password', type: 'password' }
},
async authorize(credentials) {
if (!credentials?.email || !credentials?.password) {
throw new Error('Por favor, ingresa tu correo y contraseña.');
}

```
    // Buscar usuario
    const user = await findUserByEmail(credentials.email);

    console.log('[DIAG] Usuario encontrado:', !!user);
    console.log('[DIAG] Email recibido:', credentials.email);

    if (!user) {
      throw new Error('Usuario no registrado.');
    }

    console.log('[DIAG] Hash almacenado:', user.password);
    console.log('[DIAG] Password length:', credentials.password.length);

    // Comparar contraseña con bcrypt
    const isValid = await bcrypt.compare(
      credentials.password,
      user.password
    );

    console.log('[DIAG] bcrypt result:', isValid);

    if (!isValid) {
      throw new Error('Contraseña incorrecta.');
    }

    // Devolver usuario sin password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
})
```

],

session: {
strategy: 'jwt',
maxAge: 30 * 24 * 60 * 60, // 30 días
},

callbacks: {
async jwt({ token, user }) {
if (user) {
token.id = user.id;
token.role = user.role;
}
return token;
},

```
async session({ session, token }) {
  if (token) {
    session.user.id = token.id;
    session.user.role = token.role;
  }
  return session;
}
```

},

pages: {
signIn: '/admin/login',
},

secret:
process.env.NEXTAUTH_SECRET ||
'secret-placeholder-joyerialis-1234567890',
};

export default NextAuth(authOptions);
