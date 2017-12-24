"use strict";
(function() {
    // 扩展cc.Mask
    var cc_Mask = cc.Mask;
    /**
     * 取内部drawNode
     */
    cc_Mask.prototype.getClippingStencil = function() {
        return this._clippingStencil;
    };
    
    // 扩展cc.DrawNode
    var cc_DrawNode = cc.DrawNode;
    /**
     * 绘制实心圆
     * @param {*圆心} center 
     * @param {*半径} r 
     * @param {*颜色} color 
     */
    cc_DrawNode.prototype.drawSolidCircle = function(center, r, color) {
        // 利用cc.Mask类型为ellipse的算法
        var radius = {
            x: r,
            y: r
        };
        var segements = 64;
        var polies =[];
        var anglePerStep = Math.PI * 2 / segements;
        for(var step = 0; step < segements; ++ step) {
            polies.push(cc.v2(radius.x * Math.cos(anglePerStep * step) + center.x,
                radius.y * Math.sin(anglePerStep * step) + center.y));
        }
        this.drawPoly(polies, color, 0, color);
    };
})();