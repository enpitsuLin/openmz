export interface UpdaterTexts {
  title: string;
  version: (current: string | undefined, target: string) => string;
  backup: string;
  check: string;
  current: string;
  download: (loaded: number, total: number) => string;
  verify: string;
  apply: string;
  done: string;
  installed: (version: string) => string;
  saved: (path: string) => string;
  error: string;
  update: string;
  skip: string;
  reload: string;
  retry: string;
  later: string;
}

export type UpdaterLocale = 'zh' | 'en';

export const UPDATER_TEXTS: Readonly<Record<UpdaterLocale, UpdaterTexts>> = {
  zh: {
    title: '更新 OpenMZ',
    version: (current, target) =>
      `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
    backup: '原文件将备份到 js_backup/。',
    check: '正在检查更新',
    current: '当前已是最新版',
    download: (loaded, total) =>
      `下载更新包：${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
    verify: '校验并解压更新包',
    apply: '备份并安装更新',
    done: '更新完成',
    installed: (version) => `已安装 OpenMZ ${version}，重启后生效。`,
    saved: (path) => `备份：${path}`,
    error: '更新失败',
    update: '更新',
    skip: '继续游戏',
    reload: '立即重启',
    retry: '重试',
    later: '稍后重启',
  },
  en: {
    title: 'Update OpenMZ',
    version: (current, target) =>
      `${current || 'RPG Maker MZ'} → OpenMZ ${target}`,
    backup: 'Original files will be saved in js_backup/.',
    check: 'Checking for updates',
    current: 'Already up to date',
    download: (loaded, total) =>
      `Downloading: ${Math.floor(loaded / 1024)} / ${Math.ceil(total / 1024)} KB`,
    verify: 'Verifying and extracting',
    apply: 'Backing up and installing',
    done: 'Update installed',
    installed: (version) => `OpenMZ ${version} will be used after restarting.`,
    saved: (path) => `Backup: ${path}`,
    error: 'Update failed',
    update: 'Update',
    skip: 'Continue',
    reload: 'Restart now',
    retry: 'Retry',
    later: 'Restart later',
  },
};

export function resolveUpdaterLocale(locale?: string | null): UpdaterLocale {
  return String(locale || '')
    .toLowerCase()
    .startsWith('zh')
    ? 'zh'
    : 'en';
}

export function getUpdaterTexts(locale?: string | null): UpdaterTexts {
  return UPDATER_TEXTS[resolveUpdaterLocale(locale)];
}
