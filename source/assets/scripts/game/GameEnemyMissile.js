"use strict";

const States = cc.Enum({
    FLY : "FLY",
    BOOM : "BOOM",
    DIVIDE : "DIVIDE"
});

cc.Class({
    statics: {
        States: States
    },
    ctor (pos, cannotDivide) {
        this.x = pos.x;
        this.y = pos.y;
        this.startPos = [pos];
        this.lastPos = pos;
        this.angle = 0;
        this.speed = cc.Vec2.RIGHT.mul(0.5); // 0 度向右
        this.target = cc.Vec2.ZERO;
        this.prepareTargets = [];   // 可选目标
        this.state = States.FLY;
        this.divideDelay = (cannotDivide ? 0 : 1) * 
                            (Math.random() * 5 > 4 ? 0 : 1) * // 分裂几率
                            Math.floor(40 * Math.random() + 140); // 分裂延迟
        this.drawNode = null;
        this.flashNode = null;
    },
    fly() {
        var pos = this.prepareTargets[Math.floor(Math.random() * this.prepareTargets.length)];
        this.target = pos;
        // var vec2 = pos.sub(this.lastPos);
        var vec2 = cc.pSub(pos, this.lastPos);
        this.angle = vec2.signAngle(cc.Vec2.RIGHT);
        this.speed = this.speed.rotate(this.angle);
    },
    update () {
        if (this.state == States.FLY) {
            var newPos = cc.v2(this.x + this.speed.x, this.y + this.speed.y);
            this.x = newPos.x;
            this.y = newPos.y;
            var posArr = this.startPos.concat(newPos);
            for (var i = 0; i < posArr.length; i += 1) {
                var pos = posArr[i];
                if (i == 0) {
                    this.drawNode.moveTo(
                        pos.x + this.drawNode.node.width / 2, 
                        pos.y + this.drawNode.node.height / 2
                    );
                } else {
                    this.drawNode.lineTo(
                        pos.x + this.drawNode.node.width / 2, 
                        pos.y + this.drawNode.node.height / 2
                    );
                }
            }
            this.drawNode.stroke();
            this.lastPos = newPos;
            if (cc.pDistance(this.target, newPos) < 3) {
                this.boom();
            } else {
                this.divideDelay -= 1;
                if (this.divideDelay == 0) {
                    this.state = States.DIVIDE; // 分裂
                }
            }
        }
    },
    boom() {
        this.state = States.BOOM;
    },
    addStartPos(posArr) {
        this.startPos = posArr.concat(this.startPos);
    },
    setPrepareTargets(array) {
        this.prepareTargets = array;
    },
    setDrawNode(drawNode) {
        this.drawNode = drawNode;
    },
    setFlashNode(flashNode) {
        this.flashNode = flashNode;
    }
});
