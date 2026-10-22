import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Alert, Platform, Share } from 'react-native';

import { normalizeUrl } from './health';
import { Project } from './types';

/** Turns the app's light markdown (# heading, - bullet, **bold**, *italic*) into plain text. */
export function plainText(md: string) {
  return md
    .split('\n')
    .map((l) => l.replace(/^#+\s+/, '').replace(/^[-*]\s+/, '• ').replace(/\*\*([^*]+)\*\*/g, '$1').replace(/\*([^*]+)\*/g, '$1'))
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function buildMessage(p: Project) {
  const link = p.websiteUrl || p.repoUrl || p.backendUrl;
  return [
    p.summary ? `${p.title} — ${p.summary}` : p.title,
    plainText(p.description),
    link ? normalizeUrl(link) : '',
  ].filter(Boolean).join('\n\n');
}

/** Images are stored as data: URIs, so write one to the cache folder to get a shareable file. */
async function imageToFile(uri: string): Promise<{ uri: string; mime: string } | null> {
  try {
    const m = /^data:(image\/[a-z0-9.+-]+);base64,(.*)$/i.exec(uri);
    if (!m) return { uri, mime: 'image/jpeg' };
    const ext = m[1].split('/')[1].replace('jpeg', 'jpg');
    const file = new File(Paths.cache, `share-${Date.now()}.${ext}`);
    await file.write(m[2], { encoding: 'base64' });
    return { uri: file.uri, mime: m[1] };
  } catch {
    return null;
  }
}

export async function shareProject(p: Project, imageIndex = 0) {
  const message = buildMessage(p);
  const raw = p.images[imageIndex] ?? p.images[0];
  const textOnly = () => Share.share({ message, title: p.title });
  try {
    if (!raw) return await textOnly();
    const img = await imageToFile(raw);
    if (!img) return await textOnly();

    // iOS can send the image and the text together in one share sheet.
    if (Platform.OS === 'ios') return await Share.share({ message, url: img.uri });

    // Android can't attach a caption to a shared image, so let the person choose.
    Alert.alert('Share project', 'Android can send either the text and link, or the image on its own.', [
      { text: 'Text & link', onPress: () => { textOnly(); } },
      { text: 'Image', onPress: () => { Sharing.shareAsync(img.uri, { mimeType: img.mime, dialogTitle: p.title }); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  } catch {
    Alert.alert('Could not share', 'Something went wrong opening the share sheet.');
  }
}
