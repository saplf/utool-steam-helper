import { getAppList } from '@/utils/steam';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';

export default function List() {
  const [appList, setAppList] = useState<Game.App[]>();

  const onPluginEnter = useCallback(() => {
    utools.setSubInput(
      (text: any) => {
        console.log(text);
      },
      '输入游戏名称进行筛选',
      true
    );
  }, []);

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    getAppList().then(setAppList);

    return () => removeToolListener('pluginEnter', onPluginEnter);
  }, []);

  return (
    <div>
      {appList?.map((it) => (
        <div key={it.appid}>
          {it.icon && <img width={40} src={`file:///${it.icon}`} />}
          <span>{it.name}</span>
        </div>
      ))}
    </div>
  );
}
