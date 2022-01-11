import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import List from './list';
import Setting from './setting';
import {
  addToolListener,
  initToolCallback,
  removeToolListener,
  PluginEnterCallback,
} from './utils/utools';

type PluginEnterAction = Parameters<PluginEnterCallback>[0];

function App() {
  const [action, setAction] = useState<PluginEnterAction>();
  const { code } = action || {};

  useEffect(() => {
    addToolListener('pluginEnter', setAction);
    return () => removeToolListener('pluginEnter', setAction);
  }, []);

  if (code === 'ls') {
    return <List />;
  }
  if (code === 'setting') {
    return <Setting />;
  }

  return null;
}

utools.onPluginReady(() => {
  initToolCallback();

  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
});
