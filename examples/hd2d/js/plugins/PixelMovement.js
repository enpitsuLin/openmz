/*:
 * @target MZ
 * @plugindesc [Experimental] Independent 8-directional free pixel movement compatible with standard RMMZ maps, events, and followers.
 * @author rmmz-next
 *
 * @param colliderRadius
 * @text Collider Radius
 * @desc Half-size of the player's foot collider in tiles.
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 0.48
 * @default 0.28
 *
 * @param speedScale
 * @text Speed Scale
 * @desc Multiplier applied to the player's movement speed.
 * @type number
 * @decimals 2
 * @min 0.25
 * @max 3.00
 * @default 1.00
 *
 * @param cornerSlide
 * @text Corner Slide Distance
 * @desc Maximum perpendicular nudge (in tiles) when brushing a tile corner.
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 0.50
 * @default 0.35
 *
 * @param interactRange
 * @text Interact Range
 * @desc Forward reach (in tiles) when pressing the action button.
 * @type number
 * @decimals 2
 * @min 0.40
 * @max 1.50
 * @default 0.78
 *
 * @param followSpacing
 * @text Follower Spacing
 * @desc Trail distance (in tiles) between consecutive party followers.
 * @type number
 * @decimals 2
 * @min 0.30
 * @max 1.50
 * @default 0.75
 *
 * @param enableWasd
 * @text Enable WASD Movement
 * @desc Map W/A/S/D keys to directional movement alongside arrow keys.
 * @type boolean
 * @default true
 *
 * @help
 * Enables smooth 8-directional pixel movement while staying compatible with
 * standard RPG Maker MZ tile passability, event triggers, move routes,
 * touch-to-move, and party followers.
 *
 * Disable this plugin in the Plugin Manager to return to grid movement.
 */
/*:zh
 * @target MZ
 * @plugindesc [实验性] 独立的 8 方向自由像素移动插件，兼容标准 RMMZ 地图通行度、事件触发与队友跟随。
 * @author rmmz-next
 *
 * @param colliderRadius
 * @text 玩家碰撞半径
 * @desc 玩家脚底圆形碰撞体的半径（单位：地图格）。
 * @type number
 * @decimals 2
 * @min 0.10
 * @max 0.48
 * @default 0.28
 *
 * @param speedScale
 * @text 移动速度倍率
 * @desc 在 RMMZ 原生移动速度基础上叠加的倍率。
 * @type number
 * @decimals 2
 * @min 0.25
 * @max 3.00
 * @default 1.00
 *
 * @param cornerSlide
 * @text 拐角滑行距离
 * @desc 擦碰不可通行图块边角时自动向侧边微调绕过的最大距离（单位：地图格）。
 * @type number
 * @decimals 2
 * @min 0.00
 * @max 0.50
 * @default 0.35
 *
 * @param interactRange
 * @text 交互距离
 * @desc 按下确认键向前探测可交互事件的距离（单位：地图格）。
 * @type number
 * @decimals 2
 * @min 0.40
 * @max 1.50
 * @default 0.78
 *
 * @param followSpacing
 * @text 队友跟随间距
 * @desc 队伍跟随成员沿路径排列的间隔距离（单位：地图格）。
 * @type number
 * @decimals 2
 * @min 0.30
 * @max 1.50
 * @default 0.75
 *
 * @param enableWasd
 * @text 启用 WASD 移动
 * @desc 开启后除方向键外，也可使用 W / A / S / D 控制角色移动。
 * @type boolean
 * @default true
 *
 * @help
 * 提供平滑的 8 方向（斜向速度已归一化）像素级自由移动，并与标准
 * RPG Maker MZ 的图块通行度、事件触发、移动路线、点击寻路和队友跟随兼容。
 *
 * - 支持事件自定义矩形碰撞盒（配合 Hd2d 插件时自动按精灵尺寸与偏移推导）。
 * - 在插件管理器中禁用本插件即可立即恢复原生网格移动。
 */
(function () {
  // src/collision.ts
  const EVENT_COLLIDER_RADIUS = 0.32;
  function isTileCompletelyBlocked(tx, ty) {
    const map = $gameMap;
    return !(
      map.isPassable(tx, ty, 2) ||
      map.isPassable(tx, ty, 4) ||
      map.isPassable(tx, ty, 6) ||
      map.isPassable(tx, ty, 8)
    );
  }
  function canCrossTile(fromX, fromY, toX, toY) {
    const map = $gameMap;
    if (!map.isValid(toX, toY)) return false;
    if (isTileCompletelyBlocked(toX, toY)) return false;
    if (fromX === toX && fromY === toY) return true;
    const dx = toX - fromX;
    const dy = toY - fromY;
    if (dx !== 0 && dy === 0) {
      const dir = dx > 0 ? 6 : 4;
      const rev = dx > 0 ? 4 : 6;
      return map.isPassable(fromX, fromY, dir) && map.isPassable(toX, toY, rev);
    }
    if (dy !== 0 && dx === 0) {
      const dir = dy > 0 ? 2 : 8;
      const rev = dy > 0 ? 8 : 2;
      return map.isPassable(fromX, fromY, dir) && map.isPassable(toX, toY, rev);
    }
    const horz = dx > 0 ? 6 : 4;
    const vert = dy > 0 ? 2 : 8;
    const revHorz = dx > 0 ? 4 : 6;
    const revVert = dy > 0 ? 8 : 2;
    const viaHorz =
      map.isPassable(fromX, fromY, horz) &&
      map.isPassable(toX, fromY, revHorz) &&
      map.isPassable(toX, fromY, vert) &&
      map.isPassable(toX, toY, revVert);
    const viaVert =
      map.isPassable(fromX, fromY, vert) &&
      map.isPassable(fromX, toY, revVert) &&
      map.isPassable(fromX, toY, horz) &&
      map.isPassable(toX, toY, revHorz);
    return viaHorz || viaVert;
  }
  function isMapBoundsValid(x, y, radius) {
    const map = $gameMap;
    if (!map.isLoopHorizontal()) {
      if (x - radius < -0.5 || x + radius > map.width() - 0.5) return false;
    }
    if (!map.isLoopVertical()) {
      if (y - radius < -0.5 || y + radius > map.height() - 0.5) return false;
    }
    return true;
  }
  function isTileCollisionFree(fromX, fromY, toX, toY, radius) {
    if (!isMapBoundsValid(toX, toY, radius)) return false;
    const map = $gameMap;
    const baseTx = Math.round(fromX);
    const baseTy = Math.round(fromY);
    const minTx = Math.round(toX - radius);
    const maxTx = Math.round(toX + radius);
    const minTy = Math.round(toY - radius);
    const maxTy = Math.round(toY + radius);
    for (let ty = minTy; ty <= maxTy; ty++)
      for (let tx = minTx; tx <= maxTx; tx++)
        if (!canCrossTile(baseTx, baseTy, map.roundX(tx), map.roundY(ty))) return false;
    return true;
  }
  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }
  function getEventCollider(event) {
    return event._pixelCollider ?? null;
  }
  function nearestPointOnEvent(event, px, py) {
    const col = getEventCollider(event);
    if (!col)
      return {
        x: event._realX,
        y: event._realY,
      };
    const cx = event._realX + col.offsetX;
    const cy = event._realY + col.offsetY;
    return {
      x: clamp(px, cx - col.halfW, cx + col.halfW),
      y: clamp(py, cy - col.halfD, cy + col.halfD),
    };
  }
  function findOverlappingEvents(fromX, fromY, toX, toY, radius) {
    const map = $gameMap;
    const hits = [];
    const defaultSumRadiusSq = (radius + EVENT_COLLIDER_RADIUS) ** 2;
    const playerRadiusSq = radius * radius;
    for (const event of map.events()) {
      if (!event || event.isThrough() || !event.isNormalPriority()) continue;
      const col = getEventCollider(event);
      if (col) {
        if (col.disabled) continue;
        const cx = event._realX + col.offsetX;
        const cy = event._realY + col.offsetY;
        const newNearestX = clamp(toX, cx - col.halfW, cx + col.halfW);
        const newNearestY = clamp(toY, cy - col.halfD, cy + col.halfD);
        const newDistSq = (toX - newNearestX) ** 2 + (toY - newNearestY) ** 2;
        if (newDistSq >= playerRadiusSq) continue;
        const oldNearestX = clamp(fromX, cx - col.halfW, cx + col.halfW);
        const oldNearestY = clamp(fromY, cy - col.halfD, cy + col.halfD);
        const oldDistSq = (fromX - oldNearestX) ** 2 + (fromY - oldNearestY) ** 2;
        if (oldDistSq < playerRadiusSq) {
          const oldCenterSq = (fromX - cx) ** 2 + (fromY - cy) ** 2;
          const newCenterSq = (toX - cx) ** 2 + (toY - cy) ** 2;
          if (newDistSq > oldDistSq || (newDistSq === 0 && newCenterSq > oldCenterSq)) continue;
        }
        hits.push(event);
        continue;
      }
      const ex = event._realX;
      const ey = event._realY;
      const newDistSq = (toX - ex) ** 2 + (toY - ey) ** 2;
      if (newDistSq >= defaultSumRadiusSq) continue;
      const oldDistSq = (fromX - ex) ** 2 + (fromY - ey) ** 2;
      if (oldDistSq < defaultSumRadiusSq && newDistSq > oldDistSq) continue;
      hits.push(event);
    }
    return hits;
  }
  function isVehicleBlocked(toX, toY, radius) {
    const map = $gameMap;
    const vehicles = [map.boat(), map.ship()];
    const sumRadiusSq = (radius + EVENT_COLLIDER_RADIUS) ** 2;
    for (const vehicle of vehicles) {
      if (!vehicle || vehicle._mapId !== map.mapId()) continue;
      if ((toX - vehicle._realX) ** 2 + (toY - vehicle._realY) ** 2 < sumRadiusSq) return true;
    }
    return false;
  }
  function canOccupy(player, fromX, fromY, toX, toY, radius, collidedEvents) {
    if (player.isThrough() || player.isDebugThrough()) return isMapBoundsValid(toX, toY, radius);
    if (!isTileCollisionFree(fromX, fromY, toX, toY, radius)) return false;
    const events = findOverlappingEvents(fromX, fromY, toX, toY, radius);
    if (events.length > 0) {
      for (const event of events) if (!collidedEvents.includes(event)) collidedEvents.push(event);
      return false;
    }
    if (isVehicleBlocked(toX, toY, radius)) return false;
    return true;
  }
  function resolvePixelMove(player, dx, dy, radius, cornerSlide) {
    const startX = player._realX;
    const startY = player._realY;
    const collidedEvents = [];
    const fullX = startX + dx;
    const fullY = startY + dy;
    if (canOccupy(player, startX, startY, fullX, fullY, radius, collidedEvents))
      return {
        x: fullX,
        y: fullY,
        moved: true,
        collidedEvents,
      };
    let nextX = startX;
    let nextY = startY;
    let moved = false;
    if (dx !== 0 && canOccupy(player, nextX, nextY, nextX + dx, nextY, radius, collidedEvents)) {
      nextX += dx;
      moved = true;
    }
    if (dy !== 0 && canOccupy(player, nextX, nextY, nextX, nextY + dy, radius, collidedEvents)) {
      nextY += dy;
      moved = true;
    }
    if (moved || cornerSlide <= 0)
      return {
        x: nextX,
        y: nextY,
        moved,
        collidedEvents,
      };
    const step = Math.hypot(dx, dy);
    if (dx !== 0 && dy === 0) {
      const nudge = tryCornerNudgeY(player, startX, startY, dx, step, radius, cornerSlide);
      if (nudge !== 0)
        return {
          x: startX,
          y: startY + nudge,
          moved: true,
          collidedEvents,
        };
    } else if (dy !== 0 && dx === 0) {
      const nudge = tryCornerNudgeX(player, startX, startY, dy, step, radius, cornerSlide);
      if (nudge !== 0)
        return {
          x: startX + nudge,
          y: startY,
          moved: true,
          collidedEvents,
        };
    }
    return {
      x: startX,
      y: startY,
      moved: false,
      collidedEvents,
    };
  }
  function tryCornerNudgeY(player, startX, startY, dx, step, radius, maxSlide) {
    const dummy = [];
    for (const sign of [-1, 1]) {
      const probeY = startY + sign * maxSlide;
      if (
        canOccupy(player, startX, startY, startX, startY + sign * step, radius, dummy) &&
        canOccupy(player, startX, probeY, startX + dx, probeY, radius, dummy)
      )
        return sign * step;
    }
    return 0;
  }
  function tryCornerNudgeX(player, startX, startY, dy, step, radius, maxSlide) {
    const dummy = [];
    for (const sign of [-1, 1]) {
      const probeX = startX + sign * maxSlide;
      if (
        canOccupy(player, startX, startY, startX + sign * step, startY, radius, dummy) &&
        canOccupy(player, probeX, startY, probeX, startY + dy, radius, dummy)
      )
        return sign * step;
    }
    return 0;
  }
  // src/config.ts
  function readNumber(raw, fallback) {
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  function readBoolean(raw, fallback) {
    if (raw === void 0) return fallback;
    return raw !== 'false' && raw !== '0';
  }
  function loadPixelMovementConfig() {
    const params = PluginManager.parameters('PixelMovement');
    return {
      colliderRadius: readNumber(params.colliderRadius, 0.28),
      speedScale: readNumber(params.speedScale, 1),
      cornerSlide: readNumber(params.cornerSlide, 0.35),
      interactRange: readNumber(params.interactRange, 0.78),
      followSpacing: readNumber(params.followSpacing, 0.75),
      enableWasd: readBoolean(params.enableWasd, true),
    };
  }
  // src/trail.ts
  const MIN_SAMPLE_STEP = 0.04;
  const MAX_TRAIL_LENGTH = 8;
  var MovementTrail = class {
    samples = [];
    totalDistance = 0;
    reset(x, y, direction) {
      this.totalDistance = 0;
      this.samples = [
        {
          x,
          y,
          direction,
          distance: 0,
        },
      ];
    }
    record(x, y, direction) {
      const last = this.samples[this.samples.length - 1];
      if (!last) {
        this.reset(x, y, direction);
        return;
      }
      const delta = Math.hypot(x - last.x, y - last.y);
      if (delta < MIN_SAMPLE_STEP) return;
      this.totalDistance += delta;
      this.samples.push({
        x,
        y,
        direction,
        distance: this.totalDistance,
      });
      const cutoff = this.totalDistance - MAX_TRAIL_LENGTH;
      while (this.samples.length > 2 && this.samples[1].distance < cutoff) this.samples.shift();
    }
    sampleBehind(distanceBehind) {
      if (this.samples.length === 0) return null;
      const target = this.totalDistance - distanceBehind;
      if (target <= this.samples[0].distance) return this.samples[0];
      for (let i = this.samples.length - 1; i > 0; i--) {
        const next = this.samples[i];
        const prev = this.samples[i - 1];
        if (target >= prev.distance && target <= next.distance) {
          const span = Math.max(next.distance - prev.distance, 1e-6);
          const t = (target - prev.distance) / span;
          return {
            x: prev.x + (next.x - prev.x) * t,
            y: prev.y + (next.y - prev.y) * t,
            direction: next.direction,
            distance: target,
          };
        }
      }
      return this.samples[this.samples.length - 1];
    }
  };
  // src/install.ts
  const INV_SQRT2 = Math.SQRT1_2;
  const trails = /* @__PURE__ */ new WeakMap();
  const freeMovementPlayers = /* @__PURE__ */ new WeakSet();
  function directionFromInput(dir8, currentDir) {
    switch (dir8) {
      case 2:
        return {
          vx: 0,
          vy: 1,
          facing: 2,
        };
      case 4:
        return {
          vx: -1,
          vy: 0,
          facing: 4,
        };
      case 6:
        return {
          vx: 1,
          vy: 0,
          facing: 6,
        };
      case 8:
        return {
          vx: 0,
          vy: -1,
          facing: 8,
        };
      case 1:
        return {
          vx: -INV_SQRT2,
          vy: INV_SQRT2,
          facing: currentDir === 4 || currentDir === 2 ? currentDir : 2,
        };
      case 3:
        return {
          vx: INV_SQRT2,
          vy: INV_SQRT2,
          facing: currentDir === 6 || currentDir === 2 ? currentDir : 2,
        };
      case 7:
        return {
          vx: -INV_SQRT2,
          vy: -INV_SQRT2,
          facing: currentDir === 4 || currentDir === 8 ? currentDir : 8,
        };
      case 9:
        return {
          vx: INV_SQRT2,
          vy: -INV_SQRT2,
          facing: currentDir === 6 || currentDir === 8 ? currentDir : 8,
        };
      default:
        return {
          vx: 0,
          vy: 0,
          facing: currentDir,
        };
    }
  }
  function facingVector(direction) {
    switch (direction) {
      case 2:
        return {
          fx: 0,
          fy: 1,
        };
      case 4:
        return {
          fx: -1,
          fy: 0,
        };
      case 6:
        return {
          fx: 1,
          fy: 0,
        };
      case 8:
        return {
          fx: 0,
          fy: -1,
        };
      default:
        return {
          fx: 0,
          fy: 1,
        };
    }
  }
  function findInteractableEvent(player, range, triggers) {
    const { fx, fy } = facingVector(player.direction());
    const probeX = player._realX + fx * range * 0.65;
    const probeY = player._realY + fy * range * 0.65;
    let best = null;
    let bestDistSq = range * range;
    for (const event of $gameMap.events()) {
      if (!event || !event.isTriggerIn(triggers)) continue;
      let target = nearestPointOnEvent(event, player._realX, player._realY);
      if (getEventCollider(event)?.disabled) {
        const boxDistSq = (target.x - player._realX) ** 2 + (target.y - player._realY) ** 2;
        if ((event._realX - player._realX) ** 2 + (event._realY - player._realY) ** 2 < boxDistSq)
          target = {
            x: event._realX,
            y: event._realY,
          };
      }
      const dx = target.x - player._realX;
      const dy = target.y - player._realY;
      const distToPlayer = Math.hypot(dx, dy);
      if (distToPlayer > range) continue;
      if ((distToPlayer > 0.15 ? (dx * fx + dy * fy) / distToPlayer : 1) < 0.25) continue;
      const probeTarget = nearestPointOnEvent(event, probeX, probeY);
      const distToProbeSq = (probeTarget.x - probeX) ** 2 + (probeTarget.y - probeY) ** 2;
      if (distToProbeSq < bestDistSq) {
        bestDistSq = distToProbeSq;
        best = event;
      }
    }
    return best;
  }
  function syncFollowersToTrail(player, trail, spacing) {
    const followers = player.followers();
    if (!followers || followers.areGathering()) return;
    const list = followers.data();
    for (let i = 0; i < list.length; i++) {
      const follower = list[i];
      if (!follower || !follower.isVisible()) continue;
      const sample = trail.sampleBehind((i + 1) * spacing);
      if (!sample) continue;
      const moved = Math.hypot(sample.x - follower._realX, sample.y - follower._realY) > 0.002;
      follower._pixelMoving = moved;
      if (moved) {
        follower._realX = sample.x;
        follower._realY = sample.y;
        follower._x = Math.round(sample.x);
        follower._y = Math.round(sample.y);
        follower.setDirection(sample.direction);
        follower.refreshBushDepth();
      }
    }
  }
  function installPixelMovement() {
    const config = loadPixelMovementConfig();
    if (config.enableWasd) {
      Input.keyMapper[87] = 'up';
      Input.keyMapper[83] = 'down';
      Input.keyMapper[65] = 'left';
      Input.keyMapper[68] = 'right';
    }
    const originalInitMembers = Game_Player.prototype.initMembers;
    Game_Player.prototype.initMembers = function () {
      originalInitMembers.call(this);
      this._pixelMoving = false;
      this._pixelStepAccum = 0;
      this._pixelLastTouchEventId = 0;
    };
    const originalLocate = Game_Player.prototype.locate;
    Game_Player.prototype.locate = function (x, y) {
      originalLocate.call(this, x, y);
      this._pixelMoving = false;
      this._pixelStepAccum = 0;
      this._pixelLastTouchEventId = 0;
      const trail = new MovementTrail();
      trail.reset(this._realX, this._realY, this.direction());
      trails.set(this, trail);
    };
    const originalIsMoving = Game_Player.prototype.isMoving;
    Game_Player.prototype.isMoving = function () {
      return originalIsMoving.call(this) || Boolean(this._pixelMoving);
    };
    const originalUpdate = Game_Player.prototype.update;
    Game_Player.prototype.update = function (sceneActive) {
      if (!(sceneActive && this.canMove() && this.isNormal() && !this.isJumping() && !$gameTemp.isDestinationValid())) {
        freeMovementPlayers.delete(this);
        this._pixelMoving = false;
        originalUpdate.call(this, sceneActive);
        trails.get(this)?.record(this._realX, this._realY, this.direction());
        return;
      }
      freeMovementPlayers.add(this);
      const lastScrolledX = this.scrolledX();
      const lastScrolledY = this.scrolledY();
      this.updateDashing();
      const dir8 = Input.dir8;
      this._pixelMoving = false;
      if (dir8 > 0) {
        const { vx, vy, facing } = directionFromInput(dir8, this.direction());
        this.setDirection(facing);
        const stepDistance = this.distancePerFrame() * config.speedScale;
        const prevTileX = this._x;
        const prevTileY = this._y;
        const result = resolvePixelMove(
          this,
          vx * stepDistance,
          vy * stepDistance,
          config.colliderRadius,
          config.cornerSlide,
        );
        if (result.moved) {
          const actualStep = Math.hypot(result.x - this._realX, result.y - this._realY);
          let trail = trails.get(this);
          if (!trail) {
            trail = new MovementTrail();
            trail.reset(this._realX, this._realY, this.direction());
            trails.set(this, trail);
          }
          const map = $gameMap;
          this._realX = map.isLoopHorizontal() ? map.roundX(result.x) : result.x;
          this._realY = map.isLoopVertical() ? map.roundY(result.y) : result.y;
          this._x = Math.round(this._realX);
          this._y = Math.round(this._realY);
          this._pixelMoving = true;
          this._pixelLastTouchEventId = 0;
          this.resetStopCount();
          this.refreshBushDepth();
          trail.record(this._realX, this._realY, this.direction());
          syncFollowersToTrail(this, trail, config.followSpacing);
          this._pixelStepAccum = (this._pixelStepAccum ?? 0) + actualStep;
          if (this._pixelStepAccum >= 1) {
            this._pixelStepAccum -= 1;
            this.increaseSteps();
          }
          if (this._x !== prevTileX || this._y !== prevTileY) this.checkEventTriggerHere([1, 2]);
        } else if (result.collidedEvents.length > 0 && !$gameMap.isEventRunning()) {
          for (const event of result.collidedEvents)
            if (event.isTriggerIn([1, 2]) && this._pixelLastTouchEventId !== event.eventId()) {
              this._pixelLastTouchEventId = event.eventId();
              event.start();
              break;
            }
        }
      } else {
        this._pixelLastTouchEventId = 0;
        this.updateStop();
      }
      this.updateAnimation();
      this.updateScroll(lastScrolledX, lastScrolledY);
      this.updateVehicle();
      if (!this.isMoving()) this.updateNonmoving(false, sceneActive);
      else this.triggerButtonAction();
      this._followers.update();
    };
    const originalCheckEventTriggerThere = Game_Player.prototype.checkEventTriggerThere;
    Game_Player.prototype.checkEventTriggerThere = function (triggers) {
      if (this.canStartLocalEvents()) {
        const nearby = findInteractableEvent(this, config.interactRange, triggers);
        if (nearby) {
          nearby.start();
          return;
        }
      }
      originalCheckEventTriggerThere.call(this, triggers);
    };
    const originalFollowersUpdate = Game_Followers.prototype.update;
    Game_Followers.prototype.update = function () {
      if (!this.areGathering() && freeMovementPlayers.has($gamePlayer)) {
        for (const follower of this._data) {
          const f = follower;
          if (f._pixelMoving) {
            f.updateAnimation();
            f._pixelMoving = false;
          } else {
            f.updateStop();
            f.updateAnimation();
          }
        }
        return;
      }
      originalFollowersUpdate.call(this);
    };
  }
  // src/index.ts
  installPixelMovement();
})();
