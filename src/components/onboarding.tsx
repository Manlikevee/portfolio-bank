import { useRef, useState } from 'react';
import { Animated, FlatList, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Spacing } from '@/constants/theme';
import { useOnboarding } from '@/context/onboarding';
import { useTheme } from '@/hooks/use-theme';
import { Button, Icon, IconName, Screen } from './ui';
import { ThemedText } from './themed-text';

type Slide = { icon: IconName; color: string; title: string; body: string };
const SLIDES: Slide[] = [
  { icon: 'albums-outline', color: '#6C5CE7', title: 'All your work, one place', body: 'Portfolio Bank keeps every project you have built together, with images, notes and links, right on your device.' },
  { icon: 'create-outline', color: '#F0824C', title: 'Capture the details', body: 'Add screenshots, a formatted description, your tech stack and a feature checklist for each project.' },
  { icon: 'checkmark-done-outline', color: '#22A06B', title: 'Track your progress', body: 'Tick off features as you ship them and watch the progress bars fill up on every card.' },
  { icon: 'pulse-outline', color: '#3B82F6', title: 'Know what is live', body: 'Live checks ping your website and backend so you can see at a glance what is online or down.' },
  { icon: 'share-social-outline', color: '#E84A8A', title: 'Share and make it yours', body: 'Share any project with its image, overview and link. Pin favourites and pick your theme in Settings.' },
];

export function Onboarding() {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { finish } = useOnboarding();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const [scrollX] = useState(() => new Animated.Value(0));
  const last = index === SLIDES.length - 1;

  const next = () => {
    if (last) return finish();
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  return (
    <Screen>
      <View style={{ height: 48, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: Spacing.three }}>
        {!last && (
          <Pressable onPress={finish} hitSlop={12} accessibilityLabel="Skip introduction">
            <ThemedText type="smallBold" themeColor="textSecondary">Skip</ThemedText>
          </Pressable>
        )}
      </View>

      <Animated.FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(s) => s.title}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        scrollEventThrottle={16}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={{ width, paddingHorizontal: Spacing.five, alignItems: 'center', justifyContent: 'center', gap: Spacing.four }}>
            <View style={{ width: 240, height: 240, borderRadius: 120, backgroundColor: item.color + '14', alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ width: 168, height: 168, borderRadius: 84, backgroundColor: item.color + '26', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 96, height: 96, borderRadius: 28, backgroundColor: item.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={item.icon} size={46} color="#fff" />
                </View>
              </View>
            </View>
            <View style={{ gap: Spacing.two, alignItems: 'center' }}>
              <ThemedText type="title" style={{ textAlign: 'center' }}>{item.title}</ThemedText>
              <ThemedText themeColor="textSecondary" style={{ textAlign: 'center' }}>{item.body}</ThemedText>
            </View>
          </View>
        )}
        style={{ flex: 1 }}
      />

      <View style={{ paddingHorizontal: Spacing.three, paddingBottom: insets.bottom + Spacing.three, gap: Spacing.four, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', gap: 6, height: 8 }}>
          {SLIDES.map((s, i) => {
            const range = [(i - 1) * width, i * width, (i + 1) * width];
            return (
              <Animated.View key={s.title} style={{
                height: 8, borderRadius: 4, backgroundColor: t.primary,
                width: scrollX.interpolate({ inputRange: range, outputRange: [8, 26, 8], extrapolate: 'clamp' }),
                opacity: scrollX.interpolate({ inputRange: range, outputRange: [0.3, 1, 0.3], extrapolate: 'clamp' }),
              }} />
            );
          })}
        </View>
        <Button label={last ? 'Get started' : 'Next'} icon={last ? 'checkmark' : 'arrow-forward'} onPress={next} style={{ alignSelf: 'stretch' }} />
      </View>
    </Screen>
  );
}
