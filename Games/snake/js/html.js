var HTMLSnakeBlock=function(option){
	this.super.apply(this,arguments);
}
HTMLSnakeBlock.prototype=$.extend(true,{super:SnakeBlock},SnakeBlock.prototype,{
	move:function(point){
		
	},
	eat:function(index){
		
	}

})
SnakeBlock=HTMLSnakeBlock;

var HTMLSnakeBody=function(option){
	this.super.apply(this,arguments);
}
HTMLSnakeBody.prototype=$.extend(true,{super:SnakeBody},SnakeBody.prototype,{
	initSnake:function(){
		this.super.prototype.initSnake.apply(this,arguments);
//		var str="";
//		for(var s=0;s<this.chessmans.length;s++){
//			str += "<div class='chessman "+this.chessmans[s].type+"' style='top:"+(this.chessmans[s].getPoint().y)*SIZE+"px;left:"+(this.chessmans[s].getPoint().x)*SIZE+"px' data-id='"+this.chessmans[s].id+"'>"+this.chessmans[s].value+"</div>";
//		}
//		$(DOM).html(str);
	}
})
SnakeBody=HTMLSnakeBody;

var HTMLDesktop=function(){
	this.super.apply(this,arguments);
}
HTMLDesktop.prototype=$.extend(true,{super:Desktop},Desktop.prototype,{
	init:function(point){
		this.super.prototype.init.apply(this,arguments);
		var str = '';
		for (var i = 0; i <this.row*this.col; i++) {
			str += "<div class='item' style='width:"+SIZE+"px;height:"+SIZE+"px'>"+i+"</div>";
		};
		$(DOM).width(this.row*SIZE).height(this.col*SIZE).html(str);
	}
})
Desktop=HTMLDesktop;

var HTMLController=function(option){
	this.super.apply(this,arguments);
	this.bindEvent();
}
HTMLController.prototype=$.extend(true,{super:Controller},Controller.prototype,{
	bindEvent:function(){
		var _self = this;
		$("#desktop .item").click(function(){
			_self.SnakeBody.snakes[0].setPoint($(this).index());
		});
	},
	movePoint:function(){
		var point = backThis.chessBoard.get($(this).attr('data-id'));
		backThis.click.move(point);
	}
})
Controller=HTMLController;