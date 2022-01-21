import { getAppList } from '@/utils/steam';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useMemo, useState } from 'react';
import ListItem from './item';
import styles from './index.module.css';
import useFn from '@/hooks/useFn';
import useEnter from '@/hooks/useEnter';
import { orderGameList } from '@/utils/helper';

const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';
const KEY_ENTER = 'Enter';

export default function List() {
  const [apps, setApps] = useState<Record<string, Game.App>>();
  const [selected, setSelected] = useState<Game.App>();
  const [query, setQuery] = useState('');
  const appList = useMemo(() => orderGameList(apps, { query }), [apps, query]);

  useEnter(() => {
    utools.setSubInput(
      (text: any) => {
        setQuery(text.text);
      },
      '输入游戏名称进行筛选',
      true
    );
    setQuery('');
    setSelected(undefined);
    getAppList().then(setApps);
  });

  const onSelect = useCallback((item: Game.App) => {
    setSelected(item);
  }, []);

  const onKeyPress = useFn((ev: KeyboardEvent) => {
    if (!appList) return;
    const { key } = ev;
    if (key !== KEY_DOWN && key !== KEY_UP && key !== KEY_ENTER) return;
    ev.preventDefault();

    if (key === KEY_ENTER) {
      if (!selected) return;
      window.launchGame(selected);
      return;
    }

    const currentIndex = appList.findIndex(
      (it) => it.appid === selected?.appid
    );
    let nextIndex = currentIndex + (key === KEY_DOWN ? 1 : -1);
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= appList.length) nextIndex = appList.length - 1;
    setSelected(appList[nextIndex]);
  });

  useEffect(() => {
    document.onkeydown = onKeyPress;

    return () => {
      document.onkeydown = null;
    };
  }, []);

  useEffect(() => {
    setSelected((prev) => {
      if (appList?.find((it) => it.appid === prev?.appid)) return prev;
      return appList?.[0];
    });
  }, [appList]);

  return (
    <div className={styles.box}>
      <div className={styles.list}>
        {appList?.map((it, i) => (
          <ListItem
            key={it.appid}
            item={it}
            select={selected?.appid === it.appid}
            index={i}
            onHover={onSelect}
            onSelect={window.launchGame}
          />
        ))}
      </div>
    </div>
  );
}
