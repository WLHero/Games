class HTMLSnakeBlock extends SnakeBlock{
	constructor(){
		super();
	}

}

class HTMLSnakeBody extends SnakeBody{
	constructor(){
		super();
	}

	initSnake(){
		super.initSnake();
	}

	checkSnakeLen(){
		let color_arr = {
			20:'#7E3D76',
			15:'#9F4D95',
			10:'#B766AD',
			5:'#D2A2CC',
			1:'#EBD3E8'
		};
		for(let k in color_arr){
			if(this.snakes.length >= k){
				$(DOM).find('.item:not(.food)').css('background','none');
				$(DOM).find('.item.active').css('background',color_arr[k]);
			}
		}
	}

	destroy(){
		$(DOM).find('.item.active').removeClass('active').css('background','none');
	}
}

class HTMLFood extends Food{
	constructor(func){
		super(func);
		$(DOM).find('.item').eq(this.food).addClass('food');
	}
}

class HTMLDesktop extends Desktop{
	constructor(){
		super();
	}

	_init(){
		var str = '';
		for (let i = 0; i <ROW*COL; i++) {
			str += "<div class='item' style='width:"+SIZE+"px;height:"+SIZE+"px'></div>";
		};
		$(DOM).width(COL*SIZE).height(ROW*SIZE).html(str);
	}
}

class HTMLController extends Controller{
	constructor(){
		super();
		this.direction = 'right';
		this.timer;
		this.state = true;
		this.speed = 500;
		this.startGame();
		this.bindEvent();
	}

	bindEvent(){
		$(document).keydown($.proxy(function(event){
			this.startGame();
			switch(event.keyCode){
				case 38:
					this.changeDirection('top');
					break;
				case 40:
					this.changeDirection('bottom');
					break;
				case 37:
					this.changeDirection('left');
					break;
				case 39:
					this.changeDirection('right');
					break;
				default:
					console.log(event.keyCode);
			}
	　　},this));
	}

	creatSnakeBody(){
		super.creatSnakeBody();
		this.render();
	}

	render(){
		$(DOM).find('.active').removeClass('active');
		for (var i = 0; i < this.SnakeBody.snakes.length; i++) {
			let index = this.Desktop.getIndex(this.SnakeBody.snakes[i].getPoint());
			$(DOM).find('.item').eq(index).addClass('active');
		};
		this.SnakeBody.checkSnakeLen();
	}

	changeDirection(direction){
		let row_arr = ['left','right'];
		let col_arr = ['top','bottom'];
		if(((row_arr.indexOf(direction) >= 0 && row_arr.indexOf(this.direction) >= 0) || 
			(col_arr.indexOf(direction) >= 0 && col_arr.indexOf(this.direction) >= 0)) && direction != this.direction)
		{
			return false;
		}
		this.direction = direction;
		this.runSnake();
	}

	eatFood(food){
		super.eatFood(food);
		$(DOM).find('.item').eq(food).removeClass('food');
		super.creatFood();
	}

	runSnake(){
		if(!this.state) return false;
		let max_border = [COL-1,ROW-1];
		let new_snake_block = this.SnakeBody.move(this.direction);
		let newpoint = new_snake_block.getPoint();
		let remark = false;
		for (var i = 0; i < this.SnakeBody.snakes.length; i++) {
			let point = this.SnakeBody.snakes[i].getPoint();
			if(point.x == newpoint.x && point.y == newpoint.y){
				remark = true;
			}
		};
		if(newpoint.x < 0 || newpoint.x > max_border[0] || newpoint.y < 0 || newpoint.y > max_border[1] || remark)
		{
			this.SnakeBody.destroy();
			this.creatSnakeBody();
			this.startGame();
		}else{
			this.SnakeBody.snakes.push(new_snake_block);
			let eatState = false;
			for (var i = 0; i < this.Foods.length; i++) {
				let foodpoint = this.Foods[i].getFood();
				if(newpoint.x == foodpoint.x && newpoint.y == foodpoint.y){
					this.eatFood(this.Foods[i].food);
					eatState = true;
				}
			};
			if(!eatState){
				this.SnakeBody.snakes.shift();
			}
			this.render();
		}
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