// Base de datos temporal de administradores de Joyerialis
// La contraseña para todos los usuarios es: admin123
// Hash generado con: bcrypt.hash('admin123', 10)
export const adminUsers = [
  {
    id: 'usr-001',
    name: 'Super Admin',
    email: 'super@joyerialis.com',
    password: '$2b$10$MvRIYF3gbmSmSTPoLIggue.AxfhfYEmvjA30rX8xzYIzwRtTPph4q',
    role: 'SUPER_ADMIN'
  },
  {
    id: 'usr-002',
    name: 'Administrador',
    email: 'admin@joyerialis.com',
    password: '$2b$10$MvRIYF3gbmSmSTPoLIggue.AxfhfYEmvjA30rX8xzYIzwRtTPph4q',
    role: 'ADMIN'
  },
  {
    id: 'usr-003',
    name: 'Editor Catálogo',
    email: 'editor@joyerialis.com',
    password: '$2b$10$MvRIYF3gbmSmSTPoLIggue.AxfhfYEmvjA30rX8xzYIzwRtTPph4q',
    role: 'EDITOR'
  }
];
