import React, { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulated auth check
    setTimeout(() => {
      if (email === 'admin@joyerialis.com' && password === 'admin123') {
        router.push('/admin');
      } else {
        setError('Credenciales inválidas. Usa admin@joyerialis.com y admin123 para entrar.');
        setLoading(false);
      }
    }, 800);
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
              <label className="form-label small text-dark font-weight-semibold">Correo Electrónico</label>
              <div className="position-relative">
                <input
                  type="email"
                  className="form-control form-control-md"
                  placeholder="ejemplo@joyerialis.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small text-dark font-weight-semibold">Contraseña</label>
              <input
                type="password"
                className="form-control form-control-md"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ borderRadius: '8px' }}
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
            <small className="text-muted">
              Demo Credentials:<br />
              <strong>admin@joyerialis.com</strong> / <strong>admin123</strong>
            </small>
          </div>
        </div>
      </div>
    </>
  );
}
