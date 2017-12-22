var SceneBase = require("./SceneBase");

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
        // 敌人导弹
        this.enemyMissiles = [];
        // 敌人飞行器
        this.enemyPlanes = [];
    },

    start () {
        this.currWave = 0;  // 波数
        this.currScore = 0; // 当前分数
        this.highScore = 0; // 最高分

        this.cmds = []; // 用户指令

        this.refreshUI();
    },

    update (dt) {
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
    },

    refreshUI () {
        this.labelWave.string = cc.js.formatStr("Wave: %d", this.currWave);
        this.labelScore.string = cc.js.formatStr("Score: %d", this.currWave);
        this.labelHighScore.string = cc.js.formatStr("Highest : %d", this.currWave);
    },

    dealCmds () {

    },

    judge () {

    }
});
