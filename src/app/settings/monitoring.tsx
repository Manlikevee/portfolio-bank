import { View } from 'react-native';

import { ChoiceRow, Group, InfoRow, SubScreen, SwitchRow } from '@/components/settings-ui';
import { Button } from '@/components/ui';
import { usePrefs } from '@/context/preferences';
import { useProjects } from '@/context/projects';

const TIMEOUTS = [5, 8, 15] as const;

export default function Monitoring() {
  const { prefs, setPref } = usePrefs();
  const { projects, checks, checkAll } = useProjects();
  const results = Object.values(checks).flatMap((c) => [c.website, c.backend]).filter(Boolean);
  const up = results.filter((r) => r?.state === 'up').length;
  const down = results.filter((r) => r?.state === 'down').length;
  const monitored = projects.filter((p) => p.websiteUrl || p.backendUrl).length;
  return (
    <SubScreen title="Status checks">
      <Group footer="When on, sites are pinged whenever you open the Status tab or a project.">
        <SwitchRow title="Check automatically" subtitle="Run live checks when screens open" value={prefs.autoCheck} onValueChange={(v) => setPref('autoCheck', v)} />
      </Group>
      <Group title="Timeout" footer="How long to wait for a site to answer before marking it offline.">
        {TIMEOUTS.map((s) => <ChoiceRow key={s} title={`${s} seconds`} selected={prefs.timeoutSec === s} onPress={() => setPref('timeoutSec', s)} />)}
      </Group>
      <Group title="Last results">
        <InfoRow title="Projects monitored" value={String(monitored)} />
        <InfoRow title="Online" value={String(up)} />
        <InfoRow title="Offline" value={String(down)} />
      </Group>
      <View><Button label="Check all now" icon="refresh" variant="secondary" onPress={checkAll} /></View>
    </SubScreen>
  );
}
