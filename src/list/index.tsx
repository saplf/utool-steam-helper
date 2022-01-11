import { getAppList } from '@/utils/steam';
import { useEffect, useState } from 'react';

export default function List() {
  const [appList, setAppList] = useState<Game.App[]>();

  useEffect(() => {
    utools.setSubInput(
      (text: any) => {
        console.log(text);
      },
      '输入游戏名称进行筛选',
      true
    );

    getAppList().then(setAppList);
  }, []);

  return (
    <div>
      <span>游戏列表</span>
      {appList?.map((it) => (
        <div key={it.appid}>
          <span>appid: {it.appid}</span>
          <span>size: {it.SizeOnDisk}</span>
          <span>name: {it.name}</span>
          <span>image: {it.logo}</span>
          <img width={80} src={`file:///${it.logo}`} />
        </div>
      ))}
    </div>
  );
}
