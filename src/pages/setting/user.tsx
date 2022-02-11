import useEnter from '@/hooks/useEnter';
import { getCurrentFriendId, setCurrentFriendId } from '@/utils/helper';
import { useCallback, useState } from 'react';
import { Col, Grid, InputPicker, Panel, Row, InputPickerProps } from 'rsuite';

type InputItemType = InputPickerProps['data'][number];
const rowStyle = { display: 'flex', alignItems: 'center' };

export default function UserPanel() {
  const [users, setUsers] = useState<InputItemType[]>([]);
  const [currentUser, setCurrent] = useState<string>();

  const onSelectUser: InputPickerProps['onSelect'] = useCallback((v) => {
    setCurrentFriendId(v);
    setCurrent(v);
  }, []);

  useEnter(() => {
    utools.removeSubInput();

    window
      .getLoggedFriendId()
      .then((it) => setUsers(it.map((e) => ({ label: e, value: e }))));
    getCurrentFriendId().then(setCurrent);
  });

  return (
    <Panel>
      <Grid fluid>
        <Row style={rowStyle}>
          <Col xs={8}>设置用户</Col>
          <Col xs={16}>
            <InputPicker
              block
              cleanable={false}
              data={users}
              value={currentUser}
              onSelect={onSelectUser}
            />
          </Col>
        </Row>
      </Grid>
    </Panel>
  );
}
