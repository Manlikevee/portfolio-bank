import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { load, save } from '@/lib/storage';

type Ctx = { seen: boolean | null; finish: () => void; replay: () => void };
const OnboardingContext = createContext<Ctx>({ seen: null, finish: () => {}, replay: () => {} });
export const useOnboarding = () => useContext(OnboardingContext);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [seen, setSeen] = useState<boolean | null>(null);
  useEffect(() => { load<boolean>('onboarded', false).then(setSeen); }, []);
  const finish = () => { setSeen(true); save('onboarded', true); };
  const replay = () => setSeen(false);
  return <OnboardingContext.Provider value={{ seen, finish, replay }}>{children}</OnboardingContext.Provider>;
}
