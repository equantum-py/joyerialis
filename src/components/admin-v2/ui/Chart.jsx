import React from 'react';
import styles from './design-system.module.scss';

export default function Chart({
  title,
  subtitle,
  data = [],
  height = '240px',
  type = 'bar',
  color = '#2563eb',
}) {
  // Encuentra el valor máximo para calcular alturas porcentuales
  const maxVal = Math.max(...data.map((d) => d.value), 100);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div>
          <h4 className={styles.chartTitle}>{title}</h4>
          {subtitle && <p className={styles.chartSubtitle}>{subtitle}</p>}
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="d-inline-block rounded-circle" style={{ width: '10px', height: '10px', backgroundColor: color }}></span>
          <span className="small text-muted font-weight-medium">Métrica actual</span>
        </div>
      </div>

      {/* Renderizado del gráfico basado en CSS/SVG corporativo */}
      <div
        className="d-flex align-items-end justify-content-between gap-2 pt-4 border-bottom border-light position-relative"
        style={{ height }}
      >
        {/* Grid lines horizontales */}
        <div className="position-absolute top-0 start-0 w-100 border-top border-light" style={{ zIndex: 1 }}></div>
        <div className="position-absolute top-50 start-0 w-100 border-top border-light" style={{ zIndex: 1 }}></div>

        {data.map((item, idx) => {
          const percentage = (item.value / maxVal) * 100;
          return (
            <div
              key={idx}
              className="d-flex flex-column align-items-center flex-grow-1 h-100 justify-content-end"
              style={{ zIndex: 2 }}
            >
              <div
                className="w-100 rounded-top transition-all"
                style={{
                  height: `${Math.max(percentage, 5)}%`,
                  backgroundColor: color,
                  maxWidth: '36px',
                  opacity: 0.9,
                  cursor: 'pointer',
                }}
                title={`${item.label}: ${item.value}`}
              ></div>
              <span className="mt-2 text-muted text-truncate w-100 text-center" style={{ fontSize: '0.75rem' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
