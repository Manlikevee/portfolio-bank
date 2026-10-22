import {
  PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';

import { Onboarding } from '@/components/onboarding';
import { OnboardingProvider, useOnboarding } from '@/context/onboarding';
import { PrefsProvider } from '@/context/preferences';
import { ProjectsProvider } from '@/context/projects';
import { ThemeModeProvider } from '@/context/theme-mode';
import { Colors } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

function Navigator() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const c = Colors[scheme];
  const { seen } = useOnboarding();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = { ...base, colors: { ...base.colors, background: c.background, card: c.background, text: c.text, border: c.border, primary: c.primary } };
  return (
    <ThemeProvider value={theme}>
      <StatusBar style="auto" />
      <View style={{ flex: 1, backgroundColor: c.background }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="project/[id]" />
          <Stack.Screen name="project/form" options={{ presentation: 'modal' }} />
          <Stack.Screen name="settings" />
        </Stack>
        {/* Overlay: blank while loading the flag, onboarding slider on first launch. */}
        {seen !== true && (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: c.background }]}>
            {seen === false && <Onboarding />}
          </View>
        )}
      </View>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular, PlusJakartaSans_500Medium, PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold, PlusJakartaSans_800ExtraBold,
  });
  useEffect(() => { if (loaded || error) SplashScreen.hideAsync(); }, [loaded, error]);
  if (!loaded && !error) return null;
  return (
    <ThemeModeProvider>
      <PrefsProvider>
        <OnboardingProvider>
          <ProjectsProvider>
            <Navigator />
          </ProjectsProvider>
        </OnboardingProvider>
      </PrefsProvider>
    </ThemeModeProvider>
  );
}
