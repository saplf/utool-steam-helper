import Page from '@/components/page';
import ListItem from '@/components/game/item';
import styles from './index.module.less';
import useAppList from '@/hooks/useAppList';

export default function List() {
  const { appList, selected, setSelected } = useAppList({
    onEnterApp: ({ setQuery }) => {
      utools.setSubInput(
        (text: any) => {
          setQuery(text.text);
        },
        '输入游戏名称进行筛选',
        true
      );
    },
    onExecGame: window.launchGame,
  });

  return (
    <Page>
      <div className={styles.list}>
        {appList?.map((it, i) => (
          <ListItem
            key={it.appid}
            item={it}
            select={selected?.appid === it.appid}
            index={i}
            onHover={setSelected}
            onSelect={window.launchGame}
          />
        ))}
      </div>
    </Page>
  );
}
