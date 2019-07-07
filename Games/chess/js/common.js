/*画布类
	div,背景棋盘,90格,

棋子类
	div,7类(車,马,象,士,帅,炮,兵),

控制类
	移动判定,吃棋判定,初始化
*/

// 棋子类
function ChessMan(option){
	this.value = option.value;
	this.type = option.type;
	this.id = option.id;
	this.parent = option.parent;
	this.setPoint(this.id);
}
ChessMan.prototype={
	setParam:function(option){
		this.value = option.value;
		this.type = option.type;
	},
	setPoint:function(index){
		this.x=index%this.parent.col;
		this.y=Math.floor(index/this.parent.col);
	},
	getPoint:function(){
		return {
			x:this.x,
			y:this.y
		}
	},
	rule:function(point){//point表示棋子将要移动的位置
		var position = this.getPoint();//棋子的当前位置
		switch(this.value){
			case '兵':
				return this.army(point,position);
				break;
			case '炮':
				return this.gun(point,position);
				break;
			case '車':
				return this.car(point,position);
				break;
			case '马':
				return this.horse(point,position);
				break;
			case '象':
				return this.elephant(point,position);
				break;
			case '相':
				return this.elephant(point,position);
				break;
			case '仕':
				return this.guard(point,position);
				break;
			case '士':
				return this.guard(point,position);
				break;
			case '将':
				return this.chief(point,position);
				break;
			case '帅':
				return this.chief(point,position);
				break;
		}
	},
	isChessMan:function(ary){
		return this.parent.get(this.parent.getNum(ary)).value;
	},
	army:function(point,position){
		if(this.type == 'white'){
			if(position.y < 5){
				if(point.y-position.y == 1 && point.x == position.x){
					return true;
				}
				return false;
			}else{
				if(	point.y<position.y || 
					point.y-position.y > 1 || 
					Math.abs(point.x-position.x) > 1 ||
					(point.y-position.y == 1 && Math.abs(point.x-position.x) == 1))
				{
					return false;
				}
				return true;
			}
		}else if(this.type == 'black'){
			if(position.y > 4){
				if(position.y-point.y == 1 && point.x == position.x){
					return true;
				}
				return false;
			}else{
				if(	point.y>position.y || 
					position.y-point.y > 1 || 
					Math.abs(point.x-position.x) > 1 ||
					(position.y-point.y == 1 && Math.abs(point.x-position.x) == 1))
				{
					return false;
				}
				return true;
			}
		}
	},
	gun:function(point,position){
		var value = this.isChessMan([point.x,point.y]);
		var count = 0;
		if(point.x == position.x){
			for (var i = Math.min(position.y,point.y)+1; i < Math.max(position.y,point.y); i++) {
				if(this.isChessMan([point.x,i])){
					count++;
				}
			}
		}else if(point.y == position.y){
			for (var i = Math.min(position.x,point.x)+1; i < Math.max(position.x,point.x); i++) {
				if(this.isChessMan([i,point.y])){
					count++;
				}
			}
		}
		if(count == 1){
			return value?1:0;
		}else if(count == 0){
			return value?0:1;
		}
	},
	car:function(point,position){
		var count = 0;
		if(point.x == position.x){
			for (var i = Math.min(position.y,point.y)+1; i < Math.max(position.y,point.y); i++) {
				if(this.isChessMan([point.x,i])){
					count++;
				}
			}
		}else if(point.y == position.y){
			for (var i = Math.min(position.x,point.x)+1; i < Math.max(position.x,point.x); i++) {
				if(this.isChessMan([i,point.y])){
					count++;
				}
			}
		}else{
			return false;
		}

		if(count > 0){
			return false;
		}else{
			return true;
		}
	},
	horse:function(point,position){
		var width = Math.abs(point.x-position.x);
		var height = Math.abs(point.y-position.y);
		if(width*height == 2){
			if(point.x>position.x && width == 2){
				return !this.isChessMan([position.x+1,position.y]);
			}else if(point.x<position.x && width == 2){
				return !this.isChessMan([position.x-1,position.y]);
			}else if(point.y>position.y && height == 2){
				return !this.isChessMan([position.x,position.y+1]);
			}else if(point.y<position.y && height == 2){
				return !this.isChessMan([position.x,position.y-1]);
			}
		}
		return false;
	},
	elephant:function(point,position){
		var width = Math.abs(point.x-position.x);
		var height = Math.abs(point.y-position.y);
		if((this.type == 'white' && point.y > 4) || (this.type == 'black' && point.y < 5)){
			return false;
		}
		if(width*height == 4){
			return !this.isChessMan([(point.x+position.x)/2,(point.y+position.y)/2])
		}
		return false;
	},
	guard:function(point,position){
		var width = Math.abs(point.x-position.x);
		var height = Math.abs(point.y-position.y);
		
		if(width*height != 1){
			return false;
		}
		if(this.type == 'white'){
			var point_arr = [[3,0],[5,0],[4,1],[3,2],[5,2]];
			for(var i in point_arr){
				if(point.x == point_arr[i][0] && point.y == point_arr[i][1]){
					return true;
				}
			}
		}else if(this.type == 'black'){
			var point_arr = [[3,9],[5,9],[4,8],[3,7],[5,7]];
			for(var i in point_arr){
				if(point.x == point_arr[i][0] && point.y == point_arr[i][1]){
					return true;
				}
			}
		}
		return false;
	},
	chief:function(point,position){
		var width = Math.abs(point.x-position.x);
		var height = Math.abs(point.y-position.y);
		if(width+height != 1){
			return false;
		}
		if(this.type == 'white'){
			if(point.x >=3 && point.x <= 5 && point.y <= 2){
				return true;
			}
		}else if(this.type == 'black'){
			if(point.x >=3 && point.x <= 5 && point.y >= 7){
				return true;
			}
		}
	}
	
}

function ChessBoard(option){
	this.row = 10;
	this.col = 9;
	this.initChess();
}
ChessBoard.prototype={
	initChess:function(){
		this.chessmans=[];
		for (var i = 0; i <this.row*this.col; i++) {
			this.chessmans[i]= new ChessMan({
				value:'',
				id:i,
				parent:this,
				type:''
			});
		};
		this.initChessMan();
	},
	chessPoint:new Array(
		[	
			[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0],
			[8,0],[1,2],[7,2],[0,3],[2,3],[4,3],[6,3],[8,3]
		],
		[	
			[0,9],[1,9],[2,9],[3,9],[4,9],[5,9],[6,9],[7,9],
			[8,9],[1,7],[7,7],[0,6],[2,6],[4,6],[6,6],[8,6]
		]
	),
	chessName:new Array(
		['車','马','象','士','帅','士','象','马','車','炮','炮','兵','兵','兵','兵','兵'],
		['車','马','相','仕','将','仕','相','马','車','炮','炮','兵','兵','兵','兵','兵']
	),
	initChessMan:function(){
		for (var i = 0; i < this.chessPoint[0].length+this.chessPoint[1].length; i++) {
			if(i<this.chessPoint[0].length){
				this.get(this.getNum(this.chessPoint[0][i])).setParam({
					value:this.chessName[0][i],
					type:'white'
				});
			}else{
				this.get(this.getNum(this.chessPoint[1][i-this.chessPoint[0].length])).setParam({
					value:this.chessName[1][i-this.chessPoint[0].length],
					type:'black'
				});
			}
		}
	},
	getNum:function(array){
		return this.col*array[1]+array[0];
	},
	get:function(val){
		if(val===undefined){
			return this.chessmans;
		}
		else{
			return this.chessmans[val];
		}
	},
	isHasElementOne:function(arr,point){ 
		for(var i = 0,vlen = arr[0].length; i < vlen; i++){ 
			if(arr[0][i][0] == point.x && arr[0][i][1] == point.y){ 
				return ['white',i]; 
			} 
		} 
		for(var i = 0, vlen = arr[1].length; i < vlen; i++){ 
			if(arr[1][i][0] == point.x && arr[1][i][1] == point.y){ 
				return ['black',i]; 
			} 
		} 
		return -1; 
	}  
}

function Controller(option){
	this.chessBoard = new ChessBoard();
}
Controller.prototype={

}





