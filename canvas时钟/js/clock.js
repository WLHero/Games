var clock = document.getElementById('clock');
var ctx = clock.getContext("2d");
var width = clock.width;
var height = clock.height;
var r = width / 2;
var rem = width / 200;

function drwaBackRound() {
	ctx.save();
	ctx.translate(r,r);
	ctx.lineWidth = 10 * rem;
	ctx.beginPath();
	ctx.arc(0,0,(r - 5 * rem),0,2*Math.PI,false);
	ctx.stroke();

	var hoursNumbers = [3,4,5,6,7,8,9,10,11,12,1,2];
	ctx.font = 16 * rem + "px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	//绘制数字;
	hoursNumbers.forEach(function(number,i) {
		var arc = 2 * Math.PI /12 * i;
		var x = Math.cos(arc) * (r - 30 * rem);
		var y = Math.sin(arc) * (r - 30 * rem);
		ctx.fillText(number,x,y);
	})

	//绘制格子
	for(i = 0; i < 60; i++) {
		var arc = 2 * Math.PI /60 * i;
		var x = Math.cos(arc) * (r - 18 * rem);
		var y = Math.sin(arc) * (r - 18 * rem);
		ctx.beginPath();
		if(i % 5 === 0) {
			ctx.fillStyle = "#000";
			ctx.arc(x,y,3 * rem,0,2*Math.PI,true);
		} else {
			ctx.fillStyle = "#ccc";
			ctx.arc(x,y,2 * rem,0,2*Math.PI,true);
		}
		
		ctx.fill();
	}
}

function drawHour(hour,min) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 6;
	ctx.lineCap = "round";
	var rad = 2 * Math.PI / 12 * hour;
	var mrad = 2 * Math.PI / 12 / 60 * min;
	ctx.rotate(rad+mrad);
	ctx.moveTo(0,10 * rem);
	ctx.lineTo(0,-r/2);
	ctx.stroke();
	ctx.restore();
}
function drawMin(min) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.rotate(2 * Math.PI / 60 * min);
	ctx.moveTo(0,10 * rem);
	ctx.lineTo(0,-r + 30 * rem);
	ctx.stroke();
	ctx.restore();
}
function drawSecond(second) {
	ctx.save();
	ctx.beginPath();
	ctx.lineWidth = 3;
	ctx.lineCap = "round";
	ctx.fillStyle = "#ff0000";
	ctx.rotate(2 * Math.PI / 60 * second);
	ctx.moveTo(-2,20 * rem);
	ctx.lineTo(2,20 * rem);
	ctx.lineTo(1,-r + 18 * rem);
	ctx.lineTo(-1,-r + 18 * rem);
	ctx.fill();
	ctx.restore();
}

function drawRound() {
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = "#fff";
	ctx.arc(0,0,4 * rem,0,2*Math.PI,true);
	ctx.fill();
	ctx.restore();

}

function draw() {
	ctx.clearRect(0,0,width,height)
	var now = new Date();
	var hover = now.getHours();
	var min = now.getMinutes();
	var second = now.getSeconds();
	drwaBackRound();
	drawHour(hover,min);
	drawMin(min);
	drawSecond(second);
	drawRound();
	ctx.restore();
}


draw();
setInterval(draw,1000);