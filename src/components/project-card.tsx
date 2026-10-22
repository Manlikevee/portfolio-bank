import { Image } from 'expo-image';
import { router } from 'expo-router';
import { FlatList, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { ReactElement } from 'react';

import { BottomTabInset, Radius, Spacing } from '@/constants/theme';
import { useProjects } from '@/context/projects';
import { Project, progress } from '@/lib/types';
import { StatusDot } from './ui';
import { Icon } from './ui';
import { ThemedText } from './themed-text';
import { usePrefs } from '@/context/preferences';
import { useTheme } from '@/hooks/use-theme';

const PALETTE = ['#6C5CE7', '#00A8A8', '#F0824C', '#E84A8A', '#3B82F6', '#22A06B'];

export function Thumb({ project, style }: { project: Project; style?: StyleProp<ViewStyle> }) {
  const color = PALETTE[[...project.title].reduce((a, c) => a + c.charCodeAt(0), 0) % PALETTE.length];
  const uri = project.images[0];
  return (
    <View style={[{ aspectRatio: 1, borderRadius: Radius.md, overflow: 'hidden', backgroundColor: color, alignItems: 'center', justifyContent: 'center' }, style]}>
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        : <ThemedText type="title" style={{ color: '#fff' }}>{project.title.slice(0, 2).toUpperCase()}</ThemedText>}
    </View>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { toggleFavourite } = useProjects();
  const t = useTheme();
  const { prefs } = usePrefs();
  const { done, total } = progress(project);
  return (
    <Pressable
      style={({ pressed }) => ({
        flex: 1, maxWidth: '50%', gap: 6, padding: 5.6, borderRadius: Radius.sm, borderWidth: 1,
        borderColor: t.border, backgroundColor: t.backgroundElement, opacity: pressed ? 0.85 : 1,
      })}
      onPress={() => router.push({ pathname: '/project/[id]', params: { id: project.id } })}>
      <View>
        <Thumb project={project} style={{ borderRadius: 14 }} />
        <View style={[s.pill, { left: 8, backgroundColor: 'rgba(0,0,0,0.45)', flexDirection: 'row', gap: 6, paddingHorizontal: 10, alignItems: 'center' }]}>
          <StatusDot state={project.active ? 'on' : 'off'} size={8} />
          <ThemedText type="caption" style={{ color: '#fff' }}>{project.active ? 'Active' : 'Inactive'}</ThemedText>
        </View>
        <Pressable onPress={() => toggleFavourite(project.id)} hitSlop={8} accessibilityLabel="Toggle favourite"
          style={[s.pill, { right: 8, width: 32, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }]}>
          <Icon name={project.favourite ? 'heart' : 'heart-outline'} size={18} color={project.favourite ? '#FF6B70' : '#fff'} />
        </Pressable>
      </View>
      <View style={{ gap: 6, paddingHorizontal: 4, paddingBottom: 4 }}>
        <ThemedText type="bold"  numberOfLines={1}>{project.title}</ThemedText>
        <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>
          {project.category}{total ? ` · ${done}/${total} features` : ''}
        </ThemedText>
        {prefs.showProgress && total > 0 && (
          <View style={{ height: 4, borderRadius: 2, backgroundColor: t.backgroundSelected }}>
            <View style={{ height: 4, borderRadius: 2, width: `${(done / total) * 100}%`, backgroundColor: t.success }} />
          </View>
        )}
      </View>
    </Pressable>
  );
}

export function ProjectGrid({ data, header, empty }: { data: Project[]; header?: ReactElement; empty: ReactElement }) {
  return (
    <FlatList data={data} numColumns={2} keyExtractor={(p) => p.id} keyboardShouldPersistTaps="handled"
    showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}
      columnWrapperStyle={{ gap: 10  }}
      contentContainerStyle={{ padding: Spacing.two, gap: Spacing.three, paddingBottom: BottomTabInset + Spacing.five }}
      ListHeaderComponent={header} ListEmptyComponent={empty}
      renderItem={({ item }) => <ProjectCard project={item} />} />
  );
}

const s = StyleSheet.create({
  pill: { position: 'absolute', top: 8, height: 32, borderRadius: 16 },
});
