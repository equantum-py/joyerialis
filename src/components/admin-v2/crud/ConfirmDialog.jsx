import React from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title = 'Confirmar Operación', message = '¿Está seguro de que desea realizar esta acción? Esta operación no se puede deshacer.', confirmLabel = 'Confirmar', variant = 'danger' }) {
  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>
        Cancelar
      </Button>
      <Button variant={variant} onClick={onConfirm}>
        {confirmLabel}
      </Button>
    </>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} footer={footer} maxWidth="28rem">
      <p className="mb-0 text-dark small">{message}</p>
    </Modal>
  );
}
