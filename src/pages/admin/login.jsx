import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/react';
import { notifySuccess, notifyError } from '@/utils/toast';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
        notifyError(res.error);
        setLoading(false);
      } else {
        notifySuccess('¡Sesión iniciada con éxito!');
        router.push('/admin');
      }
    } catch (err) {
      setError('Ocurrió un error inesperado al iniciar sesión.');
      notifyError('Error inesperado.');
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Login Administrativo - Joyerialis</title>
      </Head>
      
      <div 
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}
      >
        <div className="card shadow-lg border-0 px-4 py-5" style={{ width: '420px', borderRadius: '12px', backgroundColor: '#ffffffeb', backdropFilter: 'blur(10px)' }}>
          <div className="text-center mb-4">
            <h2 className="font-weight-bold text-dark mb-1" style={{ letterSpacing: '0.5px' }}>
              Joyeria<span style={{ color: '#d4af37' }}>lis</span>
            </h2>
            <p className="text-muted small">Panel de Control Administrativo</p>
          </div>

          {error && (
            <div className="alert alert-danger py-2 px-3 small border-0 mb-3" role="alert">
              <i className="fa-light fa-circle-exclamation me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="adminEmailInput" className="form-label small text-dark font-weight-semibold">Correo Electrónico</label>
              <div className="position-relative">
                <input
                  id="adminEmailInput"
                  type="email"
                  className="form-control form-control-md"
                  placeholder="ejemplo@joyerialis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderRadius: '8px', fontSize: '16px' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="adminPasswordInput" className="form-label small text-dark font-weight-semibold">Contraseña</label>
              <input
                id="adminPasswordInput"
                type="password"
                className="form-control form-control-md"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: '8px', fontSize: '16px' }}
              />
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 font-weight-semibold"
              disabled={loading}
              style={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none', transition: 'all 0.2s' }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Iniciando...
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          <div className="text-center mt-4 border-top pt-3">
            <small className="text-muted d-block mb-1">Credenciales de Demostración (Pass: admin123):</small>
            <div className="d-flex flex-column gap-1 small text-start bg-light p-2 rounded border border-light">
              <div><span className="badge bg-danger">SUPER_ADMIN</span>: super@joyerialis.com</div>
              <div><span className="badge bg-primary">ADMIN</span>: admin@joyerialis.com</div>
              <div><span className="badge bg-secondary">EDITOR</span>: editor@joyerialis.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
