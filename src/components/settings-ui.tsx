import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Children, ReactNode } from 'react';
import { Pressable, ScrollView, Switch, View } from 'react-native';

import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { IconButton, IconName, Screen } from './ui';
import { ThemedText } from './themed-text';

/** Page shell for every settings sub page: back button, title, scrolling body. */
export function SubScreen({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Screen>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.three, padding: Spacing.three }}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <ThemedText type="title" style={{ flex: 1 }}>{title}</ThemedText>
      </View>
      <ScrollView contentContainerStyle={{ padding: Spacing.three, gap: Spacing.four, paddingBottom: BottomTabInset + Spacing.five }}>
        {children}
      </ScrollView>
    </Screen>
  );
}

/** Rounded bordered block that holds rows, with hairline dividers between them. */
export function Group({ title, footer, children }: { title?: string; footer?: string; children: ReactNode }) {
  const t = useTheme();
  const rows = Children.toArray(children);
  return (
    <View style={{ gap: Spacing.two }}>
      {title ? <ThemedText type="smallBold" themeColor="textSecondary" style={{ marginLeft: 4 }}>{title.toUpperCase()}</ThemedText> : null}
      <View style={{ backgroundColor: t.backgroundElement, borderWidth: 1, borderColor: t.border, borderRadius: Radius.lg, overflow: 'hidden' }}>
        {rows.map((row, i) => (
          <View key={i} style={i > 0 ? { borderTopWidth: 1, borderTopColor: t.border } : undefined}>{row}</View>
        ))}
      </View>
      {footer ? <ThemedText type="caption" themeColor="textSecondary" style={{ marginHorizontal: 4 }}>{footer}</ThemedText> : null}
    </View>
  );
}

export function IconTile({ icon, color }: { icon: IconName; color: string }) {
  return (
    <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: color, alignItems: 'center', justifyContent: 'center' }}>
      <Ionicons name={icon} size={19} color="#fff" />
    </View>
  );
}

const rowStyle = { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, paddingHorizontal: Spacing.three } as const;

export function NavRow({ icon, color, title, value, onPress, chevron = true }: {
  icon: IconName; color: string; title: string; value?: string; onPress: () => void; chevron?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.6 : 1 }]}>
      <IconTile icon={icon} color={color} />
      <ThemedText type="bold" style={{ flex: 1 }}>{title}</ThemedText>
      {value ? <ThemedText type="small" themeColor="textSecondary">{value}</ThemedText> : null}
      {chevron ? <Ionicons name="chevron-forward" size={18} color={t.textSecondary} /> : null}
    </Pressable>
  );
}

export function SwitchRow({ title, subtitle, value, onValueChange }: {
  title: string; subtitle?: string; value: boolean; onValueChange: (v: boolean) => void;
}) {
  const t = useTheme();
  return (
    <View style={rowStyle}>
      <View style={{ flex: 1 }}>
        <ThemedText type="bold">{title}</ThemedText>
        {subtitle ? <ThemedText type="small" themeColor="textSecondary">{subtitle}</ThemedText> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} trackColor={{ true: t.success }} />
    </View>
  );
}

/** Single-choice row with a check mark on the selected option. */
export function ChoiceRow({ title, subtitle, selected, onPress }: {
  title: string; subtitle?: string; selected: boolean; onPress: () => void;
}) {
  const t = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [rowStyle, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={{ flex: 1 }}>
        <ThemedText type="bold">{title}</ThemedText>
        {subtitle ? <ThemedText type="small" themeColor="textSecondary">{subtitle}</ThemedText> : null}
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={22} color={t.primary} /> : <Ionicons name="ellipse-outline" size={22} color={t.border} />}
    </Pressable>
  );
}

export function InfoRow({ title, value }: { title: string; value: string }) {
  return (
    <View style={rowStyle}>
      <ThemedText type="bold" style={{ flex: 1 }}>{title}</ThemedText>
      <ThemedText themeColor="textSecondary">{value}</ThemedText>
    </View>
  );
}
