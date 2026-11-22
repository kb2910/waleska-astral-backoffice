import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type EntityService<T> = {
  getById?: (id: number) => Promise<T>;
  create?: (payload: Partial<T>) => Promise<unknown>;
  update: (id: number, payload: Partial<T>) => Promise<unknown>;
};

interface UseEntityFormOptions<T> {
  service: EntityService<T>;
  /** id de la ruta; si no existe, el formulario se abre en modo creación. */
  id?: string;
  empty: () => Partial<T>;
  backTo: string;
  createdMessage: string;
  updatedMessage: string;
  errorMessage: string;
  validate?: (form: Partial<T>) => string[];
  transform?: (form: Partial<T>) => Partial<T>;
}

/**
 * Lógica común de las pantallas independientes de crear/editar.
 * Mantiene el formulario, la carga del registro, la validación y la navegación de vuelta al listado.
 */
export function useEntityForm<T extends { id?: number }>({
  service,
  id,
  empty,
  backTo,
  createdMessage,
  updatedMessage,
  errorMessage,
  validate,
  transform,
}: UseEntityFormOptions<T>) {
  const navigate = useNavigate();
  const numericId = id && /^\d+$/.test(id) ? Number(id) : undefined;

  const [form, setForm] = useState<Partial<T>>(() => empty());
  const [loading, setLoading] = useState(Boolean(numericId));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let active = true;

    if (numericId && service.getById) {
      setLoading(true);
      service.getById(numericId)
        .then(data => {
          if (!active) return;
          setForm({ ...(data as any) });
        })
        .catch((e: any) => {
          if (!active) return;
          setLoadFailed(true);
          setMessage(`${errorMessage}: ${e?.response?.data?.message || e?.message || ''}`);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      setForm(empty());
      setLoading(false);
    }

    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericId]);

  const setField = (key: keyof T | string, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const cancel = () => navigate(backTo);

  const submit = async (event?: FormEvent) => {
    event?.preventDefault();

    const errors = validate ? validate(form) : [];
    setValidationErrors(errors);
    if (errors.length) return;

    setSaving(true);
    setMessage('');
    try {
      const payload = transform ? transform(form) : form;
      if (numericId) {
        await service.update(numericId, payload);
      } else if (service.create) {
        await service.create(payload);
      } else {
        throw new Error('CREATE_NOT_SUPPORTED');
      }
      navigate(backTo, { state: { message: numericId ? updatedMessage : createdMessage } });
    } catch (e: any) {
      setMessage(`${errorMessage}: ${e?.response?.data?.message || e?.message || ''}`);
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    loading,
    saving,
    message,
    validationErrors,
    loadFailed,
    isNew: !numericId,
    setField,
    setForm,
    cancel,
    submit,
  };
}

/** Mensaje de éxito que el listado recibe al volver de una pantalla de formulario. */
export function getRouteMessage(location: { state?: unknown }): string {
  const state = location.state as { message?: string } | null;
  return state?.message || '';
}
