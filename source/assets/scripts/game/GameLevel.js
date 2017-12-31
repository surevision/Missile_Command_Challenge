var GameWave = require("./GameWave");
cc.Class({
    extends: cc.Component,
    properties: {
        _frameDelayCount: 0,
        frameDelayCount: {
            get: function() {
                return this._frameDelayCount;
            },
            set: function(val) {
                this._frameDelayCount = val;
            }
        }
    },
    getWaves() {
        var children = this.node.children;
        return children;
    },
    getWaveCount() {
        return this.node.children.length;
    },
    getWave(index) {
        cc.log("index", index);
        return this.getWaves()[index].getComponent(GameWave);
    }
});
