// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var Temp = require("../common/Temp");

cc.Class({
    extends: cc.Component,

    properties: {
    },

    // use this for initialization
    onLoad () {
        cc.log(cc.js.getClassName(this));
        Temp.scene = this;
    },

    start () {
        // 全局像素化
        var sprites = cc.find("Canvas").getComponentsInChildren(cc.Sprite);
        for(var i = 0;i < sprites.length;i++){
            sprites[i].spriteFrame.getTexture().setAliasTexParameters();
        }
        var labels = cc.find("Canvas").getComponentsInChildren(cc.Label);
        for(var i = 0;i < labels.length;i++){
            cc.log(labels[i]);
            if (labels[i].font instanceof cc.BitmapFont) {
                // cc.log(1);
                labels[i].font.spriteFrame.getTexture().setAliasTexParameters();
            } else {
                // cc.log(2);
                // labels[i]._sgNode._renderCmd._texture.setAntiAliasTexParameters();
            }
        }
    }
});
