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
        },
        levels: [cc.Node],
        _currLevel: 0,
        currLevel: {
            get: function() {
                return this._currLevel;
            },
            set: function(val) {
                this._currLevel = val;
            }
        },
    },
    getWaves() {
        var children = this.levels[this.currLevel].children;
        return children;
    },
    getWaveCount() {
        return this.levels[this.currLevel].children.length;
    },
    getWave(index) {
        if (index >= this.getWaveCount()) {
            return null;
        }
        return this.getWaves()[index].getComponent(GameWave);
    },
    hasNextLevel() {
        
        return this.currLevel < 1;
        return this.currLevel < this.levels.length;
    }
});
