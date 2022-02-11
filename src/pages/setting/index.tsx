import Page from '@/components/page';
import { getCurrentFriendId, setCurrentFriendId } from '@/utils/helper';
import { parseHistoryInfo } from '@/utils/steamdb';
import { addToolListener, removeToolListener } from '@/utils/utools';
import { useCallback, useEffect, useState } from 'react';
import { Nav } from 'rsuite';
import GamesPanel from './games';
import UserPanel from './user';

export default function Setting() {
  const [tabKey, setTabKey] = useState('user');
  const [contents, setContents] = useState<string[]>();

  const onClick = useCallback(() => {
    // parseHistoryInfo(1127400).then(setContents);
  }, []);

  return (
    <Page>
      <Nav appearance="subtle" activeKey={tabKey}>
        <Nav.Item eventKey="user" onSelect={setTabKey}>
          用户信息
        </Nav.Item>
        <Nav.Item eventKey="game" onSelect={setTabKey}>
          游戏信息
        </Nav.Item>
      </Nav>

      {tabKey === 'user' && <UserPanel />}
      {tabKey === 'game' && <GamesPanel />}
    </Page>
  );
}
