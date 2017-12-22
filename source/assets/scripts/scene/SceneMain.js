"use strict";

var SceneBase = require("./SceneBase");

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
        this.phase = Phases.START;

        this.currWave = 0;  // 波数
        this.currScore = 0; // 当前分数
        this.highScore = 0; // 最高分

        this.cmds = []; // 用户指令

        this.refreshUI();
    },

    onUpdate (dt) {
        this._super(dt);
        // 处理用户操作
        this.dealCmds();
        // 更新物品逻辑
        for (var partyMissiles in this.partyMissiles) {
            for (var missile in this.partyMissiles[partyMissiles]) {
                missile.update();
            }
        }
        for (var enemyMissile in this.enemyMissiles) {
            enemyMissile.update();
        }
        for (var plane in this.enemyPlanes) {
            plane.update();
        }
        // 判定游戏进度
        this.judge();
        this.refreshUI();
    },

    initGraphics () {
        // 闪烁背景
        this.flashNode.clear();
        this.flashNode.rect(0, 0, this.flashNode.node.width, this.flashNode.node.height);
        this.flashNode.fill();
        this.flashNode.node.runAction(cc.repeatForever(cc.blink(0.1, 1))); // flash!

        this.maskNode.type = 0;  // 触发refreshStencil
        var maskDrawNode = this.maskNode.getClippingStencil();
        maskDrawNode.clear();

        var num = Math.floor(Math.random() * 5);
        var node = this.maskNode.node;
        for (var i = 0; i < num; i += 1) {
            this.booms[i] = cc.v2(
                Math.random() * node.width - node.width / 2,
                Math.random() * node.height - node.height / 2
            );
        }
    },

    refreshUI () {
        this.labelWave.string = cc.js.formatStr("Wave: %d", this.currWave);
        this.labelScore.string = cc.js.formatStr("Score: %d", this.currWave);
        this.labelHighScore.string = cc.js.formatStr("Highest : %d", this.currWave);

        
        var maskDrawNode = this.maskNode.getClippingStencil();
        maskDrawNode.clear();
        for (var i = 0; i < this.booms.length; i += 1) {
            var center = this.booms[i];//cc.v2(0, 0)
            cc.log(this.frameCount);
            var radius = this.frameCount % (this.maskNode.node.height / 4);
            var angle = 360;
            var segments = 360;
            var drawLineToCenter = false;
            var lineWidth = 1;
            var color = cc.color(255,255,255,255);
            maskDrawNode.drawSolidCircle(center, radius, color);
        }
    },

    dealCmds () {

    },

    judge () {

    }
});
