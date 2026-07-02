import React, { useRef, useState } from 'react';
import Button from '@/components/admin-v2/ui/Button';
import { mediaService } from '@/services/admin-v2/mediaService';

const DEFAULT_ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

export default function MediaUploader({
  accept = DEFAULT_ALLOWED_TYPES.join(','),
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  maxSizeMB = 5,
  multiple = false,
  scope = 'general',
  folder = 'general',
  metadata = {},
  title = 'Subir archivos',
  description = 'Arrastra archivos aquí o haz clic para seleccionar.',
  buttonLabel = 'Seleccionar archivos',
  onUploaded,
  onError,
}) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);

  const validateFile = (file) => {
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`${file.name}: tipo de archivo no permitido.`);
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`${file.name}: el archivo no debe superar ${maxSizeMB}MB.`);
    }
  };

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length) return;

    try {
      setUploading(true);
      files.forEach(validateFile);
      const uploaded = [];

      for (const file of files) {
        const result = await mediaService.upload(file, {
          scope,
          folder,
          metadata,
          allowedTypes,
          maxSizeMB,
        });
        uploaded.push(result);
      }

      onUploaded?.(multiple ? uploaded : uploaded[0]);
    } catch (error) {
      onError?.(error);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    uploadFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={`border rounded-3 p-4 text-center bg-light ${isDragging ? 'border-primary' : 'border-light'}`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
      }}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="d-none"
        accept={accept}
        multiple={multiple}
        onChange={(event) => uploadFiles(event.target.files)}
      />
      <i className="fa-light fa-cloud-arrow-up fs-2 text-primary mb-2"></i>
      <h6 className="mb-1 text-dark font-weight-bold">{title}</h6>
      <p className="mb-3 text-muted small">{description}</p>
      <Button variant="outline" type="button" loading={uploading} onClick={(event) => { event.stopPropagation(); inputRef.current?.click(); }}>
        {buttonLabel}
      </Button>
      <div className="text-muted small mt-2">Máximo {maxSizeMB}MB por archivo.</div>
    </div>
  );
}
