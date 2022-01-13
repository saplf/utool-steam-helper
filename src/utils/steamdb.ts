const steamdbBase = 'https://steamdb.info';

function parseHistoryDom(selector: string, appid: string) {
  const nodes: any[] = [];

  // 过滤出包含了 depots 更改的节点
  function depotsChangeNode(node: HTMLDivElement): HTMLUListElement[] {
    const li: HTMLUListElement[] = [];
    node.querySelectorAll<HTMLLIElement>('.app-history > li').forEach((it) => {
      if (
        it.querySelector<HTMLSpanElement>('svg.octicon-diff-modified ~ i')
          ?.innerText === 'Depots'
      ) {
        const h = it.querySelector<HTMLUListElement>('.app-history-json');
        if (h) {
          li.push(h);
        }
      }
    });
    return li;
  }

  function getChangeInfoFromNode(node: HTMLUListElement): Game.ChangeInfo {
    const info: any = {};
    node.childNodes.forEach(it => {

    });
    return info;
  }

  document.querySelectorAll<HTMLDivElement>(selector).forEach((it) => {
    const ul = depotsChangeNode(it);
    if (!ul.length) return;

    

    nodes.push(it.innerText);
  });
  return nodes;
}

export async function parseHistoryInfo(appid: string | number) {
  if (!appid) return [];
  const selector = '#history > .history-container > .panel-history';
  try {
    return utools.ubrowser
      .goto(`${steamdbBase}/app/${appid}/history/#history`)
      .wait(selector)
      .evaluate(parseHistoryDom, selector, appid)
      .run({ show: false });
  } catch {
    return [];
  }
}
