var SceneBase = require("./SceneBase");

cc.Class({
    extends: SceneBase,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        labelStart: {
            type: cc.Label,
            default: null
        },

        labelExit: {
            type: cc.Label,
            default: null
        },

        spriteSelect: {
            type: cc.Sprite,
            default: null
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._super();
        var self = this;
        cc.log(this.labelStart.font);
        this.labelStart.font.color = (cc.color(255,0,0,255));
        this.labelStart.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            self.onClickStart();
        }, this);
        this.labelExit.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            self.onClickExit();
        }, this);
    },

    start () {
        this._super();
    },

    onClickStart () {
        if (this.isFreeze()) {
            return;
        }
        var self = this;
        this.freeze();
        this.labelStart.node.runAction(cc.sequence(
            cc.scaleTo(0.1, 1.2, 1.2),
            cc.callFunc(function() {
                self.gotoMainScene();
            })
        ));
    },

    onClickExit () {
        if (this.isFreeze()) {
            return;
        }
        var self = this;
        this.freeze();
        this.labelExit.node.runAction(cc.sequence(
            cc.scaleTo(0.1, 1.2, 1.2),
            cc.callFunc(function() {
                self.gotoExit();
            })
        ));
    },

    gotoMainScene () {
        cc.log("goto main scene");
    },

    gotoExit () {
        cc.director.end();
    }

    // update (dt) {},
});
