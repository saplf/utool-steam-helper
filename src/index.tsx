import ReactDOM from 'react-dom';
import React, { useEffect, useState } from 'react';
import { CustomProvider } from 'rsuite';
import './styles/index.less';
import List from './pages/list';
import Setting from './pages/setting';
import {
  addToolListener,
  initToolCallback,
  removeToolListener,
  PluginEnterCallback,
} from './utils/utools';

type PluginEnterAction = Parameters<PluginEnterCallback>[0];

function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    utools.isDarkColors() ? 'dark' : 'light'
  );
  const [action, setAction] = useState<PluginEnterAction>();
  const { code } = action || {};

  useEffect(() => {
    addToolListener('pluginEnter', setAction);
    matchMedia('(prefers-color-scheme: dark)').onchange = (ev) => {
      setTheme(ev.matches ? 'dark' : 'light');
    };
    return () => removeToolListener('pluginEnter', setAction);
  }, []);

  let child = null;
  if (code === 'ls') {
    child = <List />;
  }
  if (code === 'setting') {
    child = <Setting />;
  }

  return <CustomProvider theme={theme}>{child}</CustomProvider>;
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
