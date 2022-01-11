import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import List from './list';

type PluginEnterCallback = Parameters<UToolsApi['onPluginEnter']>[0];
type PluginEnterAction = Parameters<PluginEnterCallback>[0];

function App() {
  const [action, setAction] = useState<PluginEnterAction>();
  const { code } = action || {};

  useEffect(() => {
    utools.onPluginEnter(setAction);
  }, []);

  if (code === 'ls') {
    return <List />;
  }
  return null;
}

utools.onPluginReady(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('app')
  );
});
