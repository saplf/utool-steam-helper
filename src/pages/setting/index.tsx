import { parseHistoryInfo } from '@/utils/steamdb';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';

export default function Setting() {
  const [contents, setContents] = useState<string[]>();

  const onPluginEnter = useCallback(() => {
    utools.removeSubInput();
  }, []);

  const onClick = useCallback(() => {
    parseHistoryInfo(1127400).then(setContents);
  }, []);

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    return () => removeToolListener('pluginEnter', onPluginEnter);
  }, []);

  return (
    <div>
      <button onClick={onClick}>点击获取</button>
      {contents?.map((it, i) => (
        <div key={i}>{it}</div>
      ))}
    </div>
  );
}
