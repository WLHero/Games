var HTMLChessMan=function(option){
	this.super.apply(this,arguments);
}
HTMLChessMan.prototype=$.extend(true,{super:ChessMan},ChessMan.prototype,{
	move:function(point){
		var index = this.parent.isHasElementOne(this.parent.chessPoint,this.getPoint());
		var position = point.getPoint();
		if(!this.rule(position)) return;
		if(point.value != ''){
			var del_index = this.parent.isHasElementOne(this.parent.chessPoint,position);
			this.eatChess(del_index);
		}
		if(index[0] == 'black'){
			this.parent.chessPoint[1][index[1]] = [position.x,position.y];
		}else{
			this.parent.chessPoint[0][index[1]] = [position.x,position.y];
		}
		this.parent.initChess();
		$(DOM).off();
		backThis.getClick((this.type == 'white')?'.black':'.white');
	},
	eatChess:function(index){
		if(index[0] == 'black'){
			this.parent.chessPoint[1].splice(index[1], 1);
			this.parent.chessName[1].splice(index[1], 1);
		}else{
			this.parent.chessPoint[0].splice(index[1], 1);
			this.parent.chessName[0].splice(index[1], 1);
		}
	}

})
ChessMan=HTMLChessMan;

var HTMLChessBoard=function(option){
	this.super.apply(this,arguments);
}
HTMLChessBoard.prototype=$.extend(true,{super:ChessBoard},ChessBoard.prototype,{
	initChess:function(){
		this.super.prototype.initChess.apply(this,arguments);
		var str="";
		for(var s=0;s<this.chessmans.length;s++){
			str += "<div class='chessman "+this.chessmans[s].type+"' style='top:"+(this.chessmans[s].getPoint().y)*SIZE+"px;left:"+(this.chessmans[s].getPoint().x)*SIZE+"px' data-id='"+this.chessmans[s].id+"'>"+this.chessmans[s].value+"</div>";
		}
		$(DOM).html(str);
	}
})
ChessBoard=HTMLChessBoard;

var HTMLcontroller=function(option){
	this.super.apply(this,arguments);
	this.getClick('.white');
}
HTMLcontroller.prototype=$.extend(true,{super:Controller},Controller.prototype,{
	getClick:function(str){
		backThis = this;
		$(DOM).on("click",str,function(){
			$(this).addClass('click').siblings('.chessman').removeClass('click');
			backThis.click = backThis.chessBoard.get($(this).attr('data-id'));
			$(DOM).find('.chessman').not(str).off('click').on('click',backThis.movePoint);
		});
	},
	movePoint:function(){
		var point = backThis.chessBoard.get($(this).attr('data-id'));
		backThis.click.move(point);
	}
})
Controller=HTMLcontroller;