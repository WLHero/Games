/*画布类
	div,坐标方格,大小可自定义,

蛇身类
	div,长短可变

食物类
	随机出现

控制类
	移动判定,吃食判定,初始化
*/

// 棋子类
function SnakeBlock(option){
	this.dispatch = option.desktop;
	//this.setPoint(this.id);
}
SnakeBlock.prototype={
	setPoint:function(index){
		var size = this.dispatch.getSize();
		this.x=index%size.col;
		this.y=Math.floor(index/size.col);
		console.log(this);
	},
	getPoint:function(){
		return {
			x:this.x,
			y:this.y
		}
	}
}

function SnakeBody(option){
	this.length = 3;
	this.dispatch = option.desktop;
	this.initSnake();
}
SnakeBody.prototype={
	initSnake:function(){
		this.snakes=[];
		for (var i = 0; i < this.length; i++) {
			this.snakes[i]= new SnakeBlock({desktop:this.dispatch});
		};
	}
}

function Desktop(){
	this.row = 30;
	this.col = 20;
	this.api = {
		getSize:$.proxy(function(){
			return {
				row:this.row,
				col:this.col
			}
		},this)
	};
	this.init();
}
Desktop.prototype={
	init:function(){
		
	}
}

function Controller(option){
	this.desktop = new Desktop();
	this.SnakeBody = new SnakeBody({desktop:this.desktop.api});
}
Controller.prototype={

}





