var battleTiled = require('battleTiled');

var directiveskill = cc.Class({
    extends: require('skillbase'),

    bindEvent:function(node){
        this.node.on('touchstart',this.beginSkill,this);
        this.node.on('touchmove',this.moveSkill,this);
        this.node.on('touchend',this.useSkill,this);
        this.node.on('touchcancel',this.useSkill,this);
    },
    
    effect:function(loc){
        var target = this.battle.getCreatureOn(loc.x, loc.y);
        if(!target){
            return;
        }
        // 技能效果计算
        var creature = target.getComponent('creature');
        if(creature.camp == this.creature.camp){
            this.battle.floatMessage("你要谋害队友吗？");
            return false;
        }

        var animate = target.getChildByName('creature').getChildByName('animate').getComponent(cc.Animation);
        creature.HP -= this.data.damage;
        creature.runDamageAction();
        cc.loader.loadRes("animate/disappear", function (err, clip) {
            if(err){
                cc.log(err);
                return;
            }
            animate.addClip(clip);
            animate.play(clip.name);
        });
        return true;
    },

    beginSkill:function(event){
        if(this.creature.skillUsed){ // 用过技能了
            this.battle.floatMessage("技能使用过了");
            return;
        }
        
        this.pressed = true;
        return true; 
    },
    
    moveSkill:function(event){
        if(!this.pressed){
            return;
        }
        if(this.popDetail){ // 在长按已经生效
            this.skilling = false;
            this.battle.stopUpdate = false;
            return;
        }
        this.skilling = true; 
        this.battle.stopUpdate = true;
        this.battle.clearFuncLayer();

        var loc = event.getLocation();
        var temp = this.battle.node.convertToNodeSpace(loc);
        loc = battleTiled.toHexagonLoc(temp);
        if(battleTiled.isLocValid(loc)){
            this.battle.funcLayer.setTileGID(4, cc.p(loc.x, battleTiled.MapHeight - 1 - loc.y));
            this.skillTaget = loc;
        }
    },
    
    useSkill:function(event){
        if(!this.skilling){
            return;
        }
        if(!this.pressed){
            return;
        }
        this.pressed = true;
        this.skilling = false;
        this.battle.stopUpdate = false;

        if(!battleTiled.isLocValid(this.skillTaget)){
            return;
        }
        if(this.effect(this.skillTaget)){
            this.creature.setSkillUsed(true);
        }
    }
});

module.exports = directiveskill;