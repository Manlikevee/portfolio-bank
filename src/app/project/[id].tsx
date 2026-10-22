import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Alert, Linking, Pressable, ScrollView, useWindowDimensions, View } from 'react-native';

import { ImageViewer } from '@/components/image-viewer';
import { LiveBadge } from '@/components/live-badge';
import { Thumb } from '@/components/project-card';
import { RichText } from '@/components/rich-text';
import { ThemedText } from '@/components/themed-text';
import { Button, EmptyState, Icon, IconButton, Screen, Section, StatusDot, Tag } from '@/components/ui';
import { Radius, Spacing } from '@/constants/theme';
import { usePrefs } from '@/context/preferences';
import { useProjects } from '@/context/projects';
import { normalizeUrl } from '@/lib/health';
import { shareProject } from '@/lib/share';
import { progress } from '@/lib/types';
import { useTheme } from '@/hooks/use-theme';

export default function ProjectDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { get, checks, check, toggleActive, toggleFavourite, toggleFeature, remove } = useProjects();
  const { width } = useWindowDimensions();
  const t = useTheme();
  const { prefs, loaded } = usePrefs();
  const [viewerOpen, setViewerOpen] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);
  const p = get(id);
  useEffect(() => { if (id && loaded && prefs.autoCheck) check(id); }, [id, check, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!p) {
    return (
      <Screen>
        <View style={{ padding: Spacing.three }}><IconButton name="chevron-back" label="Back" onPress={() => router.back()} /></View>
        <EmptyState icon="alert-circle-outline" title="Project not found" message="It may have been deleted." />
      </Screen>
    );
  }
  const { done, total } = progress(p);
  const pending = p.features.filter((f) => !f.done);
  const completed = p.features.filter((f) => f.done);
  const open = (url: string) =>
    prefs.openLinks === 'browser' ? Linking.openURL(normalizeUrl(url)) : WebBrowser.openBrowserAsync(normalizeUrl(url));
  const confirmDelete = () => {
    if (!prefs.confirmDelete) { remove(p.id); router.back(); return; }
    Alert.alert('Delete project?', p.title, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { remove(p.id); router.back(); } },
    ]);
  };
  const links: [string, string, 'globe-outline' | 'server-outline' | 'logo-github'][] = [
    ['Website', p.websiteUrl, 'globe-outline'], ['Backend', p.backendUrl, 'server-outline'], ['Repository', p.repoUrl, 'logo-github'],
  ];
  const feature = (f: { id: string; title: string; done: boolean }) => (
    <Pressable key={f.id} onPress={() => toggleFeature(p.id, f.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 }}>
      <Icon name={f.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={f.done ? t.success : t.textSecondary} />
      <ThemedText style={{ flex: 1, textDecorationLine: f.done ? 'line-through' : 'none', opacity: f.done ? 0.6 : 1 }}>{f.title}</ThemedText>
    </Pressable>
  );

  return (
    <Screen>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: Spacing.three }}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <View style={{ flexDirection: 'row', gap: Spacing.two }}>
          <IconButton name="share-outline" label="Share project" onPress={() => shareProject(p, imgIndex)} />
          <IconButton name={p.favourite ? 'heart' : 'heart-outline'} label="Favourite" color={p.favourite ? t.danger : undefined} onPress={() => toggleFavourite(p.id)} />
          <IconButton name="create-outline" label="Edit" onPress={() => router.push({ pathname: '/project/form', params: { id: p.id } })} />
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: Spacing.six, gap: Spacing.four }}>
        {p.images.length > 0 ? (
          <View>
            <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
              onMomentumScrollEnd={(e) => setImgIndex(Math.round(e.nativeEvent.contentOffset.x / width))}>
              {p.images.map((uri, i) => (
                <Pressable key={i} onPress={() => { setImgIndex(i); setViewerOpen(true); }} accessibilityLabel="View full image"
                  style={{ width: width - Spacing.three * 2, marginHorizontal: Spacing.three }}>
                  <Image source={{ uri }} contentFit="cover" style={{ width: '100%', height: 220, borderRadius: Radius.lg }} />
                </Pressable>
              ))}
            </ScrollView>
            <View pointerEvents="none" style={{ position: 'absolute', right: Spacing.three + 10, bottom: 10, flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 14, paddingHorizontal: 10, height: 28 }}>
              <Icon name="expand-outline" size={14} color="#fff" />
              <ThemedText type="caption" style={{ color: '#fff' }}>{p.images.length > 1 ? `${imgIndex + 1}/${p.images.length}` : 'Tap to expand'}</ThemedText>
            </View>
          </View>
        ) : <Thumb project={p} style={{ aspectRatio: 16 / 9, marginHorizontal: Spacing.three, borderRadius: Radius.lg }} />}

        <View style={{ paddingHorizontal: Spacing.three, gap: Spacing.four }}>
          <View style={{ gap: 4 }}>
            <ThemedText type="title">{p.title}</ThemedText>
            <ThemedText themeColor="textSecondary">{p.category}{p.summary ? ` · ${p.summary}` : ''}</ThemedText>
          </View>

          <Section title="Status">
            <View style={{ gap: 10, backgroundColor: t.backgroundElement, borderRadius: Radius.md, padding: Spacing.three }}>
              <Pressable onPress={() => toggleActive(p.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <StatusDot state={p.active ? 'on' : 'off'} />
                <ThemedText type="small"><ThemedText type="smallBold">Manual</ThemedText>  {p.active ? 'Active' : 'Inactive'} (tap to change)</ThemedText>
              </Pressable>
              {p.websiteUrl ? <LiveBadge label="Website" h={checks[p.id]?.website} /> : null}
              {p.backendUrl ? <LiveBadge label="Backend" h={checks[p.id]?.backend} /> : null}
              {(p.websiteUrl || p.backendUrl) ? <Button label="Check now" icon="refresh" variant="secondary" onPress={() => check(p.id)} style={{ alignSelf: 'flex-start' }} /> : null}
            </View>
          </Section>

          {p.description ? <Section title="About"><RichText text={p.description} /></Section> : null}

          {p.stack.length > 0 && (
            <Section title="Tech stack">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two }}>{p.stack.map((s) => <Tag key={s} label={s} />)}</View>
            </Section>
          )}

          {total > 0 && (
            <Section title="Features" action={<ThemedText type="smallBold" themeColor="textSecondary">{done}/{total} done</ThemedText>}>
              {pending.length > 0 && <ThemedText type="smallBold" themeColor="textSecondary">Pending</ThemedText>}
              {pending.map(feature)}
              {completed.length > 0 && <ThemedText type="smallBold" themeColor="textSecondary" style={{ marginTop: 6 }}>Completed</ThemedText>}
              {completed.map(feature)}
            </Section>
          )}

          {links.some(([, u]) => u) && (
            <Section title="Links">
              {links.filter(([, u]) => u).map(([label, url, icon]) => (
                <Pressable key={label} onPress={() => open(url)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: t.backgroundElement, borderRadius: Radius.md, padding: Spacing.three }}>
                  <Icon name={icon} />
                  <View style={{ flex: 1 }}>
                    <ThemedText type="smallBold">{label}</ThemedText>
                    <ThemedText type="small" themeColor="textSecondary" numberOfLines={1}>{url}</ThemedText>
                  </View>
                  <Icon name="open-outline" size={18} color={t.textSecondary} />
                </Pressable>
              ))}
            </Section>
          )}
          <Button label="Delete project" icon="trash-outline" variant="danger" onPress={confirmDelete} />
        </View>
      </ScrollView>
      <ImageViewer images={p.images} startIndex={imgIndex} visible={viewerOpen} onClose={() => setViewerOpen(false)} />
    </Screen>
  );
}
