import React, { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/admin/layout/Layout';
import styles from '@/components/admin/layout/admin.module.css';

export default function Configuracion() {
  const [storeName, setStoreName] = useState('Joyerialis');
  const [storeEmail, setStoreEmail] = useState('contacto@joyerialis.com');
  const [whatsappNumber, setWhatsappNumber] = useState('+56912345678');
  const [whatsappMessage, setWhatsappMessage] = useState('Hola, estoy interesado en este producto de Joyerialis:');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [currency, setCurrency] = useState('CLP');
  const [saving, setSaving] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate save transition
    setTimeout(() => {
      setSaving(false);
      alert('Configuraciones guardadas exitosamente en la interfaz de demostración.');
    }, 800);
  };

  return (
    <Layout>
      <Head>
        <title>Configuración - Joyerialis Admin</title>
      </Head>

      {/* Page Header */}
      <div className="mb-4">
        <h4 className="mb-1 text-dark font-weight-bold">Configuración</h4>
        <p className="mb-0 text-muted small">Administra los parámetros generales, datos de contacto y automatizaciones de WhatsApp.</p>
      </div>

      <form onSubmit={handleSave} className="position-relative">
        
        {/* Loading Spinner Overlay when saving */}
        {saving && (
          <div className={styles.loadingOverlay} style={{ position: 'fixed', zIndex: 1100 }}>
            <div className="spinner-border text-dark spinner-border-sm me-2" role="status"></div>
            <span className="text-muted small">Guardando cambios...</span>
          </div>
        )}

        <div className="row g-4">
          {/* General Settings */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '10px' }}>
              <h5 className="mb-3 text-dark font-weight-bold border-bottom pb-2">
                <i className="fa-light fa-store me-2 text-primary"></i> Información General
              </h5>
              
              <div className="mb-3">
                <label className="form-label small text-dark font-weight-semibold">Nombre de la Tienda</label>
                <input
                  type="text"
                  className="form-control"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-dark font-weight-semibold">Correo de Contacto</label>
                <input
                  type="email"
                  className="form-control"
                  value={storeEmail}
                  onChange={(e) => setStoreEmail(e.target.value)}
                  required
                  style={{ borderRadius: '8px' }}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small text-dark font-weight-semibold">Moneda Principal</label>
                <select
                  className="form-select"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  style={{ borderRadius: '8px' }}
                >
                  <option value="CLP">CLP ($) - Peso Chileno</option>
                  <option value="USD">USD ($) - Dólar Estadounidense</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="MXN">MXN ($) - Peso Mexicano</option>
                </select>
              </div>
            </div>
          </div>

          {/* WhatsApp Settings */}
          <div className="col-12 col-lg-6">
            <div className="card shadow-sm border-0 p-4 h-100" style={{ borderRadius: '10px' }}>
              <h5 className="mb-3 text-dark font-weight-bold border-bottom pb-2">
                <i className="fa-light fa-comments me-2 text-success"></i> Configuración de WhatsApp
              </h5>

              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="whatsappSwitch"
                  checked={whatsappEnabled}
                  onChange={(e) => setWhatsappEnabled(e.target.checked)}
                />
                <label className="form-check-label small text-dark font-weight-medium" htmlFor="whatsappSwitch">
                  Habilitar botón de WhatsApp en la Tienda
                </label>
              </div>
              
              <div className="mb-3">
                <label className="form-label small text-dark font-weight-semibold">Número de WhatsApp</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="+56912345678"
                  value={whatsappNumber}
                  onChange={(e) => setWhatsappNumber(e.target.value)}
                  disabled={!whatsappEnabled}
                  required={whatsappEnabled}
                  style={{ borderRadius: '8px' }}
                />
                <small className="text-muted text-xs">Incluye el código de país (ej: +569... o +549...).</small>
              </div>

              <div className="mb-3">
                <label className="form-label small text-dark font-weight-semibold">Mensaje por Defecto</label>
                <textarea
                  className="form-control"
                  rows="3"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  disabled={!whatsappEnabled}
                  required={whatsappEnabled}
                  style={{ borderRadius: '8px' }}
                />
                <small className="text-muted text-xs">Este mensaje se enviará automáticamente al iniciar el chat.</small>
              </div>
            </div>
          </div>
          
          {/* Submit bar */}
          <div className="col-12 text-end">
            <button
              type="submit"
              className="btn btn-dark px-4 py-2 font-weight-semibold"
              disabled={saving}
              style={{ borderRadius: '8px', backgroundColor: '#1e293b', border: 'none' }}
            >
              {saving ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </div>
      </form>
    </Layout>
  );
}
