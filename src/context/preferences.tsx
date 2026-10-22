import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { load, save } from '@/lib/storage';

export type SortMode = 'updated' | 'created' | 'title';
export type OpenLinks = 'in-app' | 'browser';
export type Prefs = {
  sort: SortMode;
  showProgress: boolean;
  openLinks: OpenLinks;
  confirmDelete: boolean;
  autoCheck: boolean;
  timeoutSec: 5 | 8 | 15;
};
export const DEFAULT_PREFS: Prefs = {
  sort: 'updated', showProgress: true, openLinks: 'in-app', confirmDelete: true, autoCheck: true, timeoutSec: 8,
};

type Ctx = {
  prefs: Prefs; loaded: boolean;
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
  reset: () => void;
};
const PrefsContext = createContext<Ctx>({ prefs: DEFAULT_PREFS, loaded: false, setPref: () => {}, reset: () => {} });
export const usePrefs = () => useContext(PrefsContext);

export function PrefsProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    load<Partial<Prefs>>('prefs', {}).then((p) => { setPrefs({ ...DEFAULT_PREFS, ...p }); setLoaded(true); });
  }, []);
  useEffect(() => { if (loaded) save('prefs', prefs); }, [prefs, loaded]);

  const value: Ctx = {
    prefs, loaded,
    setPref: (key, v) => setPrefs((p) => ({ ...p, [key]: v })),
    reset: () => setPrefs(DEFAULT_PREFS),
  };
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}
