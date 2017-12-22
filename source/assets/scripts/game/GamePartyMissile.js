"use strict";

const States = cc.Enum({
    FLY : "FLY",
    BOOM : "BOOM"
});

cc.Class({
    statics: {
        States: States
    },
    ctor () {
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.state = States.FLY;
        this.drawNode = null;
    },
    update () {

    },
    setDrawNode(drawNode) {
        this.drawNode = drawNode;
    }
});
