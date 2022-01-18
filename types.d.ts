type Buffer = import('buffer').Buffer;

type ImageProp = {
  icon: string;
  logo: string;
  library: string;
  hero: string;
  heroBlur: string;
  header: string;
};

type ContentRet = {
  mtime: number;
  content?: string;
  modified: boolean;
};

type BinaryContentRet = {
  mtime: number;
  content?: Buffer;
  modified: boolean;
};

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare interface Window {
  /**
   * 解析路径
   */
  resolvePath(...paths: string[]): string;

  /**
   * 获取 steam 安装路径
   */
  getSteamAppPath(mtime?: number): Promise<string>;

  /**
   * 获取用户信息
   */
  getUserVdf(mtime?: number): Promise<ContentRet | null>;

  /**
   * 获取游戏库路径
   */
  getLibraryFolders(mtime?: number): Promise<ContentRet | null>;

  /**
   * 获取应用信息
   */
  getAppInfo(mtime?: number): Promise<BinaryContentRet | null>;

  /**
   * 获取特定 app 的 acf 内容
   */
  getAppAcf(
    libraryPath: string,
    appid: string | number,
    mtime?: number
  ): Promise<ContentRet | null>;

  /**
   * 获取某个应用的图片信息
   */
  getAppImages(appid: string): ImageProp;
}

declare namespace Game {
  type Depot = {
    manifest: string | number;
    size: number;
  };

  type Mtime = Record<string, number>;

  type App = {
    // info from appid_.cvf
    appid: number;
    name: string;
    disk: string;
    installdir: string;
    StateFlags: number;
    LastUpdated: number;
    UpdateResult: number;
    SizeOnDisk: number;
    buildid: number;
    LastOwner: number;
    BytesToDownload: number;
    BytesDownloaded: number;
    BytesToStage: number;
    BytesStaged: number;
    AutoUpdateBehavior: number;
    AllowOtherDownloadsWhileRunning: number;
    ScheduledAutoUpdate: number;
    InstalledDepots: Depot[];
    UserConfig: { language: string };

    // info from appinfo.vdf
    size: number;
    infoState: number;
    lastUpdated: number;
    picsToken: number;
    sha1: string;
    changeNumber: number;
    props: any;
    appinfo: any;
  } & ImageProp;

  type ChangeInfo = {
    id: number;
    updateTime: number;
    buildid: number;
    size: number;
    branch: string;
  };
}
