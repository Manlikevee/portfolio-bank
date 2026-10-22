import Constants from 'expo-constants';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { View } from 'react-native';

import { Group, InfoRow, NavRow, SubScreen } from '@/components/settings-ui';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding';

export default function About() {
  const { replay } = useOnboarding();
  return (
    <SubScreen title="About">
      <View style={{ alignItems: 'center', gap: Spacing.two, paddingVertical: Spacing.three }}>
        <Image source={require('../../../assets/images/icon.png')} style={{ width: 84, height: 84, borderRadius: Radius.lg }} />
        <ThemedText type="subtitle">Portfolio Bank</ThemedText>
        <ThemedText type="small" themeColor="textSecondary">Keep track of everything you build.</ThemedText>
      </View>
      <Group>
        <InfoRow title="Version" value={Constants.expoConfig?.version ?? '1.0.0'} />
        <InfoRow title="Built with" value="Expo & React Native" />
      </Group>
      <Group>
        <NavRow icon="play-circle-outline" color="#E84A8A" title="Replay introduction" chevron={false}
          onPress={() => { router.dismissAll(); replay(); }} />
      </Group>
    </SubScreen>
  );
}
