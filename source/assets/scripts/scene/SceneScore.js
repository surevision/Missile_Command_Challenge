"use strict";
var sprintf = require("../common/Formatter");
var SceneBase = require("./SceneBase");

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
        
        // 以下为测试数据
        var scores = [
            {
                name: [
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26)
                ].reduce((r,a)=>{return r + String.fromCharCode(a);}, ""),
                score: Math.floor(Math.random() * 999)
            },
            {
                name: [
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26)
                ].reduce((r,a)=>{return r + String.fromCharCode(a);}, ""),
                score: Math.floor(Math.random() * 999)
            },
            {
                name: [
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26)
                ].reduce((r,a)=>{return r + String.fromCharCode(a);}, ""),
                score: Math.floor(Math.random() * 999)
            },
            {
                name: [
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26)
                ].reduce((r,a)=>{return r + String.fromCharCode(a);}, ""),
                score: Math.floor(Math.random() * 999)
            },
            {
                name: [
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26),
                    65 + Math.floor(Math.random() * 26)
                ].reduce((r,a)=>{return r + String.fromCharCode(a);}, ""),
                score: Math.floor(Math.random() * 999)
            },
        ];
        this.currScore = 999
        this.currRank = 1
        scores[this.currRank - 1].name = "AA\tAA";

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
    },

    start () {
        this._super();
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
