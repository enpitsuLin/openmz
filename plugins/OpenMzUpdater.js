/*:
 * @target MZ
 * @plugindesc Check for OpenMZ updates and install the prototype runtime.
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text Manifest URL
 * @desc URL of an OpenMZ schemaVersion 3 release manifest.
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * Install dist/plugins/OpenMzUpdater.js in your project's js/plugins/ directory.
 * In NW.js, checks the configured manifest when the title scene first opens.
 * Prompts only when a newer version is available. Installation verifies the
 * archive, backs up replaced files, and rolls back on failure.
 * Installed version metadata is stored in js/openmz.json. The updater remains
 * enabled and never rewrites js/plugins.js. Restart to use an installed update.
 */
/*:zh
 * @target MZ
 * @plugindesc 检查 OpenMZ 更新并安装原型式引擎和 PixiJS 8。
 * @author OpenMZ
 *
 * @param manifestUrl
 * @text 更新清单地址
 * @desc OpenMZ schemaVersion 3 发布清单的 URL。
 * @type string
 * @default
 *
 * @help OpenMzUpdater.js
 *
 * 将 dist/plugins/OpenMzUpdater.js 放入工程的 js/plugins/ 并启用。
 * 在 NW.js 中首次进入标题画面时检查更新，有新版本时显示版本并询问安装。
 * 安装前校验压缩包，备份被替换的文件；安装失败则回滚。
 * js/openmz.json 保存已安装版本。插件保持启用，不修改 js/plugins.js。
 * 安装完成后重启游戏生效。留空更新清单地址时不检查更新。
 */
import { setupUpdater } from './updater/ui.js';

setupUpdater();
