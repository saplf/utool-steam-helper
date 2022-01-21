import { getCurrentFriendId, setCurrentFriendId } from '@/utils/helper';
import { parseHistoryInfo } from '@/utils/steamdb';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';

export default function Setting() {
  const [contents, setContents] = useState<string[]>();
  const [users, setUsers] = useState<string[]>();
  const [currentUser, setCurrent] = useState<string>();

  const onPluginEnter = useCallback(() => {
    utools.removeSubInput();

    window.getLoggedFriendId().then(setUsers);
    getCurrentFriendId().then(setCurrent);
  }, []);

  const onClick = useCallback(() => {
    // parseHistoryInfo(1127400).then(setContents);
  }, []);

  const onSelectUser = useCallback((e) => {
    const { value } = e.target;
    setCurrentFriendId(value);
    setCurrent(value);
  }, []);

  useEffect(() => {
    addToolListener('pluginEnter', onPluginEnter);
    onPluginEnter();
    return () => removeToolListener('pluginEnter', onPluginEnter);
  }, []);

  return (
    <div>
      {/* <button onClick={onClick}>点击获取</button>
      {contents?.map((it, i) => (
        <div key={i}>{it}</div>
      ))} */}

      <div>
        <span>设置用户</span>
        <select onChange={onSelectUser} value={currentUser}>
          {users?.map((it) => (
            <option key={it} value={it}>
              {it}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
