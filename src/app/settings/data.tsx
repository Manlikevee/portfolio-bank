import { Alert, Share, View } from 'react-native';

import { Group, InfoRow, SubScreen } from '@/components/settings-ui';
import { Button } from '@/components/ui';
import { usePrefs } from '@/context/preferences';
import { useProjects } from '@/context/projects';

export default function DataSettings() {
  const { projects, clearAll } = useProjects();
  const { reset } = usePrefs();
  const features = projects.reduce((n, p) => n + p.features.length, 0);
  const images = projects.reduce((n, p) => n + p.images.length, 0);
  const exportJson = () =>
    Share.share({ message: JSON.stringify(projects.map((p) => ({ ...p, images: [] })), null, 2) });
  const clear = () =>
    Alert.alert('Delete all projects?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' }, { text: 'Delete all', style: 'destructive', onPress: clearAll },
    ]);
  const resetPrefs = () =>
    Alert.alert('Reset preferences?', 'Your projects are kept. Theme is not changed.', [
      { text: 'Cancel', style: 'cancel' }, { text: 'Reset', onPress: reset },
    ]);
  return (
    <SubScreen title="Data & storage">
      <Group title="On this device" footer="Everything is stored locally. Nothing is uploaded.">
        <InfoRow title="Projects" value={String(projects.length)} />
        <InfoRow title="Features" value={String(features)} />
        <InfoRow title="Images" value={String(images)} />
      </Group>
      <View style={{ gap: 12 }}>
        <Button label="Export as JSON (without images)" icon="share-outline" variant="secondary" onPress={exportJson} />
        <Button label="Reset preferences" icon="refresh" variant="secondary" onPress={resetPrefs} />
        <Button label="Delete all projects" icon="trash-outline" variant="danger" onPress={clear} />
      </View>
    </SubScreen>
  );
}
