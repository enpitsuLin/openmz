/*
 * Adapted from rmmz-types by Vilja.
 *
 * MIT License
 *
 * Copyright (c) 2023 Vilja
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

declare namespace RMMZ {
    interface PathNode {
        parent: PathNode | null;
        x: number;
        y: number;
        g: number;
        f: number;
    }

    interface TextState {
        text: string;
        index: number;
        x: number;
        y: number;
        width: number;
        height: number;
        startX: number;
        startY: number;
        rtl: boolean;
        buffer: string;
        drawing: boolean;
        outputWidth: number;
        outputHeight: number;
    }

    type DamageDigitSprite = Sprite & { dx: number; dy: number; ry: number };
    type UpdateableChild = import("pixi.js").ContainerChild & {
        update?: () => void;
    };
    type TilemapChild = import("pixi.js").ContainerChild & {
        z: number;
        spriteId: number;
    };

    export type MethodName<T> = Extract<
        {
            [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
        }[keyof T],
        string
    >;

    export type DatabaseItem = DataSkill | InventoryItem;
    export type InventoryItem = DataItem | DataWeapon | DataArmor;
    export type AnimationTarget = (Game_Character | Game_Battler) & {
        startAnimation?: () => void;
        endAnimation?: () => void;
    };

    // Shared types

    export type Constructor<T = any> = new (...args: any[]) => T;
    export type AbstractConstructor<T = any> = abstract new (
        ...args: any[]
    ) => T;
    export type Nullable<T> = T | null;
    export type Color = [
        red: number,
        green: number,
        blue: number,
        alpha: number,
    ];
    export type Tone = [red: number, green: number, blue: number, gray: number];
    export type BlendMode = number | import("pixi.js").BLEND_MODES;
    export type PIXIDestroyOptions = import("pixi.js").DestroyOptions;
    export type WeatherType = "none" | "rain" | "storm" | "snow";
    export type PictureEasingType = 0 | 1 | 2 | 3;
    export type Writable<T> = { -readonly [P in keyof T]: T[P] };

    export type DataID = number;
    export type ElementType = DataID;
    export type SkillType = DataID;
    export type WeaponType = DataID;
    export type ArmorType = DataID;
    export type EquipmentType = DataID;
    export type ActorID = DataID;
    export type ClassID = DataID;
    export type SkillID = DataID;
    export type ItemID = DataID;
    export type EquipmentSlotID = EquipmentType;
    export type WeaponID = DataID;
    export type ArmorID = DataID;
    export type EnemyID = DataID;
    export type TroopID = DataID;
    export type StateID = DataID;
    export type AnimationID = DataID;
    export type BalloonIconID = DataID;
    export type TilesetID = DataID;
    export type CommonEventID = DataID;
    export type MapID = DataID;
    export type EventID = DataID;
    export type SwitchID = DataID;
    export type VariableID = DataID;
    export type SelfSwitchID = readonly [MapID, EventID, SelfSwitchCharacter];
    export type CharacterID = -1 | 0 | EventID;
    export type ActionDataType = 0 | 1 | 2 | 3 | 4 | 5;
    export type PictureID = DataID;
    export type TileID = DataID;

    export type Meta = Record<string, string | true>;
    export interface DataBaseBase {
        id: DataID;
        name: string;
    }
    export interface DataBase extends DataBaseBase {
        note: string;
        meta?: Meta;
    }
    export type DataClassID = "item" | "skill" | "weapon" | "armor";
    export interface DataItemBase extends DataBase {
        description: string;
        iconIndex: number;
    }
    export interface DataPricedItemBase extends DataItemBase {
        price: number;
    }
    export type TraitType =
        | 11
        | 12
        | 13
        | 14
        | 21
        | 22
        | 23
        | 31
        | 32
        | 33
        | 34
        | 35
        | 41
        | 42
        | 43
        | 44
        | 51
        | 52
        | 53
        | 54
        | 55
        | 61
        | 62
        | 63
        | 64;

    export interface Trait {
        code: TraitType;
        dataId: DataID;
        value: number;
    }
    export interface AudioFile {
        name: string;
        pan: number;
        pitch: number;
        volume: number;
        pos?: number;
    }
    export type DataAudio = AudioFile;

    export type DamageType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
    export interface Damage {
        type: DamageType;
        elementId: ElementType;
        formula: string;
        variance: number;
        critical: boolean;
    }
    export type Scope =
        0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
    export type Occasion = 0 | 1 | 2 | 3;
    export type Direction = 0 | 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;

    // Battlers, actors, and classes

    interface ActionEffectData<
        Code extends number,
        DataId extends number = number,
    > {
        code: Code;
        dataId: DataId;
        value1: number;
        value2: number;
    }

    export type HitType = 0 | 1 | 2;
    export type SpecialEffectType = 0;
    export type ActionEffectBase =
        | ActionEffectData<11>
        | ActionEffectData<12>
        | ActionEffectData<13>
        | ActionEffectData<21, StateID>
        | ActionEffectData<22, StateID>
        | ActionEffectData<31, ParamID>
        | ActionEffectData<32, ParamID>
        | ActionEffectData<33, ParamID>
        | ActionEffectData<34, ParamID>
        | ActionEffectData<41, SpecialEffectType>
        | ActionEffectData<42, ParamID>
        | ActionEffectData<43, SkillID>
        | ActionEffectData<44, CommonEventID>;
    export type ActionEffect<TCode extends number = ActionEffectBase["code"]> =
        Extract<
            ActionEffectBase,
            {
                code: TCode;
            }
        >;
    export type ActionUnit = Game_Party | Game_Troop;
    export type ActionTarget = Game_Actor | Game_Enemy;
    export type ActionItem = DataSkill | DataItem;
    export type ActionState =
        "undecided" | "inputting" | "waiting" | "acting" | "done";
    export type BattlerEffectType =
        | "whiten"
        | "blink"
        | "collapse"
        | "bossCollapse"
        | "instantCollapse"
        | "appear"
        | "disappear";
    export type BattlerMotionType =
        | "walk"
        | "wait"
        | "chant"
        | "guard"
        | "damage"
        | "evade"
        | "thrust"
        | "swing"
        | "missile"
        | "skill"
        | "spell"
        | "item"
        | "escape"
        | "victory"
        | "dying"
        | "abnormal"
        | "sleep"
        | "dead";

    export interface DataActor extends DataBase {
        nickname: string;
        classId: ClassID;
        initialLevel: number;
        maxLevel: number;
        profile: string;
        faceIndex: number;
        faceName: string;
        characterIndex: number;
        characterName: string;
        battlerName: string;
        equips: number[];
        traits: Trait[];
    }

    export interface Learning {
        level: number;
        note: string;
        skillId: SkillID;
    }
    export type BattlerParams = [
        number,
        number,
        number,
        number,
        number,
        number,
        number,
        number,
    ];
    export type ParamID = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
    export interface DataClass extends DataBase {
        expParams: [number, number, number, number];
        traits: Trait[];
        learnings: Learning[];
        params: [
            number[],
            number[],
            number[],
            number[],
            number[],
            number[],
            number[],
            number[],
        ];
    }

    export type DropItemType = 0 | 1 | 2 | 3;
    export type ConditionType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
    export interface DropItem {
        kind: DropItemType;
        dataId: DataID;
        denominator: number;
    }
    export interface EnemyAction {
        skillId: SkillID;
        rating: number;
        conditionType: ConditionType;
        conditionParam1: number;
        conditionParam2: number;
    }
    export interface DataEnemy extends DataBase {
        battlerHue: number;
        battlerName: string;
        params: BattlerParams;
        exp: number;
        gold: number;
        dropItems: DropItem[];
        actions: EnemyAction[];
        traits: Trait[];
    }

    export type Restriction = 0 | 1 | 2 | 3 | 4;
    export type Motion = 0 | 1 | 2 | 3;
    export type Overlay = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
    export type AutoRemovalTiming = 0 | 1 | 2;
    export interface DataState extends DataBase {
        iconIndex: number;
        restriction: Restriction;
        priority: number;
        motion: Motion;
        overlay: Overlay;
        removeAtBattleEnd: boolean;
        removeByRestriction: boolean;
        autoRemovalTiming: AutoRemovalTiming;
        minTurns: number;
        maxTurns: number;
        removeByDamage: boolean;
        chanceByDamage: number;
        removeByWalking: boolean;
        stepsToRemove: number;
        message1: string;
        message2: string;
        message3: string;
        message4: string;
        traits: Trait[];
        releaseByDamage?: boolean;
        messageType: number;
    }

    // Items, skills, and equipment

    export type ItemType = 1 | 2 | 3 | 4;
    export interface DataItem extends DataPricedItemBase {
        itypeId: ItemType;
        consumable: boolean;
        scope: Scope;
        occasion: Occasion;
        speed: number;
        successRate: number;
        repeats: number;
        tpGain: number;
        hitType: HitType;
        animationId: AnimationID;
        damage: Damage;
        effects: ActionEffectBase[];
    }

    export interface DataSkill extends DataItemBase {
        stypeId: SkillType;
        mpCost: number;
        tpCost: number;
        scope: Scope;
        occasion: Occasion;
        speed: number;
        successRate: number;
        repeats: number;
        tpGain: number;
        hitType: HitType;
        animationId: AnimationID;
        messageType: number;
        message1: string;
        message2: string;
        requiredWtypeId1: WeaponType;
        requiredWtypeId2: WeaponType;
        damage: Damage;
        effects: ActionEffectBase[];
    }

    export interface DataEquipment extends DataPricedItemBase {
        etypeId: EquipmentType;
        traits: Trait[];
        params: [
            number,
            number,
            number,
            number,
            number,
            number,
            number,
            number,
        ];
    }
    export interface DataWeapon extends DataEquipment {
        etypeId: 1;
        wtypeId: WeaponType;
        animationId: AnimationID;
    }
    export interface DataArmor extends DataEquipment {
        atypeId: ArmorType;
    }

    // Animations

    export type DisplayType = 0 | 1 | 2;
    export interface Rotation {
        x: number;
        y: number;
        z: number;
    }
    export interface SoundTiming {
        frame: number;
        se: AudioFile;
    }
    export interface FlashTiming {
        frame: number;
        duration: number;
        color: Color;
    }
    export interface DataAnimation extends DataBaseBase {
        displayType: DisplayType;
        effectName: string;
        scale: number;
        speed: number;
        rotation: Rotation;
        offsetX: number;
        offsetY: number;
        soundTimings: SoundTiming[];
        flashTimings: FlashTiming[];
        alignBottom?: boolean;
    }
    export interface DataTimingMV {
        frame: number;
        flashDuration: number;
        flashScope: 0 | 1 | 2 | 3;
        flashColor: Color;
        se: AudioFile;
    }

    export type DataFrameCellMV = [
        pattern: number,
        x: number,
        y: number,
        scale: number,
        rotation: number,
        mirror: boolean | 0 | 1,
        opacity: number,
        blendMode: number,
    ];

    export type DataFrameMV = DataFrameCellMV[];
    export interface DataAnimationMV extends DataBaseBase {
        frames: DataFrameMV[];
        animation1Name: string;
        animation2Name: string;
        animation1Hue: number;
        animation2Hue: number;
        timings: DataTimingMV[];
        position: number;
    }
    export type AnimationTarget = Game_Character | Game_Battler;
    export type AnimationRequest = {
        targets: AnimationTarget[];
        animationId: AnimationID;
        mirror: boolean;
    };
    export type BalloonRequest = {
        target: Game_Character;
        balloonId: BalloonIconID;
    };

    export type AnimationData = DataAnimation | DataAnimationMV;

    export type TerrainBattlebackType =
        | -1
        | 24
        | 25
        | 26
        | 27
        | 32
        | 33
        | 34
        | 35
        | 40
        | 41
        | 42
        | 4
        | 5
        | 20
        | 21
        | 22
        | 30
        | 38;

    // Maps, events, and troops

    export interface DataMapInfo {
        id: number;
        expanded: boolean;
        name: string;
        order: number;
        parentId: MapID;
        scrollX: number;
        scrollY: number;
    }
    export interface DataEncounter {
        troopId: TroopID;
        regionSet: number[];
        weight: number;
    }
    export interface DataMap {
        autoplayBgm: boolean;
        autoplayBgs: boolean;
        battleback1Name: string;
        battleback2Name: string;
        bgm: DataAudio;
        bgs: DataAudio;
        disableDashing: boolean;
        displayName: string;
        encounterList: DataEncounter[];
        encounterStep: number;
        height: number;
        note: string;
        parallaxLoopX: boolean;
        parallaxLoopY: boolean;
        parallaxName: string;
        parallaxShow: boolean;
        parallaxSx: number;
        parallaxSy: number;
        scrollType: number;
        specifyBattleback: boolean;
        tilesetId: TilesetID;
        width: number;
        data: number[];
        events: (DataEvent | null)[];
        meta?: Meta;
    }

    export type TilesetMode = 0 | 1;
    export interface DataTileset extends DataBase {
        mode: TilesetMode;
        tilesetNames: [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
        ];
        flags: number[];
    }

    export type SelfSwitchCharacter = "A" | "B" | "C" | "D";
    export interface EventPageConditions {
        switch1Valid: boolean;
        switch1Id: SwitchID;
        switch2Valid: boolean;
        switch2Id: SwitchID;
        variableValid: boolean;
        variableId: VariableID;
        variableValue: number;
        selfSwitchCh: SelfSwitchCharacter;
        selfSwitchValid: boolean;
        itemValid: boolean;
        itemId: ItemID;
        actorValid: boolean;
        actorId: ActorID;
    }
    export interface EventImage {
        tileId: TilesetID;
        characterName: string;
        direction: Direction;
        pattern: number;
        characterIndex: number;
    }
    export type MoveType = 0 | 1 | 2 | 3;
    export type MoveSpeed = 1 | 2 | 3 | 4 | 5 | 6;
    export type MoveFrequency = 1 | 2 | 3 | 4 | 5;
    export type PriorityType = 0 | 1 | 2;
    export type EventTrigger = 0 | 1 | 2 | 3 | 4;
    export interface DataEventPage {
        conditions: EventPageConditions;
        image: EventImage;
        moveType: MoveType;
        moveRoute: MoveRoute;
        moveSpeed: MoveSpeed;
        moveFrequency: MoveFrequency;
        walkAnime: boolean;
        stepAnime: boolean;
        directionFix: boolean;
        through: boolean;
        priorityType: PriorityType;
        trigger: EventTrigger;
        list: DataEventCommand[];
    }
    export interface DataEvent extends DataBase {
        pages: DataEventPage[];
        x: number;
        y: number;
    }
    export type CommonEventTrigger = 0 | 1 | 2;
    export interface DataCommonEvent extends DataBaseBase {
        trigger: CommonEventTrigger;
        switchId: SwitchID;
        list: DataEventCommand[];
    }

    export interface TroopMember {
        enemyId: EnemyID;
        x: number;
        y: number;
        hidden: boolean;
    }
    export interface TroopPageCondition {
        turnEnding: boolean;
        turnValid: boolean;
        turnA: number;
        turnB: number;
        enemyValid: boolean;
        enemyHp: number;
        enemyIndex: number;
        actorValid: boolean;
        actorHp: number;
        actorId: ActorID;
        switchValid: boolean;
        switchId: SwitchID;
    }
    export interface DataTroopPage {
        conditions: TroopPageCondition;
        list: DataCommand[];
        span: number;
    }
    export interface DataTroop extends DataBaseBase {
        members: TroopMember[];
        pages: DataTroopPage[];
    }

    // Event and movement commands

    export type TextWindowBackgroundType =
        0 /* Window */ | 1 /* Dim */ | 2; /* Transparent */
    export type TextWindowPositionType =
        0 /* Top */ | 1 /* Middle */ | 2; /* Bottom */
    export type VariableComparisonType =
        | 0 /* Equal to */
        | 1 /* Greater than or Equal to */
        | 2 /* Less than or Equal to */
        | 3 /* Greater than */
        | 4 /* Less than */
        | 5; /* Not Equal to */
    type CommandData<Code extends number, Parameters = []> = {
        code: Code;
        parameters: Parameters;
    };
    export type MoveCommand =
        | { code: 0; parameters?: [] }
        | {
              code: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
              parameters?: [];
          }
        | CommandData<14, [x: number, y: number]>
        | CommandData<15, [frames: number]>
        | {
              code: 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26;
              parameters?: [];
          }
        | CommandData<27 | 28, [switchId: SwitchID]>
        | CommandData<29, [speed: MoveSpeed]>
        | CommandData<30, [frequency: MoveFrequency]>
        | {
              code: 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40;
              parameters?: [];
          }
        | CommandData<41, [name: string, index: number]>
        | CommandData<42, [opacity: number]>
        | CommandData<43, [blendMode: number]>
        | CommandData<44, [se: AudioFile]>
        | CommandData<45, [script: string]>;

    export type RouteMovementCommand = MoveCommand;

    export type ConditionalBranchParams =
        | [0, SwitchID, 0 | 1] /* Switch */
        /* Variable */
        | [
              1,
              VariableID,
              0,
              number,
              VariableComparisonType,
          ] /* Compare by value */
        | [
              1,
              VariableID,
              1,
              VariableID,
              VariableComparisonType,
          ] /* Compare by variable */
        /* Self Switch */
        | [2, SelfSwitchCharacter, 0 | 1]
        /* Timer */
        | [3, number /* Seconds */, 0 | 1 /* ≥ or ≤ */]
        /* Actor */
        | [4, ActorID, 0, number?] /* In the Party */
        | [4, ActorID, 1, string] /* Name */
        | [4, ActorID, 2, ClassID] /* Class */
        | [4, ActorID, 3, SkillID] /* Skill */
        | [4, ActorID, 4, WeaponID] /* Weapon */
        | [4, ActorID, 5, ArmorID] /* Armor */
        | [4, ActorID, 6, StateID] /* State */
        /* Enemy */
        | [5, EnemyID, 0] /* Appeared */
        | [5, EnemyID, 1, StateID] /* State */
        /* Character */
        | [6, CharacterID, Direction]
        /* Gold */
        | [7, number /* Amount */, 0 | 1 | 2 /* ≥, ≤, < */]
        /* Item */
        | [8, ItemID]
        /* Weapon */
        | [9, WeaponID, boolean]
        /* Armor */
        | [10, ArmorID, boolean]
        /* Button */
        | [
              11,
              string /* Key Name */,
              0 | 1 | 2 /* Is Pressed, Is Triggered, Is Repeated */,
          ]
        /* Script */
        | [12, string]
        /* Vehicle */
        | [13, VehicleIndex];
    export type DataEventCommand = { indent: number } & (
        | CommandData<0>
        /* Show Text */
        | CommandData<
              101,
              [
                  string /* Face Name */,
                  number /* Face Index */,
                  TextWindowBackgroundType,
                  TextWindowPositionType,
                  string /* Talker Name */,
              ]
          >
        | CommandData<401, [string]> /* Text */
        /* Show Choices */
        | CommandData<
              102,
              [
                  string[] /* Choices */,
                  number /* Cancel Type */,
                  number /* Default Type */,
                  TextWindowPositionType,
                  TextWindowBackgroundType,
              ]
          >
        | CommandData<
              402,
              [choiceIndex: number, choiceName: string]
          > /* When [**] */
        | CommandData<403> /* When Cancel */
        | CommandData<404> /* End Choices */
        /* Input Number */
        | CommandData<103, [number /* Variable ID */, number /* Max Digits */]>
        /* Select Item */
        | CommandData<104, [number /* Variable ID */, ItemType?]>
        /* Show Scrolling Text */
        | CommandData<105, [number /* Speed */, boolean /* No Fast */]>
        | CommandData<405, [string]> /* Text */
        /* Comment */
        | CommandData<108, [string]>
        | CommandData<408, [string]>
        /* Skip */
        | CommandData<109>
        /* Conditional Branch */
        | CommandData<111, ConditionalBranchParams>
        /* Else */
        | CommandData<411>
        | CommandData<412> /* End Conditional Branch */
        /* Loop */
        | CommandData<112>
        /* Repeat Above */
        | CommandData<413>
        /* Break Loop */
        | CommandData<113>
        /* Exit Event Processing */
        | CommandData<115>
        /* Common Event */
        | CommandData<117, [CommonEventID]>
        /* Label */
        | CommandData<118, [string]>
        /* Jump to Label */
        | CommandData<119, [string]>
        /* Control Switches */
        | CommandData<121, [SwitchID, SwitchID, 0 | 1]>
        /* Control Variables */
        | CommandData<
              122,
              [
                  VariableID,
                  VariableID,
                  VariableOperationType,
                  ...(
                      | [0, number] /* Constant */
                      | [1, VariableID] /* Variable */
                      | [2, number, number] /* Random */
                      /* Game Data */
                      | [
                            3,
                            ...(
                                | [0, ItemID] /* Item */
                                | [1, WeaponID] /* Weapon */
                                | [2, ArmorID] /* Armor */
                                | [
                                      3 /* Actor */,
                                      ActorID,
                                      /* Level, EXP, HP, MP, (param 0~7), TP */
                                      (
                                          | 0
                                          | 1
                                          | 2
                                          | 3
                                          | 4
                                          | 5
                                          | 6
                                          | 7
                                          | 8
                                          | 9
                                          | 10
                                          | 11
                                          | 12
                                      ),
                                  ]
                                | [
                                      4 /* Enemy */,
                                      EnemyID,
                                      /* HP, MP, (param 0~7), TP */
                                      (
                                          | 0
                                          | 1
                                          | 2
                                          | 3
                                          | 4
                                          | 5
                                          | 6
                                          | 7
                                          | 8
                                          | 9
                                          | 10
                                      ),
                                  ]
                                | [
                                      5 /* Character */,
                                      CharacterID,
                                      /* Map X, Map Y, Direction, Screen X, Screen Y */
                                      0 | 1 | 2 | 3 | 4,
                                  ]
                                | [6, number] /* Party */
                                | [8, ActionDataType] /* Last */
                                | [
                                      7,
                                      (
                                          | 0 /* Map ID */
                                          | 1 /* Party Members */
                                          | 2 /* Gold */
                                          | 3 /* Steps */
                                          | 4 /* Play Time */
                                          | 5 /* Timer */
                                          | 6 /* Save Count */
                                          | 7 /* Battle Count */
                                          | 8 /* Win Count */
                                          /* Escape Count */
                                          | 9
                                      ),
                                  ]
                            ),
                        ]
                      /* Script */
                      | [4, string]
                  ),
              ]
          >
        /* Control Self Switch */
        | CommandData<123, [SelfSwitchCharacter, 0 | 1]>
        /* Control Timer */
        | CommandData<124, [0, number] /* Start, Second */ | [1] /* Stop */>
        /* Change Gold */
        | CommandData<125, [ValueOperation, ...ValueOperand]>
        /* Change Items */
        | CommandData<126, [ItemID, ValueOperation, ...ValueOperand]>
        /* Change Weapons */
        | CommandData<127, [WeaponID, ValueOperation, ...ValueOperand, boolean]>
        /* Change Armors */
        | CommandData<128, [ArmorID, ValueOperation, ...ValueOperand, boolean]>
        /* Change Party Member */
        | CommandData<
              129,
              | [ActorID, 0, boolean] /* Add, initialize */
              | [ActorID, 1, boolean?] /* Remove */
          >
        /* Change Battle BGM */
        | CommandData<132, [DataAudio]>
        /* Change Victory ME */
        | CommandData<133, [DataAudio]>
        /* Change Save Access */
        | CommandData<134, [0 | 1]>
        /* Change Menu Access */
        | CommandData<135, [0 | 1]>
        /* Change Encounter */
        | CommandData<136, [0 | 1]>
        /* Change Formation Access */
        | CommandData<137, [0 | 1]>
        /* Change Window Color */
        | CommandData<138, [Tone]>
        /* Change Default ME */
        | CommandData<139, [DataAudio]>
        /* Change Vehicle BGM */
        | CommandData<140, [vehicle: VehicleIndex, bgm: AudioFile]>
        /* Transfer Player (Map, X, Y) */
        | CommandData<
              201,
              [
                  ...(
                      | [0, MapID, number, number] /* Direct designation */
                      /* Designation by variables */
                      | [1, VariableID, VariableID, VariableID]
                  ),
                  Direction,
                  number /* Fade type */,
              ]
          >
        /* Set Vehicle Location */
        | CommandData<
              202,
              [
                  VehicleIndex,
                  ...(
                      | [0, MapID, number, number] /* Direct designation */
                      /* Designation by variables */
                      | [1, VariableID, VariableID, VariableID]
                  ),
              ]
          >
        /* Set Event Location */
        | CommandData<
              203,
              | [
                    CharacterID,
                    0,
                    number,
                    number,
                    Direction,
                ] /* Direct designation */
              | [
                    CharacterID,
                    1,
                    VariableID,
                    VariableID,
                    Direction,
                ] /* Designation by variables */
              | [
                    CharacterID,
                    2,
                    CharacterID,
                    number,
                    Direction,
                ] /* Exchange with another event */
          >
        /* Scroll Map */
        | CommandData<
              204,
              [
                  Direction,
                  number /* Distance */,
                  number /* Speed */,
                  boolean /* Wait */,
              ]
          >
        /* Set Movement Route */
        | CommandData<205, [number /* Character ID */, MoveRoute]>
        /* Movement Route */
        | CommandData<505, [RouteMovementCommand]>
        /* Get on/off Vehicle */
        | CommandData<206>
        /* Change Transparency */
        | CommandData<211, [0 | 1]>
        /* Show Animation */
        | CommandData<212, [CharacterID, AnimationID, boolean /* Wait */]>
        /* Show Balloon Icon */
        | CommandData<213, [CharacterID, BalloonIconID, boolean /* Wait */]>
        /* Erase Event */
        | CommandData<214>
        /* Change Player Followers */
        | CommandData<216, [0 | 1]>
        /* Gather Followers */
        | CommandData<217>
        /* Fadeout Screen */
        | CommandData<221>
        /* Fadein Screen */
        | CommandData<222>
        /* Tint Screen */
        | CommandData<223, [Tone, number /* Duration */, boolean /* Wait */]>
        /* Flash Screen */
        | CommandData<224, [Color, number /* Duration */, boolean /* Wait */]>
        /* Shake Screen */
        | CommandData<
              225,
              [
                  number /* Power */,
                  number /* Speed */,
                  number /* Duration */,
                  boolean /* Wait */,
              ]
          >
        /* Wait */
        | CommandData<230, [number]>
        /* Show Picture */
        | CommandData<
              231,
              [
                  PictureID,
                  string /* Image Name */,
                  number /* Origin */,
                  0 | 1 /* Direct designation or Designation with variables */,
                  number | VariableID /* X */,
                  number | VariableID /* Y */,
                  number /* Scale X */,
                  number /* Scale Y */,
                  number /* Opacity */,
                  number /* Blend Mode */,
              ]
          >
        /* Move Picture */
        | CommandData<
              232,
              [
                  PictureID,
                  string /* Image Name */,
                  number /* Origin */,
                  0 | 1 /* Direct designation or Designation with variables */,
                  number | VariableID /* X */,
                  number | VariableID /* Y */,
                  number /* Scale X */,
                  number /* Scale Y */,
                  number /* Opacity */,
                  number /* Blend Mode */,
                  number /* Duration */,
                  boolean /* Wait */,
                  PictureEasingType?,
              ]
          >
        /* Rotate Picture */
        | CommandData<233, [PictureID, number]>
        /* Tint Picture */
        | CommandData<
              234,
              [PictureID, Tone, number /* Duration */, boolean /* Wait */]
          >
        /* Erase Picture */
        | CommandData<235, [PictureID]>
        /* Set Weather Effect */
        | CommandData<
              236,
              [
                  WeatherType,
                  number /* Power */,
                  number /* Duration */,
                  boolean /* Wait */,
              ]
          >
        /* Play BGM */
        | CommandData<241, [DataAudio]>
        /* Fadeout BGM */
        | CommandData<242, [number]> /* Duration */
        /* Save BGM */
        | CommandData<243>
        /* Resume BGM */
        | CommandData<244>
        /* Play BGS */
        | CommandData<245, [DataAudio]>
        /* Fadeout BGS */
        | CommandData<246, [number]> /* Duration */
        /* Play ME */
        | CommandData<249, [DataAudio]>
        /* Play SE */
        | CommandData<250, [DataAudio]>
        /* Stop SE */
        | CommandData<251>
        /* Play Movie */
        | CommandData<261, [string]>
        /* Change Map Name Display */
        | CommandData<281, [0 | 1]>
        /* Change Tileset */
        | CommandData<282, [TilesetID]>
        /* Change Battle Background */
        | CommandData<283, [string, string]>
        /* Change Parallax */
        | CommandData<
              284,
              [
                  string /* Name */,
                  boolean /* Loop X */,
                  boolean /* Loop Y */,
                  number /* Scroll X Speed */,
                  number /* Scroll Y Speed */,
              ]
          >
        /* Get Location Info */
        | CommandData<
              285,
              [
                  VariableID,
                  (
                      | 0 /* Terrain Tag */
                      | 1 /* Event ID */
                      | (2 | 3 | 4 | 5 /* Tile ID (Layer 1 ~ 4) */)
                      /* Region ID */
                      | 6
                  ),
                  ...(
                      | [0, number, number] /* Direct designation */
                      /* Designation by variables */
                      | [1, VariableID, VariableID]
                      | [2, CharacterID, number]
                  ),
              ]
          >
        /* Battle Processing */
        | CommandData<
              301,
              [
                  ...(
                      | [0, TroopID] /* Direct designation */
                      | [1, VariableID] /* Designation by variables */
                      | [2, number]
                  ) /* Same as Random Encounters */,
                  boolean /* Can escape */,
                  boolean /* Can lose */,
              ]
          >
        /* If Win */
        | CommandData<601>
        /* If Escape */
        | CommandData<602>
        /* If Lose */
        | CommandData<603>
        | CommandData<604> /* End Battle Processing */
        /* Shop Processing */
        | CommandData<302, [...ShopGoods, boolean /* Purchase only */]>
        | CommandData<605, ShopGoods>
        /* Name Input Processing */
        | CommandData<303, [ActorID, number /* Max length */]>
        /* Change HP */
        | CommandData<311, [...ChangeActorValue, boolean /* Allow Death */]>
        /* Change MP */
        | CommandData<312, ChangeActorValue>
        /* Change TP */
        | CommandData<326, ChangeActorValue>
        /* Change State */
        | CommandData<
              313,
              [...IterateActorArguments, 0 | 1 /* Add | Remove */, StateID]
          >
        /* Recover All */
        | CommandData<314, IterateActorArguments>
        /* Change EXP */
        | CommandData<315, [...ChangeActorValue, boolean /* Show */]>
        /* Change Level */
        | CommandData<316, [...ChangeActorValue, boolean /* Show */]>
        /* Change Parameter */
        | CommandData<
              317,
              [
                  ...IterateActorArguments,
                  ParamID,
                  ValueOperation,
                  ...ValueOperand,
              ]
          >
        /* Change Skill */
        | CommandData<
              318,
              [...IterateActorArguments, 0 | 1 /* Learn | Forget */, SkillID]
          >
        /* Change Equipment */
        | CommandData<319, [ActorID, EquipmentType, ItemID]>
        /* Change Name */
        | CommandData<320, [ActorID, string]>
        /* Change Class */
        | CommandData<321, [ActorID, ClassID, boolean /* Keep EXP */]>
        /* Change Actor Images */
        | CommandData<
              322,
              [
                  ActorID,
                  ...[string, number] /* Character Image (Name, Index) */,
                  ...[string, number] /* Face Image (Name, Index) */,
                  string /* Battler Image */,
              ]
          >
        /* Change Vehicle Image */
        | CommandData<
              323,
              [
                  vehicle: VehicleIndex,
                  characterName: string,
                  characterIndex: number,
              ]
          >
        /* Change Nickname */
        | CommandData<324, [ActorID, string]>
        /* Change Profile */
        | CommandData<325, [ActorID, string]>
        /* Change Enemy HP */
        | CommandData<331, [...ChangeEnemyValue, boolean /* Allow Death */]>
        /* Change Enemy MP */
        | CommandData<332, ChangeEnemyValue>
        /* Change Enemy TP */
        | CommandData<342, ChangeEnemyValue>
        /* Change Enemy State */
        | CommandData<333, [EnemyID, 0 | 1 /* Add | Remove */, StateID]>
        /* Enemy Recover All */
        | CommandData<334, [EnemyID]>
        /* Enemy Appear */
        | CommandData<335, [EnemyID]>
        /* Enemy Transform */
        | CommandData<336, [EnemyID, EnemyID]>
        /* Show Battle Animation */
        | CommandData<337, [EnemyID, AnimationID, boolean]>
        /* Force Action */
        | CommandData<
              339,
              [...([0, EnemyID] | [1, ActorID]), SkillID, ActorID | EnemyID]
          >
        /* Abort Battle */
        | CommandData<340>
        /* Open Menu Screen */
        | CommandData<351>
        /* Open Save Screen */
        | CommandData<352>
        /* Game Over */
        | CommandData<353>
        /* Return to Title Screen */
        | CommandData<354>
        /* Script */
        | CommandData<355, [string]>
        | CommandData<655, [string]>
        /* Plugin Command MV (deprecated) */
        | CommandData<356, [string]>
        /* Plugin Command */
        | CommandData<
              357,
              [
                  pluginName: string,
                  commandName: string,
                  displayName: string,
                  args: PluginParameters,
              ]
          >
        | CommandData<657, [string]>
    );
    export type DataCommand = DataEventCommand;

    export type CommandCode = DataEventCommand["code"];
    export type RouteCommandCode = RouteMovementCommand["code"];
    export type ExtractDataCommand<TCode extends CommandCode> = Extract<
        DataCommand,
        {
            code: TCode;
        }
    >;
    export type CommandParams<TCode extends CommandCode> =
        ExtractDataCommand<TCode>["parameters"];
    export interface MoveRoute {
        list: MoveCommand[];
        repeat: boolean;
        skippable: boolean;
        wait: boolean;
    }
    export type VehicleIndex = 0 | 1 | 2;

    export type VariableOperationType =
        | 0 /* Set */
        | 1 /* Add */
        | 2 /* Sub */
        | 3 /* Mul */
        | 4 /* Div */
        | 5; /* Mod */
    export type ValueOperation = 0 /* Value */ | 1; /* Negative Value */
    export type ValueOperand =
        [0, number] /* Constant */ | [1, VariableID]; /* Variable */
    export type IterateActorArguments = [0, ActorID] | [1, VariableID];
    export type ChangeActorValue = [
        ...IterateActorArguments,
        ValueOperation,
        ...ValueOperand,
    ];
    export type ChangeEnemyValue = [EnemyID, ValueOperation, ...ValueOperand];
    export type WaitMode =
        | ""
        | "message"
        | "transfer"
        | "scroll"
        | "route"
        | "animation"
        | "balloon"
        | "gather"
        | "video"
        | "action"
        | "image"
        | "effect"
        | "movement";
    export type ShopGoodsEntry = [...ShopGoods, boolean?];

    export type ShopGoods = [
        ...([0, ItemID] | [1, WeaponID] | [2, ArmorID]),
        ...([0, number] | [1, number]),
    ];

    // System, saves, and plugins

    export interface Advanced {
        gameId: number;
        screenWidth: number;
        screenHeight: number;
        uiAreaWidth: number;
        uiAreaHeight: number;
        mainFontFilename: string;
        numberFontFilename: string;
        fallbackFonts: string;
        fontSize: number;
        windowOpacity: number;
        screenScale?: number;
        picturesUpperLimit?: number;
    }
    export type VehicleType = "airship" | "boat" | "ship" | "walk";
    export interface DataVehicle {
        bgm: DataAudio;
        characterIndex: number;
        characterName: string;
        startMapId: MapID;
        startX: number;
        startY: number;
    }
    export type AttackMotionType = 0 | 1 | 2;
    export type AttackMotionImage = number;
    export interface AttackMotion {
        type: AttackMotionType;
        weaponImageId: AttackMotionImage;
    }
    export interface TestBattler {
        actorId: ActorID;
        level: number;
        equips: (WeaponID | ArmorID)[];
    }
    export interface TitleCommandWindow {
        background: TextWindowBackgroundType;
        offsetX: number;
        offsetY: number;
    }
    export type BattleSystem = 0 | 1 | 2;
    export interface DataSystem {
        gameTitle: string;
        partyMembers: number[];
        currencyUnit: string;
        windowTone: Tone;
        boat: DataVehicle;
        ship: DataVehicle;
        airship: DataVehicle;
        startMapId: MapID;
        startX: number;
        startY: number;
        title1Name: string;
        title2Name: string;
        optDrawTitle: boolean;
        titleCommandWindow: TitleCommandWindow;
        optSideView: boolean;
        battleSystem: BattleSystem;
        optTransparent: boolean;
        optFollowers: boolean;
        optSlipDeath: boolean;
        optFloorDeath: boolean;
        optDisplayTp: boolean;
        optExtraExp: boolean;
        optKeyItemsNumber: boolean;
        optAutosave: boolean;
        optSplashScreen: boolean;
        optMessageSkip: boolean;
        titleBgm: DataAudio;
        battleBgm: DataAudio;
        victoryMe: DataAudio;
        defeatMe: DataAudio;
        gameoverMe: DataAudio;
        sounds: AudioFile[];
        menuCommands: [boolean, boolean, boolean, boolean, boolean, boolean];
        itemCategories: [boolean, boolean, boolean, boolean];
        magicSkills: SkillType[];
        attackMotions: AttackMotion[];
        advanced: Advanced;
        battleback1Name: string;
        battleback2Name: string;
        battlerHue: number;
        battlerName: string;
        editMapId: MapID;
        locale: string;
        elements: string[];
        skillTypes: string[];
        weaponTypes: string[];
        armorTypes: string[];
        equipTypes: string[];
        terms: Terms;
        switches: string[];
        variables: string[];
        testBattlers: TestBattler[];
        testTroopId: TroopID;
        versionId: number;
        tileSize?: number;
        faceSize?: number;
        iconSize?: number;
        editor: SystemEditorSettings;
        hasEncryptedImages?: boolean;
        hasEncryptedAudio?: boolean;
        encryptionKey?: string;
    }

    export interface SystemEditorSettings {
        messageWidth1: number;
        messageWidth2: number;
        jsonFormatLevel: number;
    }

    export interface Messages {
        alwaysDash: string;
        commandRemember: string;
        touchUI: string;
        bgmVolume: string;
        bgsVolume: string;
        meVolume: string;
        seVolume: string;
        possession: string;
        expTotal: string;
        expNext: string;
        saveMessage: string;
        loadMessage: string;
        file: string;
        autosave: string;
        partyName: string;
        emerge: string;
        preemptive: string;
        surprise: string;
        escapeStart: string;
        escapeFailure: string;
        victory: string;
        defeat: string;
        obtainExp: string;
        obtainGold: string;
        obtainItem: string;
        levelUp: string;
        obtainSkill: string;
        useItem: string;
        criticalToEnemy: string;
        criticalToActor: string;
        actorDamage: string;
        actorRecovery: string;
        actorGain: string;
        actorLoss: string;
        actorDrain: string;
        actorNoDamage: string;
        actorNoHit: string;
        enemyDamage: string;
        enemyRecovery: string;
        enemyGain: string;
        enemyLoss: string;
        enemyDrain: string;
        enemyNoDamage: string;
        enemyNoHit: string;
        evasion: string;
        magicEvasion: string;
        magicReflection: string;
        counterAttack: string;
        substitute: string;
        buffAdd: string;
        debuffAdd: string;
        buffRemove: string;
        actionFailure: string;
    }
    export interface Terms {
        basic: [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
        ];
        params: [
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
            string,
        ];
        commands: (string | null)[];
        messages: Messages;
    }

    export interface SaveFileInfo {
        title: string;
        characters: [string, number][];
        faces: [string, number][];
        playtime: string;
        timestamp: number;
    }
    export type DataGlobalInfo = (SaveFileInfo | null | undefined)[];
    export interface SaveContents {
        system: Game_System;
        screen: Game_Screen;
        timer: Game_Timer;
        switches: Game_Switches;
        variables: Game_Variables;
        selfSwitches: Game_SelfSwitches;
        actors: Game_Actors;
        party: Game_Party;
        map: Game_Map;
        player: Game_Player;
    }

    export type DataSaveInfo = SaveFileInfo;

    export interface ConfigData {
        alwaysDash: boolean;
        commandRemember: boolean;
        touchUI: boolean;
        bgmVolume: number;
        bgsVolume: number;
        meVolume: number;
        seVolume: number;
    }

    export type DataConfig = ConfigData;

    export type PluginParameters = Record<string, string>;

    export interface DataPlugin {
        name: string;
        status: boolean;
        description: string;
        parameters: PluginParameters;
    }

    export type PluginEntry = DataPlugin;
}

declare var $dataActors: (RMMZ.DataActor | null)[];
declare var $dataClasses: (RMMZ.DataClass | null)[];
declare var $dataSkills: (RMMZ.DataSkill | null)[];
declare var $dataItems: (RMMZ.DataItem | null)[];
declare var $dataWeapons: (RMMZ.DataWeapon | null)[];
declare var $dataArmors: (RMMZ.DataArmor | null)[];
declare var $dataEnemies: (RMMZ.DataEnemy | null)[];
declare var $dataTroops: (RMMZ.DataTroop | null)[];
declare var $dataStates: (RMMZ.DataState | null)[];
declare var $dataAnimations: (RMMZ.AnimationData | null)[];
declare var $dataTilesets: (RMMZ.DataTileset | null)[];
declare var $dataCommonEvents: (RMMZ.DataCommonEvent | null)[];
declare var $dataSystem: RMMZ.DataSystem;
declare var $dataMapInfos: (RMMZ.DataMapInfo | null)[];
declare var $dataMap: RMMZ.DataMap;

declare var $gameTemp: Game_Temp;
declare var $gameSystem: Game_System;
declare var $gameScreen: Game_Screen;
declare var $gameTimer: Game_Timer;
declare var $gameMessage: Game_Message;
declare var $gameSwitches: Game_Switches;
declare var $gameVariables: Game_Variables;
declare var $gameSelfSwitches: Game_SelfSwitches;
declare var $gameActors: Game_Actors;
declare var $gameParty: Game_Party;
declare var $gameTroop: Game_Troop;
declare var $gameMap: Game_Map;
declare var $gamePlayer: Game_Player;

declare var $testEvent: RMMZ.DataEventCommand[] | null;
declare var $plugins: RMMZ.DataPlugin[];
