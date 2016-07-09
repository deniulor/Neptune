var SKill = cc.Class({
    init:function(skill,creature){
        this.data = skill;
        this.name = skill.name;
        this.creature = creature;
        this.battle = creature.battle;

        this.node = cc.instantiate(this.battle.skillPrefab);
        let sprite = this.node.getComponent(cc.Sprite);
        var url = cc.url.raw('resources/graphics/skill/' + skill.icon + '.png');
        sprite.spriteFrame = new cc.SpriteFrame(url);
        if(sprite.spriteFrame.retain){
            sprite.spriteFrame.retain();
        }

        this.node.on('touchstart', this.startLongTouch, this);
        this.node.on('touchmove',this.stopLongTouch,this);
        this.node.on('touchend',this.stopLongTouch, this);
        this.node.on('touchcancel',this.stopLongTouch, this);

        this.bindEvent(this.node);
    },

    startLongTouch:function(){
        var self = this;
        this.popDetail = false;
        this.touching = setTimeout(function (){
            self.popDetail = true;
            self.battle.showSkillDetail(self);
        }, 1500);
    },

    stopLongTouch:function(){
        clearTimeout(this.touching);
    },

    bindEvent:function(node){
    },
});

module.exports = SKill;