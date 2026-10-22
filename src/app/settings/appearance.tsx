import { Pressable, View } from 'react-native';

import { Group, SubScreen, SwitchRow } from '@/components/settings-ui';
import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui';
import { Colors, Radius, Spacing } from '@/constants/theme';
import { usePrefs } from '@/context/preferences';
import { Mode, useThemeMode } from '@/context/theme-mode';
import { useTheme } from '@/hooks/use-theme';

const MODES: [Mode, string][] = [['system', 'System'], ['light', 'Light'], ['dark', 'Dark']];

function Preview({ mode }: { mode: Mode }) {
  // "system" shows a split light/dark preview.
  const light = Colors.light, dark = Colors.dark;
  const half = (c: typeof light) => (
    <View style={{ flex: 1, backgroundColor: c.background, padding: 6, gap: 4, justifyContent: 'center' }}>
      <View style={{ height: 8, borderRadius: 4, backgroundColor: c.text, width: '70%' }} />
      <View style={{ height: 14, borderRadius: 5, backgroundColor: c.backgroundElement, borderWidth: 1, borderColor: c.border }} />
      <View style={{ height: 6, borderRadius: 3, backgroundColor: c.primary, width: '40%' }} />
    </View>
  );
  return (
    <View style={{ height: 70, flexDirection: 'row', borderRadius: Radius.sm, overflow: 'hidden' }}>
      {mode !== 'dark' && half(light)}
      {mode !== 'light' && half(dark)}
    </View>
  );
}

export default function Appearance() {
  const t = useTheme();
  const { mode, setMode } = useThemeMode();
  const { prefs, setPref } = usePrefs();
  return (
    <SubScreen title="Appearance">
      <View style={{ gap: Spacing.two }}>
        <ThemedText type="smallBold" themeColor="textSecondary" style={{ marginLeft: 4 }}>THEME</ThemedText>
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          {MODES.map(([m, label]) => {
            const on = mode === m;
            return (
              <Pressable key={m} onPress={() => setMode(m)} style={{ flex: 1, gap: 8, padding: 8, borderRadius: Radius.md, backgroundColor: t.backgroundElement, borderWidth: 2, borderColor: on ? t.primary : t.border }}>
                <Preview mode={m} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  {on && <Icon name="checkmark-circle" size={16} color={t.primary} />}
                  <ThemedText type="smallBold">{label}</ThemedText>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
      <Group title="Cards" footer="Applies to project cards on Home and Favourites.">
        <SwitchRow title="Show progress bar" subtitle="Feature completion under each project card" value={prefs.showProgress} onValueChange={(v) => setPref('showProgress', v)} />
      </Group>
    </SubScreen>
  );
}
