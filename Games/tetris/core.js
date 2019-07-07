//srcipt
//方块类
function Block(option){
	this.parent=option.parent;
	this.setIndex(option.index);
}

Block.prototype={
	setIndex:function(index){
		this.index=index;
	},
	getCoord:function(){
		var parent_coord=this.parent.getCoord();
		var y=Math.floor(this.index/4);
		var x=this.index%4;
		return {
			x:parent_coord.x+x,
			y:parent_coord.y+y
		}
	}
}
//容器类
function Holder(option){
	this.parent=option.parent;
	this.x=0;
	this.y=0;
	this.shapeIndex=Math.floor(Math.random()*(this.shapeMap.length));
	this.rotateIndex=Math.floor(Math.random()*(this.shapeMap[this.shapeIndex].length));
	this.length=0;
	this.initBlocks();
}

Holder.prototype={
	moveBy:function(left,top){
		this.x += left;
		this.y += top;
	},
	getCoord:function(){
		return {
			x:this.x,
			y:this.y
		}
	},
	//方块组合
	shapeMap:new Array(
		[[ 2, 6,10,14],[12,13,14,15],[2, 6,10,14],[12,13,14,15]],
		[[ 6,10,13,14],[ 9,13,14,15],[5, 6, 9,13],[ 9,10,11,15]],
		[[ 6,10,14,15],[11,13,15,14],[6, 7,11,15],[ 9,10,11,13]],
		[[ 9,10,13,14],[ 9,10,13,14],[9,10,13,14],[ 9,10,13,14]],
		[[ 5, 9,10,14],[ 9,10,12,13],[5, 9,10,14],[ 9,10,12,13]],
		[[ 6, 9,10,13],[ 8, 9,13,14],[6, 9,10,13],[ 8, 9,13,14]],
		[[10,13,14,15],[ 6, 9,10,14],[9,10,11,14],[ 6,10,11,14]]
	),
	initBlocks:function(){//0~6,0~4
		this.blocks=[];
		var shapeInfo=this.shapeMap[this.shapeIndex][this.rotateIndex];
		for(var i=0;i<shapeInfo.length;i++){
			this.blocks.push(new Block({parent:this,index:shapeInfo[i]}));
			this.length++;
		}
	},
	rotate:function(){
		this.rotateIndex=(this.rotateIndex+1)%4;
		var shapeInfo=this.shapeMap[this.shapeIndex][this.rotateIndex];
		for(var i=0;i<shapeInfo.length;i++){
			this.blocks[i].setIndex(shapeInfo[i]);
		}
	},
	get:function(num){
		return this.blocks[num];
	}
}

function Desktop(option){
	this.option=option;
	this.parent=this.option.parent;
	this.row=this.option.row;
	this.col=this.option.col;
	this.empty=[];
	for(var i=0;i<this.row*this.col;i++){
		this.empty.push(0);
	}
}

Desktop.prototype={
	fill:function(x,y){
		return this.setPoint(x,y,1);
	},
	clear:function(x,y){
		return this.setPoint(x,y,0);
	},
	setPoint:function(x,y,value){
		var num=y*this.col+x;
		this.empty[num]=value;
		return num;
	},
	getPoint:function(x,y){
		var num=y*this.col+x;
		return this.empty[num];
	},
	isOutSide:function(holder){
		var result=0;
		for(var i=0;i<holder.length;i++){
			var pos=holder.get(i).getCoord();

			if(pos.x < 0 || pos.x >= this.col){
				result |= 0x1;
			}
			if(pos.y >= this.row){
				result |=0x10;
			}
		}
		return result;
	},
	isOverlap:function(holder){
		for(var i=0;i<holder.length;i++){
			var pos=holder.get(i).getCoord();
			if(this.getPoint(pos.x,pos.y)){
				return true;
			}	
		}
		return false;
	},
	clearFullLine:function(){
		var result=[];
		var full_line_token=new Array(this.col+1).join("1");
		var empty_line_token=new Array(this.col+1).join("0");
		for(var i=this.row-1;i >= 0;i--){
			var line_token=this.empty.slice(i*this.col,(i+1)*this.col).join("");
			if(line_token == full_line_token){
				result.push(i);
			}
			else if(line_token == empty_line_token){
				break;
			}
		}
		for(var i=0;i<result.length;i++){
			this.empty.splice(result[i]*this.col,this.col);
		}
		var make_line=[];
		for(var i=0;i<this.col;i++){
			make_line[i]=0;
		}
		for(var i=0;i<result.length;i++){
			Array.prototype.unshift.apply(this.empty,make_line);
		}
		return result;//[14]
	}
}

var Controller=function(option){
	this.option=option;
	this.desktop=new Desktop(option.Desktop);
	this.makeBackHolder();
	this.makeHolder();
}
Controller.prototype={
	makeHolder:function(){
		this.holder=this.back_holder;
		this.makeBackHolder();
		this.holder.moveBy(Math.round(this.desktop.col-4)/2,-2);
	},
	makeBackHolder:function(){
		this.back_holder=new Holder(this.option.Holder);
	}
}










