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
	r() {
		return LIFE - this.life + 1;
	},
	drawOnNode() {
		var center = cc.v2(this.x, this.y);
		var r = this.r();
		var color = cc.color(255,255,255,255);
		this.drawNode.getClippingStencil().drawSolidCircle(
			center, 
			r, 
			color
		);
	}
});