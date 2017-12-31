cc.Class({
    extends: cc.Component,
    properties: {
        _missilesNum: 0,
        missilesNum: {
            get: function() {
                return this._missilesNum;
            },
            set: function(val) {
                this._missilesNum = val;
            }
        },
        _planeNum: 0,
        planeNum: {
            get: function() {
                return this._planeNum;
            },
            set: function(val) {
                this._planeNum = val;
            }
        },
        _nextWaveDelay: 60,
        nextWaveDelay: {
            get: function() {
                return this._nextWaveDelay;
            },
            set: function(val) {
                this._missile_nextWaveDelaysNum = val;
            }
        },
    }
});