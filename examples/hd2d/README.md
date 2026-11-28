# HD-2D 实验示例

`Hd2d.js`、`Hd2dDebug.js` 和 `PixelMovement.js` 目前作为实验插件随示例工程提供。

用 RPG Maker MZ 打开 [game.rmmzproject](./game.rmmzproject)，点击「测试游戏」。工程自带 OpenMZ 运行时和四个插件脚本。

选择「新游戏」进入林间空地。方向键或 WASD 移动，Shift 奔跑，Enter 或 Z 交互，Esc 或 X 打开菜单。火把和路灯可通过事件对话开关，右上角可调节特效、相机和碰撞盒。

## 插件顺序

1. `OpenMzPixi3D.js` 提供共享的 `PIXI3D`、点光源阴影、可配置距离衰减和 Bloom。
2. `PixelMovement.js` 提供八方向移动、角色碰撞和队伍跟随。
3. `Hd2d.js` 提供 3D 地图和角色渲染、相机、照明与后期特效。它需要 `OpenMzPixi3D.js` 和 `img/hd2d/skybox.hdr`。
4. `Hd2dDebug.js` 提供可选的调试面板与轨道相机。

OpenMZ 使用 WebGL2。每个 3D 视图有 16 个阴影槽，投影点光源占六个，聚光灯和每级方向光级联各占一个。
