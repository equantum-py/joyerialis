import { createContext, useContext } from 'react';

// CONTEXTO SIMULADO DE SESIÓN DE ADMINISTRADOR
// Modo desarrollo: Asume SUPER_ADMIN permanentemente
// Se reemplazará con NextAuth cuando el panel esté completo

const AdminSessionContext = createContext();

export function AdminSessionProvider({ children }) {
    // Sesión simulada: SUPER_ADMIN con acceso total
  const mockSession = {
        user: {
                id: 'dev-admin-001',
                email: 'super@joyerialis.com',
                name: 'Super Admin',
                role: 'SUPER_ADMIN',
                // Permisos temporales: Acceso a TODO
                permissions: {
                          dashboard: true,
                          products: true,
                          categories: true,
                          inventory: true,
                          orders: true,
                          customers: true,
                          settings: true,
                          reports: true,
                          coupons: true,
                          sellers: true,
                }
        }
  };

  return (
    <AdminSessionContext.Provider value={{ session: mockSession }}>
      {children}
    </AdminSessionContext.Provider>
  );
}

export function useAdminSession() {
    const context = useContext(AdminSessionContext);
    if (!context) {
          // Fallback para componentes que no estén dentro del provider
      return {
              session: {
                        user: {
                                    id: 'dev-admin-001',
                                    email: 'super@joyerialis.com',
                                    name: 'Super Admin',
                                    role: 'SUPER_ADMIN',
                                    permissions: {
                                                  dashboard: true,
                                                  products: true,
                                                  categories: true,
                                                  inventory: true,
                                                  orders: true,
                                                  customers: true,
                                                  settings: true,
                                                  reports: true,
                                                  coupons: true,
                                                  sellers: true,
                                    }
                        }
              }
      };
    }
    return context;
}
