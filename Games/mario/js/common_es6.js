class SnakeBlock{
	constructor(){
		
	}

	setPoint(x,y){
		this.x=x;
		this.y=y;
	}

	getPoint(){
		return {
			x:this.x,
			y:this.y
		}
	}
}

class SnakeBody{
	constructor(){
		this.snakeLen = 3;
		this.initSnake();
	}

	initSnake(){
		this.snakes=[];
		let snakes_arr = [[8,10],[9,10],[10,10]];//可升级为随机位置
		for (var i = 0; i < this.snakeLen; i++) {
			this.snakes[i]= new HTMLSnakeBlock();
			this.snakes[i].setPoint(snakes_arr[i][0],snakes_arr[i][1]);
		};
	}

	move(direction){
		let head = this.snakes[this.snakes.length - 1];
		let point = head.getPoint(); 
		let newpoint = {};
		let new_snake_block = new HTMLSnakeBlock();
		switch(direction){
			case 'left':
				newpoint.x = point.x-1;
				newpoint.y = point.y;
				break;
			case 'right':
				newpoint.x = point.x+1;
				newpoint.y = point.y;
				break;
			case 'top':
				newpoint.x = point.x;
				newpoint.y = point.y-1;
				break;
			case 'bottom':
				newpoint.x = point.x;
				newpoint.y = point.y+1;
				break;
			default:
				alert('error');
		}

		new_snake_block.setPoint(newpoint.x,newpoint.y);
		return new_snake_block;
	}

	getSnakes(){
		return this.snakes;
	}
}

class Food{
	constructor(func){
		let snakes = func.getSnakes();
		let snakesIndex = [];
		for (var i = 0; i < snakes.length; i++) {
			snakesIndex.push(func.getIndex(snakes[i].getPoint()));
		};
		this.food = Math.floor(Math.random()*(ROW*COL-1));
		while(snakesIndex.indexOf(this.food) >= 0){
			this.food = Math.floor(Math.random()*(ROW*COL-1));
		}
	}

	getFood(){
		return {
			x:this.food%COL,
			y:Math.floor(this.food/COL)
		}
	}
}

class Desktop{
	constructor(){
		this._init();
	}

	getIndex(point){
		return point.y*COL+point.x;
	}
}

class Controller{
	constructor(){
		this.Foods = [];
		this.Desktop = new HTMLDesktop();
		this.creatSnakeBody();
		this.creatFood(3);
	}

	creatFood(num){
		if(typeof(num) == 'undefined') num = 1;
		for (var i = 0; i < num; i++) {
			this.Foods.push(new HTMLFood({
				getSnakes:$.proxy(this.SnakeBody.getSnakes,this.SnakeBody),
				getIndex:$.proxy(this.Desktop.getIndex,this.Desktop)
			}));
		};
	}

	eatFood(food){
		for (var i = 0; i < this.Foods.length; i++) {
			if(food == this.Foods[i].food){
				this.Foods.splice(i,1);
				break;
			}
		};
	}

	creatSnakeBody(){
		this.SnakeBody = new HTMLSnakeBody();
	}
}