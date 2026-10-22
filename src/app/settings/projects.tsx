import { ChoiceRow, Group, SubScreen, SwitchRow } from '@/components/settings-ui';
import { OpenLinks, SortMode, usePrefs } from '@/context/preferences';

const SORTS: [SortMode, string, string][] = [
  ['updated', 'Recently edited', 'Projects you touched last come first'],
  ['created', 'Newest first', 'By the date you added them'],
  ['title', 'A to Z', 'Alphabetical by title'],
];
const LINKS: [OpenLinks, string, string][] = [
  ['in-app', 'In-app browser', 'Stay inside Portfolio Bank'],
  ['browser', 'Default browser', 'Open Safari, Chrome or your default'],
];

export default function ProjectSettings() {
  const { prefs, setPref } = usePrefs();
  return (
    <SubScreen title="Projects">
      <Group title="Sort projects by">
        {SORTS.map(([k, title, sub]) => <ChoiceRow key={k} title={title} subtitle={sub} selected={prefs.sort === k} onPress={() => setPref('sort', k)} />)}
      </Group>
      <Group title="Open links in">
        {LINKS.map(([k, title, sub]) => <ChoiceRow key={k} title={title} subtitle={sub} selected={prefs.openLinks === k} onPress={() => setPref('openLinks', k)} />)}
      </Group>
      <Group title="Safety">
        <SwitchRow title="Confirm before deleting" subtitle="Ask first when deleting a single project" value={prefs.confirmDelete} onValueChange={(v) => setPref('confirmDelete', v)} />
      </Group>
    </SubScreen>
  );
}
