"use strict";

var SceneBase = require("./SceneBase");

var GamePartyMissile = require("../game/GamePartyMissile");
var GameEnemyMissile = require("../game/GameEnemyMissile");
var GameBoom = require("../game/GameBoom");
var GameLevel = require("../game/GameLevel");

var Phases = cc.Enum({
    IDLE: "IDLE",
    START: "START",
    PAUSE: "PAUSE",
    PRE_END: "PRE_END",
    COMPLETE: "COMPLETE",
    GAMEOVER: "GAMEOVER"
});

var BaseStatus = cc.Enum({
    NORMAL: "NORMAL",
    LOW: "LOW",
    OUT: "OUT",
    DESTROY: "DESTROY"
});

var AudioMap = cc.Enum({
    MARK: 0,
    FLY: 1,
    BOOM: 2
});

cc.Class({
    extends: SceneBase,

    properties: {
        labelWave: {
            type: cc.Label,
            default: null
        },
        labelScore: {
            type: cc.Label,
            default: null
        },
        labelHighScore: {
            type: cc.Label,
            default: null
        },
        maskNode: {
            type: cc.Mask,
            default: null
        },
        drawNode: {
            type: cc.Graphics,
            default: null
        },
        flashNode: {
            type: cc.Graphics,
            default: null
        },
        baseNodes: [cc.Node],       // 基地
        buildingNodes: [cc.Node],   // 建筑

        BaseMissileNum: 10
        
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        // 己方导弹精灵
        this.partyMissiles = {
            left:   [],
            middle: [],
            right:  []
        };
        this.partyMissileBaseStatus = {
            left:   BaseStatus.NORMAL,
            middle: BaseStatus.NORMAL,
            right:  BaseStatus.NORMAL
        };
        // 己方建筑
        this.biuldings = [];
        // 爆炸节点
        this.booms = [];
        // 敌人导弹
        this.enemyMissiles = [];
        // 敌人飞行器
        this.enemyPlanes = [];
        // 初始化渲染节点
        this.initGraphics();


    },

    start () {
        this._super();

        this.currLevel = 0;  // 波数
        this.currScore = 0; // 当前分数
        this.highScore = 0; // 最高分

        this.cmds = []; // 用户指令
        
        // 读取关卡
        this.level = null;
        this.currWave = 0;  // 当前波数
        this.currWaveDeadNum = 0;   // 本波消灭的敌人
        this.nextWaveDelay = 0;
        // 暂时按这个方式加载关卡，8波敌人
        var self = this;
        cc.loader.loadRes("prefabs/level", function(err, prefab) {
            var levelNode = cc.instantiate(prefab);
            var level = levelNode.getComponent(GameLevel);
            cc.log(level.getWaveCount());
            var waves = level.getWaves(); // <- get nodes
            self.level = level;
            self.phase = Phases.START;
        });

        this.refreshUI();
    },

    onUpdate (dt) {
        this._super(dt);
        switch (this.phase) {
            case Phases.START:
                this.updateStart();
                break;
        }
    },

    updateStart () {
        
        if (this.frameCount % 8 <= 4) {
            this.flashRed();
        } else {
            this.flashWhite();
        }
        if (this.frameCount % 4 == 0) { // 帧延迟
            this.refreshUI();
        }
        // 处理用户操作
        this.dealCmds();
        // 判定并生成本波敌人
        if (this.currWaveDeadNum == 0) {
            if (this.nextWaveDelay == 0) {
                this.launchEnemy(this.currWave);
                this.currWave += 1;
            } else {
                this.nextWaveDelay -= 1;
            }
        }
        // 更新物品逻辑
        var isDraw = false;
        // 玩家导弹
        for (var partyMissiles in this.partyMissiles) {
            for (var i = 0; i < this.partyMissiles[partyMissiles].length; i += 1) {
                var missile = this.partyMissiles[partyMissiles][i];
                if (missile != null && missile.state != GamePartyMissile.States.BOOM) {
                    missile.update();
                    if (missile.state == GamePartyMissile.States.BOOM) {
                        var boomPos = cc.v2(missile.x, missile.y);
                        this.addBoom(boomPos);
                        this.playSE(this.audioClips[AudioMap.BOOM]);
                        if (!!missile.missileTargetNode) {
                            missile.missileTargetNode.removeFromParent();
                        }
                        // delete this.partyMissiles[partyMissiles][i];
                        // this.partyMissiles[partyMissiles][i] = null;
                    }
                }
            }
        }
        // 敌人导弹
        for (var i = 0; i < this.enemyMissiles.length; i += 1) {
            var missile = this.enemyMissiles[i];
            if (missile != null && missile.state == GameEnemyMissile.States.FLY) {
                missile.update();
            } else if (missile != null) {
                if (missile.state == GameEnemyMissile.States.BOOM) {
                    var boomPos = cc.v2(missile.x, missile.y);
                    this.addBoom(boomPos);
                    this.playSE(this.audioClips[AudioMap.BOOM]);
                    // delete this.enemyMissiles[i];
                    this.enemyMissiles[i] = null;
                    this.currWaveDeadNum -= 1;
                } else if (missile.state == GameEnemyMissile.States.DIVIDE) {
                    // 分裂
                    var num = Math.floor(Math.random() * 2) + 2;
                    cc.log("divide",num);
                    for (var _i = 0; _i < num; _i += 1) {
                        var pos = cc.v2(missile.x, missile.y);
                        this.launchEnemyMissile(pos, missile);
                        this.currWaveDeadNum += 1;
                    }
                    // delete this.enemyMissiles[i];
                    this.enemyMissiles[i] = null;
                    this.currWaveDeadNum -= 1;
                }
            }
        }
        // 敌人飞行器
        for (var i = 0; i < this.enemyPlanes.length; i += 1) {
            var plane = this.enemyPlanes[i];
            plane.update();
        }
        // 爆炸范围
        for (var i = 0; i < this.booms.length; i += 1) {
            var boom = this.booms[i];
            if (boom != null) {
                boom.update();
                if (boom.isDead()) {
                    // delete this.booms[i];
                    this.booms[i] = null;
                } else {
                    // 检测周围导弹
                    for (var i = 0; i < this.enemyMissiles.length; i += 1) {
                        var missile = this.enemyMissiles[i];
                        if (missile != null && missile.state == GameEnemyMissile.States.FLY) {
                            var mPos = cc.v2(missile.x, missile.y);
                            var bPos = cc.v2(boom.x, boom.y);
                            if (cc.pDistance(mPos, bPos) < boom.r()) {
                                missile.boom();
                            }
                        }
                    }
                }
            }
        }

        // 判定游戏进度
        this.judge();
    },

    flashRed() {
        this.flashNode.clear();
        this.flashNode.fillColor = cc.color(255,255,255,255);
        this.flashNode.rect(0, 0, this.flashNode.node.width, this.flashNode.node.height);
        this.flashNode.fill();
    },
    flashWhite() {
        this.flashNode.clear();
        this.flashNode.fillColor = cc.color(200,20,20,255);
        this.flashNode.rect(0, 0, this.flashNode.node.width, this.flashNode.node.height);
        this.flashNode.fill();
    },
    initGraphics () {
        this.maskNode._refreshStencil();
        // this.maskNode.type = 0;  // 触发refreshStencil
        var maskDrawNode = this.maskNode.getClippingStencil();
        maskDrawNode.clear();
        if (CC_JSB) {
            this.canvas.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTouch, this);
        } else {
            this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        }
    },

    onTouch(evt) {
        if (this.phase != Phases.START) {
            return;
        }
        this.cmds[this.cmds.length] = evt;
    },

    refreshUI () {
        this.labelWave.string = cc.js.formatStr("Level: %d", this.currLevel + 1);
        this.labelScore.string = cc.js.formatStr("Score: %d", this.currScore);
        this.labelHighScore.string = cc.js.formatStr("Highest : %d", this.highScore);
        var maskDrawNode = this.maskNode.getClippingStencil();
        maskDrawNode.clear();
        this.drawNode.clear();
    },

    dealCmds () {
        for (var i = 0; i < this.cmds.length; i += 1) {
            var evt = this.cmds[i];
            this.tryLaunch(evt.getLocation());
            // this.addBoom(evt.getLocation());
        }
        this.cmds = [];
    },

    markMissileTarget(node, pos, missile) {
        node.setPosition(pos);
        this.drawNode.node.parent.addChild(node);
        missile.missileTargetNode = node;
    },

    addBoom(pos) {
        var node = this.maskNode.node;
        var i = 0;
        for (i = 0; i < this.booms.length; i += 1) {
            if (this.booms[i] == null) {
                break;
            }
        }
        this.booms[i] = new GameBoom(pos);
        this.booms[i].setDrawNode(this.maskNode);
    },

    /**
     * 检测临近的基地
     * @param {*位置} pos 
     */
    tryLaunch(pos) {
        var loc = this.drawNode.node.convertToNodeSpaceAR(pos);
        var x = loc.x;
        var width = this.drawNode.node.width;
        var index = Math.floor((x + width / 2) / (width / 3));
        var keys = ["left", "middle", "right"];
        var key = keys[index];
        var prepareNodes = [];
        for (var i = 0; i < keys.length; i += 1) {
            if (this.partyMissiles[keys[i]].length != this.BaseMissileNum) {   // 未发射完
                prepareNodes.push(i);
            }
        }

        var pos = prepareNodes.length == 0 ? cc.Vec2.ZERO : this.baseNodes[prepareNodes[0]].getPosition();
        var nodeIndex = -1;
        for (var i = 0; i < prepareNodes.length; i += 1) {
            var index = prepareNodes[i];
            var node = this.baseNodes[index];
            if (cc.pDistance(node.getPosition(), loc) <= cc.pDistance(pos, loc)) {
                pos = node.getPosition();
                nodeIndex = index;
            }
        }
        if (nodeIndex != -1) {
            var baseNode = this.baseNodes[nodeIndex].getChildByName("missile_" + (this.partyMissiles[keys[nodeIndex]].length));
            baseNode.active = false;
            var startPos = baseNode.parent.convertToWorldSpaceAR(baseNode.getPosition());
            this.launch(nodeIndex, loc, startPos);
        }
        this.playSE(this.audioClips[AudioMap.MARK]);
    },

    /**
     * 指定基地发射
     * @param {*基地} index 
     * @param {*目标位置} loc 
     */
    launch(index, loc, startPos) {
        // var startPos = [
        //     -1,
        //     0,
        //     1
        // ];
        // var _x = startPos[index] * this.drawNode.node.width / 2;
        // var _y = -this.drawNode.node.height / 2;
        
        var _pos = this.drawNode.node.convertToNodeSpaceAR(startPos);//
        var missile = new GamePartyMissile(
            _pos
        );
        missile.setDrawNode(this.drawNode);
        missile.setFlashNode(this.maskNode);
        missile.flyTo(loc);
        var i = 0;
        var key = ["left", "middle", "right"][index];
        for (i = 0; i < this.partyMissiles[key].length; i += 1) {
            if (this.partyMissiles[key][i] == null) {
                break;
            }
        }
        this.partyMissiles[key][i] = missile;
        // 绘制目标精灵
        var self = this;
        cc.loader.loadRes("prefabs/targetNode", cc.Prefab, function(err, prefab) {
            if (missile.state != GamePartyMissile.States.BOOM) {
                var node = cc.instantiate(prefab);
                self.markMissileTarget(node, loc, missile);
            }
        });
    },

    /**
     * 发射敌人导弹
     * @param {*波数} waveNum
     */
    launchEnemy(waveNum) {
        var wave = this.level.getWave(waveNum);
        if (!wave) {
            return;
        }
        for (var i = 0; i < wave.missilesNum; i += 1) {
            var x = Math.floor(Math.random() * this.drawNode.node.width) - this.drawNode.node.width / 2;
            var y = this.drawNode.node.height / 2;
            var pos = cc.v2(x, y);
            this.launchEnemyMissile(pos);
            this.nextWaveDelay = wave.nextWaveDelay;
            this.currWaveDeadNum += 1;
        }
    },

    launchEnemyMissile(pos, parent) {
        //var pos = cc.v2(_x, _y);//this.drawNode.node.convertToNodeSpaceAR(cc.v2(_x, _y));
        var missile = new GameEnemyMissile(
            pos,
            !!parent
        );
        if (parent) {
            // missile.addStartPos(parent.startPos);
        }
        // var locs = [
        //     cc.v2(0, -this.drawNode.node.height / 2),
        //     cc.v2(-this.drawNode.node.width / 2, -this.drawNode.node.height / 2),
        //     cc.v2(-this.drawNode.node.width / 2, -this.drawNode.node.height / 2),
        // ]
        var locs = [];
        var sep = 20;
        for (var _i = 0; _i < sep; _i += 1) {
            var x = Math.floor(-this.drawNode.node.width / 2 + 
                this.drawNode.node.width * _i / sep
            );
            locs.push(cc.v2(x, -this.drawNode.node.height / 2 + 12));
        }
        missile.setPrepareTargets(locs);
        missile.setDrawNode(this.drawNode);
        missile.setFlashNode(this.maskNode);
        missile.fly();
        this.canvas.node.runAction(cc.sequence(
            cc.delayTime(Math.random()*0.24),
            cc.callFunc(this.playFlySE, this)
        ))
        var i = 0;
        for (i = 0; i < this.enemyMissiles.length; i += 1) {
            if (this.enemyMissiles[i] == null) {
                break;
            }
        }
        cc.log("i", i);
        this.enemyMissiles[i] = missile;
    },
    playFlySE() {
        this.playSE(this.audioClips[AudioMap.FLY]);
    },

    judge () {
        if (this.phase == Phases.START) {

        }
    }
});
