import ListItem from '@/components/game/item';
import useAppList from '@/hooks/useAppList';
import { Panel } from 'rsuite';

export default function GamesPanel() {
  const { appList, selected } = useAppList();

  return (
    <Panel>
      <div>
        {appList?.map((it, i) => (
          <ListItem
            key={it.appid}
            item={it}
            select={selected?.appid === it.appid}
            index={i}
            onSelect={window.launchGame}
            hideAppId
            hidePlayTime
          />
        ))}
      </div>
    </Panel>
  );
}
