
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Appearance } from 'react-native';

import { load, save } from '@/lib/storage';

export type Mode = 'system' | 'light' | 'dark';

type ThemeContextType = {
  mode: Mode;
  setMode: (mode: Mode) => void;
};

const Ctx = createContext<ThemeContextType>({
  mode: 'system',
  setMode: () => {},
});

export const useThemeMode = () => useContext(Ctx);

export function ThemeModeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [mode, setModeState] = useState<Mode>('system');

  const apply = (m: Mode) => {
    Appearance.setColorScheme(
      m === 'system' ? 'unspecified' : m
    );
  };

  useEffect(() => {
    let mounted = true;

    const loadTheme = async () => {
      try {
        const savedMode = await load<Mode>('theme-mode', 'system');

        if (!mounted) return;

        const validMode: Mode =
          savedMode === 'light' || savedMode === 'dark'
            ? savedMode
            : 'system';

        setModeState(validMode);
        apply(validMode);
      } catch (error) {
        console.error('Failed to load theme preference:', error);
        apply('system');
      }
    };

    loadTheme();

    return () => {
      mounted = false;
    };
  }, []);

  const setMode = (m: Mode) => {
    setModeState(m);
    apply(m);

    save('theme-mode', m).catch((error) => {
      console.error('Failed to save theme preference:', error);
    });
  };

  return (
    <Ctx.Provider value={{ mode, setMode }}>
      {children}
    </Ctx.Provider>
  );
}
