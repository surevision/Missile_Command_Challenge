 "use strict";

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
        frameCount: 0,
        freezing: false,
        canvas: {
            type: cc.Canvas,
            default: null
        },
        audioClips: [cc.AudioClip]
    },

    // use this for initialization
    onLoad () {
        cc.log(cc.js.getClassName(this));
        Temp.scene = this;
        // 音频
        this.audioPlayed = [];
        // 鼠标
        if (CC_JSB) {
            cc.director.getOpenGLView().setCursorVisible(false);
            this.mouseCursor = null;
            var self = this;
            cc.loader.loadRes("prefabs/Cursor", cc.Prefab, function(err, prefab) {
                var sprite = cc.instantiate(prefab);
                self.canvas.node.parent.addChild(sprite);
                sprite.z = 999;
                self.mouseCursor = sprite;
            });
            this.canvas.node.on(cc.Node.EventType.MOUSE_MOVE, function(evt) {
                var pos = evt.getLocation();//self.canvas.convertToWorldSpace(evt.getLocation());
                if (self.mouseCursor != null) {
                    self.mouseCursor.x = pos.x;
                    self.mouseCursor.y = pos.y;
                }
            }, this);
            this.canvas.node.on(cc.Node.EventType.MOUSE_ENTER, function(evt) {
                var pos = evt.getLocation();//self.canvas.convertToWorldSpace(evt.getLocation());
                if (self.mouseCursor != null) {
                    self.mouseCursor.enabled = true;
                }
            }, this);
            this.canvas.node.on(cc.Node.EventType.MOUSE_LEAVE, function(evt) {
                var pos = evt.getLocation();//self.canvas.convertToWorldSpace(evt.getLocation());
                if (self.mouseCursor != null) {
                    self.mouseCursor.enabled = false;
                }
            }, this);
        }
    },

    onDestroy () {
        for (var i = 0; i < this.audioPlayed; i += 1) {
            var audioId = this.audioPlayed[i];
            if (!!audioId) {
                cc.audioEngine.stop(audioId);
            }
        }
    },

    start () {
        // 全局像素化
        cc.view.enableAntiAlias(false);


        // var sprites = cc.find("Canvas").getComponentsInChildren(cc.Sprite);
        // for(var i = 0;i < sprites.length;i++){
        //     // sprites[i].spriteFrame.getTexture().setAliasTexParameters();
        // }
        // var labels = cc.find("Canvas").getComponentsInChildren(cc.Label);
        // for(var i = 0;i < labels.length;i++){
        //     if (labels[i].font instanceof cc.BitmapFont) {
        //         // cc.log(1);
        //         // labels[i].font.spriteFrame.getTexture().setAliasTexParameters();
        //     } else {
        //         // cc.log(2);
        //         // labels[i]._sgNode._renderCmd._texture.setAntiAliasTexParameters();
        //     }
        // }
    },

    update (dt) {
        this.frameCount += 1;
        this.onUpdate(dt);
    },

    onUpdate (dt) {
        // cc.log(dt);
    },

    isFreeze () {
        return this.freezing;
    },

    freeze () {
        this.freezing = true;
    },

    unFreeze () {
        this.freezing = false;
    },
    playBGM(clip) {
        var audioId = cc.audioEngine.play(clip, true, 1);
        this.audioPlayed.push(audioId);
    },
    playSE(clip) {
        cc.log("playSE", clip);
        var audioId = cc.audioEngine.play(clip, false, 1);
        this.audioPlayed.push(audioId);
    },
});
