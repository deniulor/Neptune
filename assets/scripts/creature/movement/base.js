var Move = cc.Class({
    ctor: function () {
        this.name = "move";
    },
    properties:{
    	name:"",
    	creature:{
    		default: null,
			type: require('creature')
    	},
    	battle:{
    		default: null,
			type: require('battle')
    	}
    },
    showMovable:function(){
        var self = this;
        var tiled = self.battle.tiled;
        var area = tiled.getArea(tiled.toHexagonLoc(this.node.getPosition()), this.Mov, function(x,y){
            var c = self.battle.getCreatureOn(x,y);
            c = c===null ? null : c.getComponent('creature');
            return c !== null && c !== self && c.HP > 0;
        });
        
        for(var i = 0; i < area.length; ++i){
            var curnode = area[i];
            tiled = self.battle.funcLayer.setTileGID(4, cc.p(curnode.x, 3 - curnode.y));
        }
    }
});

module.exports = Move;