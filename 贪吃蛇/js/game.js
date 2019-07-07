// 一维数组的值 = y*列数+x


window.onload = function() {
	class_name.init();
}

function _in_array(string, array) {
	for(var i = 0; i<array.length; i++) {
		if(array[i] == string) {
			return true;
		}
	}
	return false;
}

function click_box(_this) {
	var index = _this.id;
	var _className = _this.className;
	if(_className == 'diglett_up') {
		_this.setAttribute('class','diglett_down');
	}
}

var class_name = {
	_colnum:30,//列数
	_rownum:20,//行数
	_box_width:20,//格子的宽度
	_box_height:20,//格子的高度
	_map:[],//地图数组
	_snake:[],
	_direction:null, //蛇的方向
	_snake_x:null,//蛇的x坐标
	_snake_y:null,//蛇的y坐标
	_food_x:null,//食物的x坐标
	_food_y:null,//食物的y坐标
	init: function() {
		this._draw(); //生成地图 蛇 food
		this._move(); //蛇移动
		this._controller_dir(); //控制方向
	},
	_draw: function() {
		for(var _x=0; _x<this._colnum; _x++) {
			this._map[_x] = [];
			for(var _y=0; _y<this._rownum;_y++){
				this._map[_x][_y] = 0; //0 格子；1 蛇；2 食物；
			}
		}
		//随机生成蛇和食物的坐标
		this._snake_x = Math.floor(Math.random()*this._colnum);
		this._snake_y = Math.floor(Math.random()*this._rownum);
		this._food_x = Math.floor(Math.random()*this._colnum);
		this._food_y = Math.floor(Math.random()*this._rownum);
		//如果随机生成的蛇和食物在同一坐标就重新生成
		if((this._snake_y*this._colnum+this._snake_x) == (this._food_y*this._colnum+this._food_x)) {
			this._food_x = Math.floor(Math.random()*this._colnum);
			this._food_y = Math.floor(Math.random()*this._rownum);
		}
		
		//把随机生成坐标放在地图数组里
		this._map[this._snake_x][this._snake_y] = 1;	
		this._map[this._food_x][this._food_y] = 2;	
	
		for(var _x=0; _x<this._colnum; _x++) {
			for(var _y=0; _y<this._rownum;_y++){
				var _box = $._create('div');
				if(this._map[_x][_y] == 1) {
					_box.setAttribute('class','snake');
					this._snake[0] = _y * this._colnum + _x;
				} else if( this._map[_x][_y] == 2 ) {
					_box.setAttribute('class','food');
				} else {
					_box.setAttribute('class','box');
				}
				_box.setAttribute('id',_y*this._colnum+_x);
				_box.setAttribute('onclick','click_box(this)');
				_box.setAttribute('style','width:'+this._box_width+'px;height:'+this._box_height+'px;top:'+this._box_height*_y+'px;left:'+this._box_width*_x+'px')
				// _box.innerHTML = _y*this._colnum+_x +'<br>['+_x+','+_y+']';
				$._get('game_panel').appendChild(_box);
			}
		}
	},
	_move() {
		var boss = this;
		var _init_position = this._snake[0];
		var _start_position = this._snake[0];
		switch(this._direction) {
			case 'left':
				_start_position = this._snake[0] - 1;
				break;
			case 'up':
				_start_position = this._snake[0] - 30;
				break;
			case 'right':
				_start_position = this._snake[0] + 1;
				break;
			case 'down':
				_start_position = this._snake[0] + 30;
				break;

		}
		
		if((this._direction == 'right' && _start_position%this._colnum==0) || (this._direction == "left" && (_start_position+1)%this._colnum==0) || (_start_position<0 || _start_position>this._rownum*this._colnum)) {
			alert('游戏结束');
			return false;
		}
		
		if(_init_position != _start_position && _in_array(_start_position,this._snake)) {
			alert('吃到尾巴了');
			return false;
		}

		

		this._snake.unshift(_start_position) //向数组开头添加元素
		var _food_position = this._food_y * this._colnum + this._food_x; //食物的一维坐标
		if(_food_position == _start_position) {
			this._food_x = Math.floor(Math.random()*this._colnum);
			this._food_y = Math.floor(Math.random()*this._rownum);
			var _food_position = this._food_y * this._colnum + this._food_x;
			$._get(_food_position).setAttribute('class','food');
		} else {
			var _end_postion = this._snake.pop();
			if(_end_postion != this._snake[0]) {
				$._get(_end_postion).setAttribute('class','box');
			}
		}
		
		//重绘图
		for(var _i = 0; _i < this._snake.length; _i++) {
			$._get(this._snake[_i]).setAttribute('class','snake');
		}

		
		setTimeout(function(){
			boss._move();
		},3000)
	},
	_controller_dir:function() {
		var boss = this;
		document.onkeydown = function(event) {
			var _left = 37,_up = 38,_right = 39, _down = 40; //键位置
			var event = event || window.event;
			var _key_value = event.which || event.keyCode;
			switch(_key_value) {
				case _left:
					if(boss._direction != "right") {
						boss._direction = "left";
					}
					break;
				case _right:
					if(boss._direction != "left") {
						boss._direction = "right";
					}
					break;
				case _up:
					if(boss._direction != "down") {
						boss._direction = "up";
					}
					break;
				case _down:
					if(boss._direction != "up") {
						boss._direction = "down";
					}
					break;

			}
		}
	}
}

var $ = {
	_get: function(_id) {
		return document.getElementById(_id);
	},
	_create: function(_element) {
		return document.createElement(_element);
	}
}