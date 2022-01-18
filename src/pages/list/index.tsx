import { getAppList } from '@/utils/steam';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';
import ListItem from './item';
import styles from './index.module.css';
import useFn from '@/hooks/useFn';

const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';

export default function List() {
  const [appList, setAppList] = useState<Game.App[]>();
  const [selected, setSelected] = useState<Game.App>();

  const onPluginEnter = useCallback(() => {
    utools.setSubInput(
      (text: any) => {
        console.log(text);
      },
      '输入游戏名称进行筛选',
      true
    );
    getAppList().then(setAppList);
  }, []);

  const onSelect = useCallback((item: Game.App) => {
    setSelected(item);
  }, []);

  const onKeyPress = useFn((ev: KeyboardEvent) => {
    if (!appList) return;
    const { key } = ev;
    if (key !== KEY_DOWN && key !== KEY_UP) return;
    ev.preventDefault();
    const currentIndex = appList.findIndex(
      (it) => it.appid === selected?.appid
    );
    let nextIndex = currentIndex + (key === KEY_DOWN ? 1 : -1);
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= appList.length) nextIndex = appList.length - 1;
    setSelected(appList[nextIndex]);
  });

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    document.onkeydown = onKeyPress;

    return () => {
      removeToolListener('pluginEnter', onPluginEnter);
      document.onkeydown = null;
    };
  }, []);

  useEffect(() => {
    console.log(appList);
    setSelected((prev) => {
      if (appList?.find((it) => it.appid === prev?.appid)) return prev;
      return appList?.[0];
    });
  }, [appList]);

  return (
    <div className={styles.box}>
      {/* {selected?.library && (
        <img className={styles.bg} src={`file:///${selected.library}`} />
      )} */}
      <div className={styles.list}>
        {appList?.map((it, i) => (
          <ListItem
            key={it.appid}
            item={it}
            select={selected?.appid === it.appid}
            index={i}
            onHover={onSelect}
          />
        ))}
      </div>
    </div>
  );
}
