import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import EntityFormPage from '../../components/EntityFormPage';
import { useEntityForm } from '../../hooks/useEntityForm';
import chatConfigService, { type ChatConfig } from '../../services/chat-config.service';

const emptyConfig = (): Partial<ChatConfig> => ({
  language: 'es', model: 'gemini-2.5-flash', maxQuestions: 5,
  systemPrompt: '', welcomeMessage: '', limitReachedMessage: '',
  keywords: [], isActive: true,
});

const keywordsAsText = (keywords: unknown): string =>
  Array.isArray(keywords) ? keywords.join(', ') : String(keywords || '');

export default function ChatConfigFormPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const form = useEntityForm<ChatConfig>({
    service: chatConfigService,
    id,
    empty: emptyConfig,
    backTo: '/chat-config',
    createdMessage: t('Backoffice.Created'),
    updatedMessage: t('Backoffice.Updated'),
    errorMessage: t('Backoffice.Error'),
    transform: current => ({
      ...current,
      keywords: keywordsAsText(current.keywords)
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    }),
  });

  return (
    <EntityFormPage
      title={form.isNew ? t('Backoffice.CreateNewChatConfig') : `${t('Backoffice.Edit')} ${t('Backoffice.ChatConfig')}`}
      subtitle={t('Backoffice.ChatConfig')}
      backTo="/chat-config"
      loading={form.loading}
      saving={form.saving}
      message={form.message}
      onSubmit={form.submit}
      onCancel={form.cancel}
    >
      <div className="form-grid">
        <div className="form-field">
          <label>{t('Backoffice.Language')}</label>
          <select className="form-control" value={form.form.language || 'es'} onChange={e => form.setField('language', e.target.value)}>
            <option value="es">Español</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Model')}</label>
          <select className="form-control" value={form.form.model || 'gemini-2.5-flash'} onChange={e => form.setField('model', e.target.value)}>
            <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
            <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-4-turbo">GPT-4 Turbo</option>
            <option value="gpt-4o">GPT-4o</option>
          </select>
        </div>
        <div className="form-field">
          <label>{t('Backoffice.MaxQuestions')}</label>
          <input type="number" className="form-control" value={form.form.maxQuestions ?? 5} onChange={e => form.setField('maxQuestions', parseInt(e.target.value) || 5)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.Keywords')}</label>
          <input
            className="form-control"
            value={keywordsAsText(form.form.keywords)}
            onChange={e => form.setField('keywords', e.target.value)}
            placeholder={t('Backoffice.KeywordsPlaceholder')}
          />
        </div>
        <div className="form-field full">
          <label>{t('Backoffice.SystemPrompt')}</label>
          <textarea className="form-control" rows={5} value={form.form.systemPrompt || ''} onChange={e => form.setField('systemPrompt', e.target.value)} placeholder={t('Backoffice.SystemPromptPlaceholder')} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.WelcomeMessage')}</label>
          <textarea className="form-control" rows={2} value={form.form.welcomeMessage || ''} onChange={e => form.setField('welcomeMessage', e.target.value)} />
        </div>
        <div className="form-field">
          <label>{t('Backoffice.LimitReachedMessage')}</label>
          <textarea className="form-control" rows={2} value={form.form.limitReachedMessage || ''} onChange={e => form.setField('limitReachedMessage', e.target.value)} />
        </div>
      </div>

      <div className="form-section">
        <label className="checkbox-field">
          <input type="checkbox" checked={form.form.isActive ?? true} onChange={e => form.setField('isActive', e.target.checked)} />
          {t('Backoffice.Active')}
        </label>
      </div>
    </EntityFormPage>
  );
}
