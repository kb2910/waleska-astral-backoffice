import { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import mediaService, { type MediaAsset } from '../services/media.service';
import './CrudPages.css';

export default function Media() {
  const { t } = useTranslation();
  const [files, setFiles] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await mediaService.getAll();
      setFiles(Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
    } catch { setFiles([]); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    setMessage('');
    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        await mediaService.upload(selectedFiles[i]);
      }
      setMessage(t('Backoffice.UploadSuccess'));
      load();
    } catch (err: any) {
      setMessage(t('Backoffice.Error') + ': ' + (err.response?.data?.message || err.message));
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles || droppedFiles.length === 0) return;

    setUploading(true);
    setMessage('');
    try {
      for (let i = 0; i < droppedFiles.length; i++) {
        await mediaService.upload(droppedFiles[i]);
      }
      setMessage(t('Backoffice.UploadSuccess'));
      load();
    } catch (err: any) {
      setMessage(t('Backoffice.Error') + ': ' + (err.response?.data?.message || err.message));
    }
    setUploading(false);
  };

  const handleDelete = async (file: MediaAsset) => {
    if (!confirm(t('Backoffice.ConfirmDelete'))) return;
    try {
      await mediaService.remove(file.id);
      load();
    } catch (err: any) {
      setMessage(t('Backoffice.Error') + ': ' + (err.response?.data?.message || err.message));
    }
  };

  const isImage = (filename: string) => {
    return /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(filename);
  };

  const isVideo = (filename: string) => {
    return /\.(mp4|webm|ogg|mov)$/i.test(filename);
  };

  const isPdf = (filename: string) => {
    return /\.pdf$/i.test(filename);
  };

  const getFolders = () => {
    const folders = new Set<string>();
    files.forEach(f => {
      const folder = f.folder || 'root';
      folders.add(folder);
    });
    return Array.from(folders);
  };

  const filtered = filter === 'all' ? files : files.filter(f => (f.folder || 'root') === filter);

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Media')}</h4>
        <span className="media-count">{filtered.length} {t('Backoffice.Files')}</span>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      <div
        className="upload-area"
        onDragOver={e => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <i className="fas fa-spinner fa-spin" />
            <p>{t('Backoffice.Uploading')}</p>
          </>
        ) : (
          <>
            <i className="fas fa-cloud-upload-alt" />
            <p>{t('Backoffice.DragDropOrClick')}</p>
            <small>{t('Backoffice.AcceptedFormats')}</small>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*,.pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={handleUpload}
        />
      </div>

      {getFolders().length > 1 && (
        <div className="filter-bar">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
            {t('Backoffice.All')}
          </button>
          {getFolders().map(folder => (
            <button
              key={folder}
              className={`filter-btn ${filter === folder ? 'active' : ''}`}
              onClick={() => setFilter(folder)}
            >
              <i className="fas fa-folder" style={{ marginRight: '4px' }} /> {folder}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : filtered.length === 0 ? (
        <div className="edit-card">
          <div className="card-body-custom text-center text-muted">
            <i className="fas fa-images fa-2x" style={{ color: '#333', marginBottom: '12px' }} />
            <p>{t('Backoffice.NoMedia')}</p>
          </div>
        </div>
      ) : (
        <div className="media-grid">
          {filtered.map(file => (
            <div key={file.id} className="media-card">
              <div className="media-preview">
                {isImage(file.originalName || file.filename) ? (
                  <img src={file.url} alt={file.alt || file.originalName || file.filename} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                ) : isVideo(file.originalName || file.filename) ? (
                  <i className="fas fa-video" />
                ) : isPdf(file.originalName || file.filename) ? (
                  <i className="fas fa-file-pdf" />
                ) : (
                  <i className="fas fa-file" />
                )}
              </div>
              <div className="media-info" title={file.originalName || file.filename}>
                {file.originalName || file.filename}
              </div>
              <div className="media-actions">
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(file)} title={t('Backoffice.Delete')}>
                  <i className="fas fa-trash" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
