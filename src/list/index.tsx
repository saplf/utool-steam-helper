import { getAppList } from '@/utils/steam';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';
import ListItem from './item';
import styles from './index.module.css';
import useFn from '@/hooks/useFn';

export default function List() {
  const [appList, setAppList] = useState<Game.App[]>();
  const [selected, setSelected] = useState<string>();

  const onPluginEnter = useCallback(() => {
    utools.setSubInput(
      (text: any) => {
        console.log(text);
      },
      '输入游戏名称进行筛选',
      true
    );
  }, []);

  const onSelect = useCallback((item: Game.App) => {
    setSelected(item.appid);
  }, []);

  const onKeyPress = useFn((ev: KeyboardEvent) => {
    const { key } = ev;
    if (key === 'ArrowDown') {
      
    }
  });

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    getAppList().then(setAppList);
    document.onkeydown = onKeyPress;

    return () => {
      removeToolListener('pluginEnter', onPluginEnter);
      document.onkeydown = null;
    };
  }, []);

  useEffect(() => {
    setSelected((prev) => {
      if (appList?.find((it) => it.appid === prev)) return prev;
      return appList?.[0]?.appid;
    });
  }, [appList]);

  return (
    <div className={styles.list}>
      {appList?.map((it, i) => (
        <ListItem
          key={it.appid}
          item={it}
          select={selected === it.appid}
          index={i}
          onHover={onSelect}
        />
      ))}
    </div>
  );
}
