import type { ContentSection } from '../../services/content.service';

export type SectionType = 'header' | 'banner' | 'about' | 'testimonials' | 'contact' | 'footer';

export const SECTION_TYPES: { key: SectionType; icon: string; defaultSort: number }[] = [
  { key: 'header', icon: 'fa-bars', defaultSort: 0 },
  { key: 'banner', icon: 'fa-image', defaultSort: 1 },
  { key: 'about', icon: 'fa-user', defaultSort: 2 },
  { key: 'testimonials', icon: 'fa-quote-right', defaultSort: 5 },
  { key: 'contact', icon: 'fa-envelope', defaultSort: 3 },
  { key: 'footer', icon: 'fa-shoe-prints', defaultSort: 4 },
];

export const getSectionIcon = (key?: string): string =>
  SECTION_TYPES.find(s => s.key === key)?.icon || 'fa-file';

export function getEmptyItem(sectionKey: SectionType, lang: string): Partial<ContentSection> {
  const base: Partial<ContentSection> = {
    sectionKey,
    language: lang,
    isActive: true,
    sortOrder: SECTION_TYPES.find(s => s.key === sectionKey)?.defaultSort ?? 10,
  };
  switch (sectionKey) {
    case 'header':
      return { ...base, title: 'Waleska Astral', navItems: [{ label: '', sectionId: '' }] };
    case 'banner':
      return { ...base, title: '', subtitle: '', description: '', buttons: [{ text: '', url: '#contact', variant: 'primary', target: '_self' }] };
    case 'about':
      return { ...base, title: '', paragraphs: [''] };
    case 'testimonials':
      return { ...base, title: '' };
    case 'contact':
      return { ...base, title: '', subtitle: '', description: '', buttons: [{ text: '', url: '', variant: 'primary', target: '_blank' }] };
    case 'footer':
      return {
        ...base,
        title: 'Waleska Astral',
        imageUrl: '/assets/images/logo-whte.png',
        slogan: '',
        copyrightText: '',
        navigationTitle: '',
        contactTitle: '',
        contactEmail: '',
        footerNavLinks: [{ label: '', sectionId: '' }],
        buttons: [{ text: '', url: '', variant: 'primary', target: '_blank' }],
        legalLinks: [{ label: '', url: '#' }],
        socialLinks: [{ platform: '', url: '', icon: '', label: '' }],
      };
    default:
      return base;
  }
}

/** Descarta las filas vacías que quedan al usar los botones "Agregar". */
export function cleanList<T extends Record<string, any>>(list: T[] | undefined, fields: string[]): T[] | undefined {
  if (!list) return list;
  return list.filter(item => fields.some(field => String((item as any)[field] ?? '').trim() !== ''));
}

export function validateRequired(editing: Partial<ContentSection>, t: (key: string) => string): string[] {
  const errors: string[] = [];
  if (!editing.title?.trim()) errors.push(t('Backoffice.TitleRequired'));
  switch (editing.sectionKey as SectionType) {
    case 'header':
      if (!editing.navItems?.length || editing.navItems.every(n => !n.label.trim())) errors.push(t('Backoffice.NavItemsRequired'));
      break;
    case 'banner':
      if (!editing.subtitle?.trim()) errors.push(t('Backoffice.SubtitleRequired'));
      if (!editing.description?.trim()) errors.push(t('Backoffice.DescriptionRequired'));
      break;
    case 'about':
      if (!editing.paragraphs?.length || editing.paragraphs.every(p => !p.trim())) errors.push(t('Backoffice.ParagraphsRequired'));
      break;
    case 'contact':
      if (!editing.description?.trim()) errors.push(t('Backoffice.DescriptionRequired'));
      if (!editing.buttons?.length || editing.buttons.every(b => !b.text.trim())) errors.push(t('Backoffice.ButtonTextRequired'));
      break;
    case 'footer':
      if (!editing.slogan?.trim()) errors.push(t('Backoffice.SloganRequired'));
      if (!editing.copyrightText?.trim()) errors.push(t('Backoffice.CopyrightRequired'));
      if (!editing.navigationTitle?.trim()) errors.push(t('Backoffice.NavigationTitleRequired'));
      if (!editing.contactTitle?.trim()) errors.push(t('Backoffice.ContactTitleRequired'));
      if (!editing.footerNavLinks?.some(f => f.label?.trim() && f.sectionId?.trim())) errors.push(t('Backoffice.FooterNavRequired'));
      if (!editing.buttons?.length || editing.buttons.every(b => !b.text.trim())) errors.push(t('Backoffice.ButtonTextRequired'));
      break;
  }
  return errors;
}

export function toEditable(item: ContentSection): Partial<ContentSection> {
  return {
    ...item,
    paragraphs: item.paragraphs ? [...item.paragraphs] : [],
    navItems: item.navItems ? item.navItems.map(n => ({ ...n })) : [],
    buttons: item.buttons ? item.buttons.map(b => ({ ...b })) : [],
    footerNavLinks: item.footerNavLinks ? item.footerNavLinks.map(f => ({ ...f })) : [],
    legalLinks: item.legalLinks ? item.legalLinks.map(l => ({ ...l })) : [],
    socialLinks: item.socialLinks ? item.socialLinks.map(s => ({ ...s })) : [],
  };
}
