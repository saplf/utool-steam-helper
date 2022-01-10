utools.onPluginReady(() => {
  utools.onPluginEnter(onReady);
});

function onReady({ code }) {
  utools.setSubInput(onSubInput, '输入游戏名称进行筛选', true);
  document.onkeydown = onKeyDown;

  document.getElementById('path').innerText = window.getLibraryFoldersPath();
}

function onSubInput(e) {
  document.getElementById('input').innerText = e.text;
}

function onKeyDown(e) {
  const keyMap = {
    38: '上',
    40: '下',
  };
  document.getElementById('input').innerText = `${keyMap[e.keyCode] || ''}`;
}
