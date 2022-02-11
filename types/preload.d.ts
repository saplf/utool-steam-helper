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

declare interface Window {
  /**
   * 解析路径
   */
  resolvePath(...paths: string[]): string;

  /**
   * 获取登录过的用户 friend id
   */
  getLoggedFriendId(): Promise<string[]>;

  /**
   * 根据 friend id 获取详细的信息
   */
  getLoggedUserInfo(
    friendId: string,
    mtime?: number
  ): Promise<ContentRet | null>;

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
   * 获取本地化内容
   */
  getLocalization(mtime?: number): Promise<ContentRet | null>;

  /**
   * 获取应用的成就信息
   */
  getUserGameStatsSchema(
    appid: number,
    mtime?: number
  ): Promise<BinaryContentRet | null>;

  /**
   * 获取用户的成就信息
   */
  getUserGameStats(
    friendId: number | string,
    appid: number,
    mtime?: number
  ): Promise<BinaryContentRet | null>;

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

  /**
   * 启动游戏
   */
  launchGame(game: Game.App): void;
}

declare namespace Game {
  type Depot = {
    manifest: string | number;
    size: number;
  };

  type Mtime = Record<string, number>;

  type GameRecord = {
    lastPlayed: number;

    /**
     * 分钟
     */
    playtime: number;
  };

  type App = {
    // info from appid_.cvf
    appid: number;

    /**
     * 类型 Game
     */
    type: string;

    /**
     * 游戏名称 { schinese: '', english: '' }
     */
    name: Record<string, string>;

    /**
     * 标签列表 { schinese: ['xx', 'x'] }
     */
    storeTags: Record<string, string[]>;

    /**
     * 是否支持创意工坊
     */
    supportWorkshop: boolean;

    /**
     * 游戏所在库的路径
     */
    disk: string;

    /**
     * 用户游玩时间
     */
    record?: GameRecord;

    /**
     * 游戏启动项
     */
    launch: string[];

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

  type Usage = {
    /**
     * 用户自己好友系统的 id
     */
    id: string;

    /**
     * 用户的信息
     */
    user: { name: string; avatar: string };

    /**
     * 各游戏游玩记录
     */
    apps: Record<string, GameRecord>;
  };
}
