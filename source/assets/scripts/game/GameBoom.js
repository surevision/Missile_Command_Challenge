"use strict";

var LIFE = 10;

cc.Class({
    ctor (pos) {
        this.x = pos.x;
        this.y = pos.y;
        this.life = LIFE;
    },
    update () {
		if (this.isDead()) {
			return;
		}
		this.life -= 1;
		this.drawOnNode();
	},
	isDead () {
		return this.life <= 0;
	},
    setDrawNode(drawNode) {
        this.drawNode = drawNode;
	},
	drawOnNode() {
		var center = cc.v2(this.x, this.y);
		var r = LIFE - this.life + 1;
		var color = cc.color(255,255,255,255);
		this.drawNode.getClippingStencil().drawSolidCircle(
			center, 
			r, 
			color
		);
	}
});