// Base de datos temporal de administradores de Joyerialis
// La contraseña para todos los usuarios es: admin123
export const adminUsers = [
  {
    id: 'usr-001',
    name: 'Super Admin',
    email: 'super@joyerialis.com',
    password: '$2a$10$tPxG/K5F.nU1s64R7K98zOshh32W.cK0h6vX8WqJ2TCOpZlVw1vK.',
    role: 'SUPER_ADMIN'
  },
  {
    id: 'usr-002',
    name: 'Administrador',
    email: 'admin@joyerialis.com',
    password: '$2a$10$tPxG/K5F.nU1s64R7K98zOshh32W.cK0h6vX8WqJ2TCOpZlVw1vK.',
    role: 'ADMIN'
  },
  {
    id: 'usr-003',
    name: 'Editor Catálogo',
    email: 'editor@joyerialis.com',
    password: '$2a$10$tPxG/K5F.nU1s64R7K98zOshh32W.cK0h6vX8WqJ2TCOpZlVw1vK.',
    role: 'EDITOR'
  }
];
