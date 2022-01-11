import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect } from 'react';

export default function Setting() {
  const onPluginEnter = useCallback(() => {
    utools.removeSubInput();
  }, []);

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    return () => removeToolListener('pluginEnter', onPluginEnter);
  }, []);

  return <div>设置页面</div>;
}
