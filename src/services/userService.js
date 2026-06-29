import { adminUsers } from '@/data/admin-users';

/**
 * Busca un administrador por correo electrónico.
 * Esta lógica está centralizada para que cuando se migre a Prisma,
 * solo sea necesario modificar este archivo de servicio.
 * 
 * @param {string} email - Correo del usuario
 * @returns {Promise<object|null>} - Objeto usuario o null
 */
export async function findUserByEmail(email) {
  if (!email) return null;
  // Actualmente lee del mock local.
  // En el futuro será: return await prisma.user.findUnique({ where: { email } });
  const user = adminUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );
  return user ? { ...user } : null;
}

/**
 * Busca un administrador por ID único.
 * 
 * @param {string} id - Identificador del usuario
 * @returns {Promise<object|null>} - Objeto usuario o null
 */
export async function findUserById(id) {
  if (!id) return null;
  // Actualmente lee del mock local.
  // En el futuro será: return await prisma.user.findUnique({ where: { id } });
  const user = adminUsers.find((u) => u.id === id);
  return user ? { ...user } : null;
}
