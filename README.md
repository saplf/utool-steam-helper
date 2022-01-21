# uTools Steam Helper

## 开发

- 执行 `yarn install` 命令安装依赖

- utools 插件开发者中心选择 `public/plugin.json` 作为入口

- 执行 `yarn start` 开启开发服务

- 开发过程包含热更新，但是更改了 `public` 下的代码需要在 utools 开发中心重新加载 `plugin.json`

## 打包

- 执行 `yarn build` 打包

- 选择 `dist/plugin.json` 作为入口

## 鸣谢

- [utools](https://u.tools/docs/guide/about-uTools.html)

- [utools-api-types](https://github.com/uTools-Labs/utools-api-types) utools api ts 类型声明

- [pinyin-pro](https://github.com/zh-lx/pinyin-pro) 用于拼音搜索

- [@node-steam/vdf](https://github.com/node-steam/vdf) 解析 valve 字符串

- valve 二进制文件的解码参考了 [SteamAppInfo](https://github.com/SteamDatabase/SteamAppInfo) 的文件结构与 [SteamTools](https://github.com/BeyondDimension/SteamTools/blob/ab1ca7dd03079bd9592f7050923e5fd8b1700896/src/ST.Client/Models/Steam/SteamApp.cs#L443) 的解析过程
