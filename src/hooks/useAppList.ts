import { orderGameList } from '@/utils/helper';
import { getAppList } from '@/utils/steam';
import { useEffect, useMemo, useState, Dispatch, SetStateAction } from 'react';
import useEnter from './useEnter';
import useFn from './useFn';

const KEY_DOWN = 'ArrowDown';
const KEY_UP = 'ArrowUp';
const KEY_ENTER = 'Enter';

type Ret = {
  appList: Game.App[];
  query: string;
  setQuery: Dispatch<SetStateAction<string>>;
  selected: Game.App;
  setSelected: Dispatch<SetStateAction<Game.App>>;
};

type Param = {
  onEnterApp?: (params: Ret) => void;
  onExecGame?: (game: Game.App) => void;
};

export default function useAppList({ onEnterApp, onExecGame }: Param = {}): Ret {
  const [apps, setApps] = useState<Record<string, Game.App>>();
  const [selected, setSelected] = useState<Game.App>();
  const [query, setQuery] = useState('');
  const appList = useMemo(() => orderGameList(apps, { query }), [apps, query]);

  const ret: Ret = { appList, setQuery, query, selected, setSelected };
  useEnter(() => {
    onEnterApp?.(ret);
    setQuery('');
    setSelected(undefined);
    getAppList().then(setApps);
  });

  const onKeyPress = useFn((ev: KeyboardEvent) => {
    if (!appList) return;
    const { key } = ev;
    if (key !== KEY_DOWN && key !== KEY_UP && key !== KEY_ENTER) return;
    ev.preventDefault();

    if (key === KEY_ENTER) {
      if (!selected) return;
      onExecGame?.(selected);
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
    document.addEventListener('keydown', onKeyPress);

    return () => {
      document.removeEventListener('keydown', onKeyPress);
    };
  }, []);

  useEffect(() => {
    setSelected((prev) => {
      if (appList?.find((it) => it.appid === prev?.appid)) return prev;
      return appList?.[0];
    });
  }, [appList]);

  return ret;
}
