import {
  addToolListener,
  removeToolListener,
  PluginEnterCallback,
} from '@/utils/utools';
import { useEffect } from 'react';
import useFn from './useFn';

export default function useEnter(callback: PluginEnterCallback) {
  const onPluginEnter = useFn(callback);

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();

    return () => {
      removeToolListener('pluginEnter', onPluginEnter);
    };
  }, []);
}
