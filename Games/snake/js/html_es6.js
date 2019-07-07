class HTMLSnakeBlock extends SnakeBlock{
	constructor(color){
		super();
		this.color = color?color:'#EBD3E8';
		this.createHtml();
	}

	createHtml(){
		this.$view = $("<div class='block' style='width:"+SIZE+"px;height:"+SIZE+"px;background:"+this.color+";'></div>");
	}

	setPoint(x,y){
		super.setPoint(x,y);
		this.$view.css({ top:this.y*SIZE,left:this.x*SIZE });
	}
}

class HTMLSnakeBody extends SnakeBody{
	constructor(arr){
		super(arr);
		this.createHtml();
		this.initSnake(arr);
	}

	createBlock(x,y,color){
		let block = super.createBlock(x,y,color);
		this.$view.append(block.$view);
		return block;
	}

	createHtml(){
		this.$view = $("<div class='snake'></div>");
	}

	destroy(){
		this.$view.remove();
	}
}

class HTMLFood extends Food{
	constructor(func){
		super(func);
		this.createHtml();
		this.setPoint();
	}

	createHtml(){
		this.$view = $("<div class='food' style='width:"+SIZE+"px;height:"+SIZE+"px;'></div>");
	}

	setPoint(){
		let point = this.getPoint();
		this.$view.css({ top:point.y*SIZE,left:point.x*SIZE });
	}
}

class HTMLDesktop extends Desktop{
	constructor(){
		super();
	}

	initiation(){
		// var str = '';
		// for (let i = 0; i <ROW*COL; i++) {
		// 	str += "<div class='item' style='width:"+SIZE+"px;height:"+SIZE+"px'></div>";
		// };
		$(DOM).width(COL*SIZE).height(ROW*SIZE)//.html(str);
	}
}

class HTMLPayer extends Payer{
	constructor(params,delegat){
		super(params);
		this.direction = params.direction;
		this.delegat = delegat;
		if(params.operate != null){
			this.bindEvent(params.operate);
		}
	}

	creatSnakeBody(arr){
		super.creatSnakeBody(arr);
		$(DOM).append(this.SnakeBody.$view);
	}

	bindEvent(operate){
		$(document).keydown($.proxy(function(event){
			switch(event.keyCode){
				case operate[0]:
					this.sendDirection('top');
					break;
				case operate[1]:
					this.sendDirection('bottom');
					break;
				case operate[2]:
					this.sendDirection('left');
					break;
				case operate[3]:
					this.sendDirection('right');
					break;
				default:
			}
		},this));
	}
}

class HTMLController extends Controller{
	constructor(){
		super();
		this.timer;
		this.state = true;
		this.speed = 500;
		// this.startGame();
	}

	createFood(num){
		super.createFood(num);
		for (var i = 0; i < this.Foods.length; i++) {
			$(DOM).append(this.Foods[i].$view);
		}
	}

	eatFood(food){
		super.eatFood(food);
		food.$view.remove();
	}

	startGame(){
		if(!this.state) return false;
		if(this.timer){
			this.stopGame();
		}
		this.timer = window.setInterval($.proxy(function(){
			this.runSnake();
		},this),this.speed);
	}

	stopGame(){
		window.clearInterval(this.timer);
	}
}