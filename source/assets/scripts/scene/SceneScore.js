"use strict";

var SceneBase = require("./SceneBase");

cc.Class({
    extends: SceneBase,

    properties: {
        /**
         * 排行标签
         */
        rankLabels: [cc.Label],
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
