utools.onPluginReady(() => {
  utools.onPluginEnter(onReady);
});

function onReady({ code }) {
  utools.setSubInput(onSubInput, '输入游戏名称进行筛选', true);
}

function onSubInput(e) {

}
