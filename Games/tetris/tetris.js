/* 
1、画布
	div,css
2、用随机函数生成方块
	表现方块
	用16宫格记录方块形状->装进数组
3、让方块竖直下落
	显示
	移动
4、keyCode获取键值码对操作反应
	判断碰撞
5、满一层消失一层，
	y方向的值相同有10个，none
6、到顶游戏结束。
	一出现就重叠 
*/
//画布展示
var HTMLdesktop=function(option){
	this.super.apply(this,arguments);
	this.dom=this.option.dom;
	var str = "";
	for(var i=0;i<this.row*this.col;i++){
		str +="<div class='parts' style='width:"+this.option.size+"px;height:"+this.option.size+"px'></div>";
	}
	this.dom.innerHTML = str; 
	$("div").has(this.dom).get(0).style.width=
	this.dom.style.width=this.col*this.option.size;
	$("div").has(this.dom).get(0).style.height=
	this.dom.style.height=this.row*this.option.size;
	this.grade=0;
}
HTMLdesktop.prototype=$.extend(true,{super:Desktop},Desktop.prototype,{
	fill:function(){
		var num=this.super.prototype.fill.apply(this,arguments);
		$(this.dom).children().eq(num).addClass("active");
	},
	clear:function(){
		var num=this.super.prototype.clear.apply(this,arguments);
		$(this.dom).children().eq(num).removeClass("active");
	},
	clearFullLine:function(){
		var result=this.super.prototype.clearFullLine.apply(this,arguments);
		for(var i=0;i<result.length;i++){
			$(this.dom).children().slice(result[i]*this.col,(result[i]+1)*this.col).remove();
			this.grade++;
		}
		var str="";
		for(var i=0;i<this.col;i++){
			str += "<div class='parts' style='width:"+this.option.size+"px;height:"+this.option.size+"px'></div>";
		}
		for(var i=0;i<result.length;i++){
			$(this.dom).prepend(str);
		}
		$("div").has(this.dom).children("#grade").get(0).innerHTML ="得分:"+this.grade*10;
	}
});
Desktop=HTMLdesktop;
//容器展示
var HTMLholder=function(option){
	this.dom=$("<div class='blocks' style='position:absolute'></div>").get(0);
	$(option.container_dom).append(this.dom);
	$(this.dom).css("width",option.size*4).css("height",option.size*4);
	this.size=option.size;
	this.super.apply(this,arguments);
	this.moveBy(0,0);
}


HTMLholder.prototype=$.extend(true,{super:Holder},Holder.prototype,{
	moveBy:function(){
		this.super.prototype.moveBy.apply(this,arguments);
		$(this.dom).css("left",(this.getCoord().x)*this.size+"px").css("top",(this.getCoord().y)*this.size+"px");
	},
	getCoreCopy:function(){
		var constructer=function(){}
			constructer.prototype=HTMLholder.prototype
		var hold=new constructer();
		hold.x=this.x;
		hold.y=this.y;
		hold.shapeIndex=this.shapeIndex;
		hold.rotateIndex=this.rotateIndex;
		hold.length=this.length;
		hold.blocks=[];
		for(var i=0;i < this.length;i++){
			hold.blocks.push(this.get(i).getCoreCopy(hold));
		}
		return hold;
	},
	destruct:function(){
		for(var i=0;i < this.length;i++){
			this.get(i).destruct();
		}
		$(this.dom).remove();
	},
	changeContainerDom:function(dom){
		$(dom).append(this.dom);
	}
});
Holder=HTMLholder;

var HTMLblock=function(option){
	this.dom=$("<div class='block'></div>").get(0);
	this.size=option.parent.size;
	this.super.apply(this,arguments);
	$(this.parent.dom).append(this.dom);
	$(this.dom).css({"width":this.size,"height":this.size,"position":"absolute"});
}
HTMLblock.prototype=$.extend({super:Block},Block.prototype,{
	setIndex:function(index){
		this.super.prototype.setIndex.apply(this,arguments);
		$(this.dom).css({"left":this.index%4*this.size,"top":Math.floor(this.index/4)*this.size});
	},
	getCoreCopy:function(parent){
		var constructer=function(){}
			constructer.prototype=HTMLblock.prototype
		var block=new constructer();
		block.parent=parent;
		block.setIndex(this.index);
		return block;
	},
	destruct:function(){
		$(this.dom).remove();
	}
	
});
Block=HTMLblock;

var HTMLcontroller=function(option){
	this.is_gameover=false;
	this.super.apply(this,arguments);
	this.bindEvent();
	this.interval=500;
	this.startTimer();
	this.key=option.key;
}
HTMLcontroller.prototype=$.extend({super:Controller},Controller.prototype,{
	bindEvent:function(){
		$(document).on("keydown.tetris",$.proxy(function(event){
			switch(event.keyCode){
				case 87:
				case 38:
					//this.processUp();
					this.stopTimer();
					break;
				case 65:
				case 37:
					this.processLeft();
					break;
				case 68:
				case 39:
					this.processRight();
					break;
				case 83:
				case 40:
					this.stopTimer();
					this.processDown();
					this.startTimer();
					break;
				case 17:
					this.processRorate();
				default:
                                        console.log(event.keyCode);
					return true;
			}
			return false;
		},this));
	},
	unbindEvent:function(){
		$(document).off("keydown.tetris");
	},
	processUp:function(){
		console.log("↑");
		var temp_holder=this.holder.getCoreCopy()
			temp_holder.moveBy(0,-1);
		var is_overlap=	this.desktop.isOverlap(temp_holder);
		var is_outside= this.desktop.isOutSide(temp_holder);
		if(!is_overlap && !is_outside){
			this.holder.moveBy(0,-1);
		}		
	},
	processLeft:function(){
		console.log("←");
		var temp_holder=this.holder.getCoreCopy()
			temp_holder.moveBy(-1,0);
		var is_overlap=	this.desktop.isOverlap(temp_holder);
		var is_outside= this.desktop.isOutSide(temp_holder);
		if(!is_overlap && !is_outside){
			this.holder.moveBy(-1,0);
		}	
	},
	processRight:function(){
		console.log("→");
		var temp_holder=this.holder.getCoreCopy()
			temp_holder.moveBy(1,0);
		var is_overlap=	this.desktop.isOverlap(temp_holder);
		var is_outside= this.desktop.isOutSide(temp_holder);
		if(!is_overlap && !is_outside){
			this.holder.moveBy(1,0);
		}	
	},
	processDown:function(){
		console.log("↓");
		var temp_holder=this.holder.getCoreCopy()
			temp_holder.moveBy(0,1);
		var is_overlap=	this.desktop.isOverlap(temp_holder);
		var is_outside= this.desktop.isOutSide(temp_holder);
		
		if(!is_overlap && !is_outside){
			this.holder.moveBy(0,1);
		}
		else{
			return this.putHoloderToDesktop();
		}
	},
	processRorate:function(){
		console.log("zhuan");
		var temp_holder=this.holder.getCoreCopy()
			temp_holder.rotate();
		var is_overlap=	this.desktop.isOverlap(temp_holder);
		var is_outside= this.desktop.isOutSide(temp_holder);
		if(!is_overlap && !is_outside){
			this.holder.rotate();
		}
		else if(!is_overlap){
			var factor_x=0,factor_y=0; 
			if(is_outside & 0x1){
				if(temp_holder.getCoord().x<0){
					factor_x=1;
				}
				else{
					factor_x=-1;
				}	
			}
			/* if(is_outside & 0x10){
				if(temp_holder.getCoord().y<0){
					factor_y=1;
				}
				else{
					factor_y=-1;
				}	
			} *///todo: factor_y
			
			
			
			temp_holder.moveBy(1*factor_x,0);
			if(!this.desktop.isOutSide(temp_holder) && !this.desktop.isOverlap(temp_holder)){
				this.holder.moveBy(1*factor_x,0);
				this.holder.rotate();
			}
			else{
				temp_holder.moveBy(1*factor_x,0);
				if(!this.desktop.isOutSide(temp_holder) && !this.desktop.isOverlap(temp_holder)){
					this.holder.moveBy(2*factor_x,0);
					this.holder.rotate();
				}						
			}
		}
	},
	putHoloderToDesktop:function(){
		for(var i=0;i<this.holder.length;i++){
			var pos=this.holder.get(i).getCoord();
			this.desktop.fill(pos.x,pos.y);
		}		
		this.desktop.clearFullLine();
		this.holder.destruct();
		this.holder=null;
		this.makeHolder();
		if(this.desktop.isOverlap(this.holder)){
			return this.gameover();
		}
		
	},
	timer:function(){
		if(this.is_gameover)return;
		this.processDown();
		this.startTimer();
	},
	startTimer:function(){
		this.timeout=window.setTimeout($.proxy(this.timer,this),this.interval);
	},
	stopTimer:function(){
		window.clearTimeout(this.timeout);
	},
    makeHolder:function(){
		this.super.prototype.makeHolder.apply(this,arguments);
		this.holder.changeContainerDom(this.desktop.dom);
	},
	gameover:function(){
		this.unbindEvent();
		this.is_gameover=true;
		this.stopTimer();
		alert("gameover");
	}
});
Controller=HTMLcontroller;







