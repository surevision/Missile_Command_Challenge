"use strict";

var Common = require("../common/Common");
var Temp = require("../common/Temp");
var sprintf = require("../common/Formatter");

var SceneBase = require("./SceneBase");

var BlinkTime = 0.25;

cc.Class({
    extends: SceneBase,

    properties: {
        /**
         * 排行标签
         */
        rankLabels: [cc.Label],
        /**
         * 排行分数标签
         */
        rankScoreLabels: [cc.Label],
        /**
         * 排行序号标签
         */
        rankNumLabels: [cc.Label],
        /**
         * 自己名字标签
         */
        selfNameLabels: [cc.Label],
        /**
         * 自己积分标签
         */
        selfScoreLabel: cc.Label
    },

    onLoad () {
        this._super();
        
        // 正式数据
        var scores = Temp.ranks; 
        this.currScore = Temp.currScore;
        this.currRank = scores.length;
        for (var i = 0; i < scores.length; i += 1) {
            if (scores[i].score <= this.currScore) {
                this.currRank = i;
                break;
            }
        }
        cc.log(this.currRank);
        Temp.ranks.splice(this.currRank, 0, {
            name: "AAAA",
            score: this.currScore
        });


        // 初始化排名
        for (var i = 0; i < this.rankNumLabels.length; i += 1) {
            this.rankNumLabels[i].string = sprintf("{0}", i + 1);
            if (scores[i]) {
                this.rankLabels[i].string = sprintf("{0}", scores[i].name);
                this.rankScoreLabels[i].string = sprintf("{0:000}", scores[i].score);
            } else {
                this.rankLabels[i].string = sprintf("{0}", "----");
                this.rankScoreLabels[i].string = sprintf("{0:000}", 0);
            }
        }
        this.selfScoreLabel.string = sprintf("{0:000}", this.currScore);
        this.nameCharLabelIndex = 0;    // 闪烁的标签序号
        this.nameCharIndex = 0; // 编辑中的字母序号
        this.nameChar = 0; // 编辑中的字母 65 + nameChar
        this.nameCharArr = ["A","A","A","A"];

        // 点击事件绑定
        if (CC_JSB) {
            this.canvas.node.on(cc.Node.EventType.MOUSE_DOWN, this.onTouch, this);
        } else {
            this.canvas.node.on(cc.Node.EventType.TOUCH_START, this.onTouch, this);
        }
    },

    start () {
        this._super();
    },

    /**
     * 改变当前显示的字母
     */
    chgChar() {
        this.nameChar += 1;
        this.nameChar = this.nameChar % 26;
        this.nameCharArr[this.nameCharLabelIndex] = String.fromCharCode(65 + this.nameChar);
        this.selfNameLabels[this.nameCharLabelIndex].string = this.nameCharArr[this.nameCharLabelIndex];
        if (this.rankLabels[this.currRank]) {
            this.rankLabels[this.currRank].string = sprintf("{0}", this.nameCharArr.join(''));
        }
    },

    moveToNextChar() {
        this.nameCharLabelIndex += 1;
        if (this.nameCharLabelIndex >= this.selfNameLabels.length) {
            this.freeze();
            this.canvas.node.stopAllActions();
            for(var i = 0; i < this.selfNameLabels.length; i += 1) {
                this.selfNameLabels[i].node.stopAllActions();
            }
            if (this.rankLabels[this.currRank]) {
                this.rankLabels[this.currRank].node.stopAllActions();
            }
            this.canvas.node.runAction(cc.sequence(
                cc.delayTime(3),
                cc.callFunc(function() {
                    Temp.ranks[this.currRank].name = sprintf("{0}", this.nameCharArr.join(''));
                    Common.saveRank(Temp.ranks);
                    this.gotoTitleScene();
                }, this)
            ));
            return;
        }
        this.nameChar = 0;  
    },

    updateBlink() {
        if (this.isFreeze()) {
            if (this.rankLabels[this.currRank]) {
                this.rankLabels[this.currRank].node.opacity = 255;
            }
            for (var i = 0; i < this.selfNameLabels.length; i += 1) {
                this.selfNameLabels[i].node.opacity = 255;
            }
            return;
        }
        var opacity = 255;
        if (this.frameCount % 15 < 7) {
            opacity = 0;
        }
        if (this.rankLabels[this.currRank]) {
            this.rankLabels[this.currRank].node.opacity = opacity;
        }
        for (var i = 0; i < this.selfNameLabels.length; i += 1) {
            this.selfNameLabels[i].node.opacity = 255;
        }
        this.selfNameLabels[this.nameCharLabelIndex].node.opacity = opacity;
    },

    onTouch(evt) {
        if (this.isFreeze()) {
            return;
        }
        this.chgChar();
        // 取消上次转换光标
        this.canvas.node.stopAllActions();
        // 延迟转换光标
        this.canvas.node.runAction(cc.repeatForever(cc.sequence(
            cc.delayTime(2),
            cc.callFunc(this.moveToNextChar, this)
        )));
    },

    onUpdate(dt) {
        this.updateBlink();
    },

    gotoTitleScene() {
        cc.log("goto title scene");
        cc.director.loadScene("title")
    },

    gotoExit () {
        cc.director.end();
    }

    // update (dt) {},
});
