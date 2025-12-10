import React, { createContext, useContext, useState, ReactNode } from 'react';

type Lang = 'en' | 'es';

type Translations = Record<string, string>;

const translations: Record<Lang, Translations> = {
  en: {
    title: 'GitHub Dashboard',
    placeholder: 'GitHub username (e.g. octocat)',
    loading: 'Loading data...',
    error: 'Error',
    repos: 'Repositories',
    followers: 'Followers',
    following: 'Following',
    reposLabel: 'Repositories',
    totalStars: 'Total Stars',
    topLanguage: 'Top language',
    lastUpdatedRepo: 'Last updated repo',
    updated: 'Updated',
    openIssues: 'Open issues',
    noOpenIssues: 'No open issues 🎉',
    filterAll: 'All',
    languagesChartTitle: 'Languages distribution',
    themeDark: 'Dark',
    themeLight: 'Light',
  },
  es: {
    title: 'GitHub Dashboard',
    placeholder: 'Usuario de GitHub (ej: octocat)',
    loading: 'Cargando datos...',
    error: 'Error',
    repos: 'Repos',
    followers: 'Seguidores',
    following: 'Siguiendo',
    reposLabel: 'Repositorios',
    totalStars: 'Estrellas totales',
    topLanguage: 'Lenguaje principal',
    lastUpdatedRepo: 'Último repo actualizado',
    updated: 'Actualizado',
    openIssues: 'Issues abiertos',
    noOpenIssues: 'Sin issues abiertos 🎉',
    filterAll: 'Todos',
    languagesChartTitle: 'Distribución de lenguajes',
    themeDark: 'Oscuro',
    themeLight: 'Claro',
  },
};

interface I18nContextValue {
  lang: Lang;
  t: (key: string) => string;
  toggleLang: () => void;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');

  const t = (key: string): string => {
    return translations[lang][key] ?? key;
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'es' : 'en'));
  };

  return (
    <I18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
};
