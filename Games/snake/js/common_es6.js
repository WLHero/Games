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
	constructor(arr){
		this.snakes=[];
	}

	initSnake(arr){
		let snakes_arr = arr;//可升级为随机位置
		let head = snakes_arr[0], foot = snakes_arr[snakes_arr.length - 1];
		this.head = this.createBlock(head[0],head[1],'green');
		for (var i = 1; i < snakes_arr.length - 1; i++) {
			this.createBlock(snakes_arr[i][0],snakes_arr[i][1]);
		};
		this.foot = this.createBlock(foot[0],foot[1]);
	}

	createBlock(x,y,color){
		let block = new HTMLSnakeBlock(color);
		block.setPoint(x,y);
		this.snakes.push(block);
		return block;
	}

	getSnakes(){
		return this.snakes;
	}

}

class Food{
	constructor(func){
		this.food = Math.floor(Math.random()*(ROW*COL-1));
		// this.sendFood();
	}

	sendFood(){
		let data = JSON.stringify({
			act:'food',
			food:this.food
		});
		$.ajax("http://msg.lc568.com:2121/?type=publish&to=&content="+data);
	}

	getPoint(){
		return {
			x:this.food%COL,
			y:Math.floor(this.food/COL)
		}
	}
}

class Desktop{
	constructor(){
		this.initiation();
	}

	getIndex(point){
		return point.y*COL+point.x;
	}
}

class Payer{
	constructor(params,delegat){
		this.name = params.name;
		this.area = params.area;

		this.initSocket();
		this.creatSnakeBody(this.area);
	}

	initSocket(){
		// 连接服务端
        var uid = this.name;
        // 连接后登录
        socket.on('connect', function(){
            socket.emit('login', uid);
        });
	}

	creatSnakeBody(arr){
		this.SnakeBody = new HTMLSnakeBody(arr);
	}

	sendDirection(direction){
		let row_arr = ['left','right'];
		let col_arr = ['top','bottom'];
		if(((row_arr.indexOf(direction) >= 0 && row_arr.indexOf(this.direction) >= 0) || 
			(col_arr.indexOf(direction) >= 0 && col_arr.indexOf(this.direction) >= 0)) && direction != this.direction)
		{
			return false;
		}
		this.direction = direction;

		let data = JSON.stringify({
			act:'move',
			name:this.name,
			direction:direction
		});
		sendParams(data);
		this.runSnake();
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

	runSnake(){
		let newpoint = this.getNewPoint(this.direction);
		let remark = false;//判断吃尾
		for (var i = 0; i < this.SnakeBody.snakes.length; i++) {
			let point = this.SnakeBody.snakes[i].getPoint();
			if(point.x == newpoint.x && point.y == newpoint.y){
				remark = true;
			}
		};

		let max_border = [COL-1,ROW-1];//判断边界
		if(newpoint.x < 0 || newpoint.x > max_border[0] || newpoint.y < 0 || newpoint.y > max_border[1] || remark)
		{
			this.SnakeBody.destroy();
			this.creatSnakeBody(this.area);
		}else{
			let food = this.delegat.getFood();
			for (var i = 0; i < food.length; i++) {
				let foodpoint = food[i].getPoint();
				if(newpoint.x == foodpoint.x && newpoint.y == foodpoint.y){
					this.delegat.eatFood(food[i]);
					let point = this.SnakeBody.foot.getPoint();
					this.SnakeBody.foot = this.SnakeBody.createBlock(point.x,point.y);
				}
			};

			for (var i = this.SnakeBody.snakes.length - 1; i > 0; i--) {
				let point = this.SnakeBody.snakes[i-1].getPoint();
				this.SnakeBody.snakes[i].setPoint(point.x,point.y);
			};
			this.SnakeBody.head.setPoint(newpoint.x,newpoint.y);
		}
	}

	getNewPoint(direction){
		let point = this.SnakeBody.head.getPoint();
		let newpoint = {};
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
				
		}
		return newpoint;
	}
}

class Controller{
	constructor(){
		this.Foods = [];
		this.payer = [];
		this.createDesktop();
		this.createFood();
		this.initPayer(name);
	}

	initPayer(){
		let params = {
			operate:[87,83,65,68],
			area:[[10,10],[9,10],[8,10]],
			name:name
		};
		this.payer.push(new HTMLPayer(params,{
			getFood:$.proxy(this.getFood,this),
			eatFood:$.proxy(this.eatFood,this)
		}));
	}

	createPayer(name){
		let params = {
			operate:null,
			area:[[10,10],[9,10],[8,10]],
			name:name
		};
		this.payer.push(new HTMLPayer(params,{
			getFood:$.proxy(this.getFood,this),
			eatFood:$.proxy(this.eatFood,this)
		}));
	}

	createDesktop(){
		this.Desktop = new HTMLDesktop();
	}

	createFood(num){
		if(typeof(num) == 'undefined') num = 1;
		for (var i = 0; i < num; i++) {
			this.Foods.push(new HTMLFood());
		};
	}

	eatFood(food){
		for (var i = 0; i < this.Foods.length; i++) {
			if(food.food == this.Foods[i].food){
				this.Foods.splice(i,1);
				break;
			}
		};
		this.createFood();
	}

	getFood(){
		return this.Foods;
	}
}