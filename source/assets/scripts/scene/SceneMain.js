"use strict";

var SceneBase = require("./SceneBase");

var GamePartyMissile = require("../game/GamePartyMissile");
var GameBoom = require("../game/GameBoom");

var Phases = cc.Enum({
    IDLE: "IDLE",
    START: "START",
    PAUSE: "PAUSE",
    COMPLETE: "COMPLETE",
    GAMEOVER: "GAMEOVER"
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
        }
        
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
        this.phase = Phases.START;

        this.currWave = 0;  // 波数
        this.currScore = 0; // 当前分数
        this.highScore = 0; // 最高分

        this.cmds = []; // 用户指令

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
        // 更新物品逻辑
        var isDraw = false;
        // 玩家导弹
        for (var partyMissiles in this.partyMissiles) {
            for (var i = 0; i < this.partyMissiles[partyMissiles].length; i += 1) {
                var missile = this.partyMissiles[partyMissiles][i];
                if (missile != null) {
                    missile.update();
                    if (missile.state == GamePartyMissile.States.BOOM) {
                        var boomPos = cc.v2(missile.x, missile.y);
                        this.addBoom(boomPos);
                        delete this.partyMissiles[partyMissiles][i];
                        this.partyMissiles[partyMissiles][i] = null;
                    }
                }
            }
        }
        // 敌人导弹
        for (var i = 0; i < this.enemyMissiles.length; i += 1) {
            var enemyMissile = this.enemyMissiles[i];
            enemyMissile.update();
        }
        // 敌人飞行器
        for (var i = 0; i < this.enemyPlanes.length; i += 1) {
            var plane = this.enemyPlanes[i];
            plane.update();
        }
        // 爆炸范围
        if (this.frameCount % 4 == 0) { // 帧延迟
            for (var i = 0; i < this.booms.length; i += 1) {
                var boom = this.booms[i];
                if (boom != null) {
                    boom.update();
                    if (boom.isDead()) {
                        delete this.booms[i];
                        this.booms[i] = null;
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
            this.canvas.node.on(cc.Node.EventType.MOUSE_DOWN, function(evt) {
                this.cmds[this.cmds.length] = evt;
            }, this);
        } else {
            this.canvas.node.on(cc.Node.EventType.TOUCH_START, function(evt) {
                this.cmds[this.cmds.length] = evt;
            }, this);
        }
    },

    refreshUI () {
        this.labelWave.string = cc.js.formatStr("Wave: %d", this.currWave);
        this.labelScore.string = cc.js.formatStr("Score: %d", this.currWave);
        this.labelHighScore.string = cc.js.formatStr("Highest : %d", this.currWave);
        var maskDrawNode = this.maskNode.getClippingStencil();
        maskDrawNode.clear();
        this.drawNode.clear();
    },

    dealCmds () {
        for (var i = 0; i < this.cmds.length; i += 1) {
            var evt = this.cmds[i];
            this.launch(evt.getLocation());
            // this.addBoom(evt.getLocation());
        }
        this.cmds = [];
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
     * 发射导弹
     * @param {*位置} pos 
     */
    launch(pos) {
        var i = 0;
        for (i = 0; i < this.partyMissiles.left.length; i += 1) {
            if (this.partyMissiles.left[i] == null) {
                break;
            }
        }
        var loc = this.drawNode.node.convertToNodeSpaceAR(pos);
        var x = loc.x;
        var width = this.drawNode.node.width;
        var index = Math.floor((x + width / 2) / (width / 3));
        var startPos = [
            -1,
            0,
            1
        ];
        var _x = startPos[index] * this.drawNode.node.width / 2;
        var _y = -this.drawNode.node.height / 2;
        var _pos = cc.v2(_x, _y);//this.drawNode.node.convertToNodeSpaceAR(cc.v2(_x, _y));
        var missile = new GamePartyMissile(
            _pos
        );
        missile.setDrawNode(this.drawNode);
        missile.flyTo(loc);
        this.partyMissiles.left[i] = missile;
    },

    judge () {

    }
});
