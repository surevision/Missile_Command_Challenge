"use strict";

const States = cc.Enum({
    FLY : "FLY",
    BOOM : "BOOM"
});

cc.Class({
    statics: {
        States: States
    },
    ctor (pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.lastPos = pos;
        this.angle = 0;
        this.speed = cc.Vec2.RIGHT; // 0 度向右
        this.target = cc.Vec2.ZERO;
        this.state = States.FLY;
        this.drawNode = null;
    },
    flyTo(pos) {
        this.target = pos;
        var vec2 = cc.v2(pos.x, pos.y);
        this.angle = vec2.signAngle(cc.Vec2.RIGHT);
        this.speed = this.speed.rotate(this.angle);
    },
    update () {
        if (this.state == States.FLY) {
            // this.drawNode.getClippingStencil().drawDot(cc.v2(this.x, this.y), 1, cc.color(255,255,255,255));
            
            var newPos = cc.v2(this.x + this.speed.x, this.y + this.speed.y);
            this.x = newPos.x;
            this.y = newPos.y;
            this.drawNode.moveTo(
                this.lastPos.x + this.drawNode.node.width / 2, 
                this.lastPos.y + this.drawNode.node.height / 2
            );
            this.drawNode.lineTo(
                newPos.x + this.drawNode.node.width / 2,
                newPos.y + this.drawNode.node.height / 2
            );
            this.drawNode.stroke();
            // cc.log(this.lastPos.x, this.lastPos.y, newPos.x, newPos.y);
            this.lastPos = newPos;
            if (cc.pDistance(this.target, newPos) < 3) {
                this.state = States.BOOM;
            }
        }
    },
    setDrawNode(drawNode) {
        this.drawNode = drawNode;
    }
});
