import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import settingsService, { type SiteSetting } from '../services/settings.service';
import './CrudPages.css';

export default function Settings() {
  const { t } = useTranslation();
  const [items, setItems] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await settingsService.getAll();
      const data = Array.isArray(res) ? res : Array.isArray((res as any)?.data) ? (res as any).data : [];
      setItems(data);
      const map: Record<string, string> = {};
      data.forEach((s: SiteSetting) => { map[s.key] = s.value || ''; });
      setEditedValues(map);
    } catch {
      setItems([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateValue = (key: string, value: string) => {
    setEditedValues(prev => ({ ...prev, [key]: value }));
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const updates = items.map(item => ({
        key: item.key,
        value: editedValues[item.key] ?? item.value,
      }));
      await settingsService.bulkUpdate(updates);
      setMessage(t('Backoffice.SettingsSaved'));
      load();
    } catch (e: any) {
      setMessage(t('Backoffice.Error') + ': ' + (e.response?.data?.message || e.message));
    }
    setSaving(false);
  };

  const grouped: Record<string, SiteSetting[]> = {};
  items.forEach(item => {
    const group = item.group || 'general';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(item);
  });

  const getGroupIcon = (group: string) => {
    switch (group.toLowerCase()) {
      case 'general': return 'fas fa-cog';
      case 'seo': return 'fas fa-search';
      case 'social': return 'fas fa-share-alt';
      case 'contact': return 'fas fa-envelope';
      case 'appearance': return 'fas fa-palette';
      case 'booking': return 'fas fa-calendar';
      default: return 'fas fa-sliders-h';
    }
  };

  return (
    <div>
      <div className="page-header">
        <h4>{t('Backoffice.Settings')}</h4>
        <button className="btn btn-success" onClick={saveAll} disabled={saving || loading}>
          <i className="fas fa-save" /> {saving ? t('Backoffice.Saving') : t('Backoffice.SaveAll')}
        </button>
      </div>

      {message && <div className={`alert ${message.startsWith(t('Backoffice.Error')) ? 'alert-danger' : 'alert-success'}`}>{message}</div>}

      {loading ? (
        <div className="text-center py-4"><i className="fas fa-spinner fa-spin fa-2x" style={{ color: '#7122d0' }} /></div>
      ) : (
        Object.entries(grouped).map(([group, settings]) => (
          <div key={group} className="settings-group">
            <div className="settings-group-header">
              <i className={getGroupIcon(group)} />
              {group.charAt(0).toUpperCase() + group.slice(1)}
              <span className="settings-count">{settings.length}</span>
            </div>
            <div className="settings-group-body">
              {settings.map(setting => (
                <div key={setting.id || setting.key} className="settings-row">
                  <div className="settings-key">
                    <span>{setting.key}</span>
                    {setting.description && <small className="settings-desc">{setting.description}</small>}
                  </div>
                  <div className="settings-value">
                    {setting.type === 'textarea' ? (
                      <textarea
                        className="form-control"
                        rows={3}
                        value={editedValues[setting.key] ?? setting.value ?? ''}
                        onChange={e => updateValue(setting.key, e.target.value)}
                      />
                    ) : setting.type === 'boolean' ? (
                      <select
                        className="form-control"
                        value={editedValues[setting.key] ?? setting.value ?? 'false'}
                        onChange={e => updateValue(setting.key, e.target.value)}
                      >
                        <option value="true">{t('Backoffice.Enabled')}</option>
                        <option value="false">{t('Backoffice.Disabled')}</option>
                      </select>
                    ) : (
                      <input
                        type={setting.type === 'number' ? 'number' : setting.type === 'color' ? 'color' : 'text'}
                        className="form-control"
                        value={editedValues[setting.key] ?? setting.value ?? ''}
                        onChange={e => updateValue(setting.key, e.target.value)}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {!loading && items.length === 0 && (
        <div className="edit-card">
          <div className="card-body-custom text-center text-muted">
            <i className="fas fa-cog fa-2x" style={{ color: '#333', marginBottom: '12px' }} />
            <p>{t('Backoffice.NoSettings')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
