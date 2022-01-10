utools.onPluginReady(() => {
  utools.onPluginEnter(onReady);
});

function onReady({ code }) {
  utools.setSubInput(onSubInput, '输入游戏名称进行筛选', true);
  document.getElementById('path').innerText = window.getLibraryFolders();
}

function onSubInput(e) {
  document.getElementById('input').innerText = e.text;
}
