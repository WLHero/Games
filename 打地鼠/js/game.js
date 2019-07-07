// 一维数组的值 = y*列数+x


window.onload = function() {
	class_name.init();
}

function click_box(_this) {
	var index = _this.id;
	var _className = _this.className;
	if(_className == 'diglett_up') {
		_this.setAttribute('class','diglett_down');
	}
}

var class_name = {
	_colnum:6,//列数
	_rownum:5,//行数
	_box_width:60,//格子的宽度
	_box_height:60,//格子的高度
	_number:3,//随机生成1-3个的老鼠
	init: function() {
		this._draw(); //生成画布
		this._draw_diglett(); //随机生成地鼠
	},
	_draw: function() {
		for(var _x=0; _x<this._colnum; _x++) {
			for(var _y=0; _y<this._rownum;_y++){
				var _box = $._create('div');
				_box.setAttribute('class','box');
				_box.setAttribute('id',_y*this._colnum+_x);
				_box.setAttribute('onclick','click_box(this)');
				_box.setAttribute('style','width:'+this._box_width+'px;height:'+this._box_height+'px;top:'+this._box_height*_y+'px;left:'+this._box_width*_x+'px')
				// _box.innerHTML = _y*this._colnum+_x +'<br>['+_x+','+_y+']';
				$._get('game_panel').appendChild(_box);
			}
		}
	},
	_clear: function() {
		for(var _x=0; _x<this._colnum; _x++) {
			for(var _y=0; _y<this._rownum;_y++){
				var index = _y*this._colnum+_x; //随机box的id
			   $._get(index).setAttribute('class','box');
			}
		}
	},
	_draw_diglett: function() {
		this._clear(); //清除diglett_up这个类，让所有的diglett_up变成box
		var boss = this;
		var _number = Math.floor(Math.random()*this._number + 1); //随机生成1-3之间的数
		for(var _i = 0; _i < _number; _i++) {
			var diglett_x = Math.floor(Math.random()*this._colnum);//随机行数
			var diglett_y = Math.floor(Math.random()*this._rownum);//随机列数
			var index = diglett_y*this._colnum+diglett_x; //随机box的id
			$._get(index).setAttribute('class','diglett_up'); //给随机的id赋值类diglett_up
		}

		//定时器
		setTimeout(function(){
			boss._draw_diglett();
		},1500)
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