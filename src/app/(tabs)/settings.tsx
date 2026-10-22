import { router } from 'expo-router';
import { ScrollView } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Group, NavRow } from '@/components/settings-ui';
import { Screen } from '@/components/ui';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding';
import { usePrefs } from '@/context/preferences';
import { useProjects } from '@/context/projects';
import { useThemeMode } from '@/context/theme-mode';

const LABEL = { system: 'System', light: 'Light', dark: 'Dark' } as const;
const SORT = { updated: 'Recently edited', created: 'Newest', title: 'A to Z' } as const;

export default function Settings() {
  const { mode } = useThemeMode();
  const { prefs } = usePrefs();
  const { projects } = useProjects();
  const { replay } = useOnboarding();
  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: Spacing.three, gap: Spacing.four, paddingBottom: BottomTabInset + Spacing.five }}>
        <ThemedText type="title">Settings</ThemedText>
        <Group title="Preferences">
          <NavRow icon="color-palette-outline" color="#6C5CE7" title="Appearance" value={LABEL[mode]} onPress={() => router.push('/settings/appearance')} />
          <NavRow icon="albums-outline" color="#F0824C" title="Projects" value={SORT[prefs.sort]} onPress={() => router.push('/settings/projects')} />
          <NavRow icon="pulse-outline" color="#22A06B" title="Status checks" value={prefs.autoCheck ? 'Automatic' : 'Manual'} onPress={() => router.push('/settings/monitoring')} />
        </Group>
        <Group title="Your data">
          <NavRow icon="server-outline" color="#3B82F6" title="Data & storage" value={`${projects.length} projects`} onPress={() => router.push('/settings/data')} />
        </Group>
        <Group title="Help">
          <NavRow icon="play-circle-outline" color="#E84A8A" title="Replay introduction" chevron={false} onPress={replay} />
          <NavRow icon="information-circle-outline" color="#00A8A8" title="About" onPress={() => router.push('/settings/about')} />
        </Group>
      </ScrollView>
    </Screen>
  );
}
