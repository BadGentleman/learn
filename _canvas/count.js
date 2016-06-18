var WINDOW_WIDTH = 1024;
var WINDOW_HEIGHT = 600;
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
var BASE_COLOR = "#AA88EE";

//固定倒计时
//var endTime = new Date(2016, 5, 20, 20, 0, 0);

//时间管理倒计时
// var endTime = new Date();
// endTime.setTime(endTime.getTime() + 3600 * 1000);

var curShowTimeSeconds = 0;

//var ball = {x: 50, y: 50, r: 25, vx: -4, vy: -20, g: 4, /*死亡参数*/lifeX: 3, lifeY: 5};
var balls = [];
var randomArray = [];//存储随机颜色 

window.onload = function(){

	WINDOW_WIDTH = document.body.clientWidth;
	//WINDOW_HEIGHT = document.body.clientHeight;
	
	//解决chrome body.clientHeight取值问题
	WINDOW_HEIGHT = (document.body.scrollHeight >document.body.clientHeight) ? 
	document.body.scrollHeight : document.body.clientHeight; 

	MARGIN_LEFT = Math.round(WINDOW_WIDTH / 10);
	RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 100) - 1; 

	MARGIN_TOP = Math.round(WINDOW_HEIGHT / 5);


	var canvas = document.getElementById('canvas');

	canvas.width = WINDOW_WIDTH;
	canvas.height = WINDOW_HEIGHT;

	var ctx = canvas.getContext('2d');

	curShowTimeSeconds = getCurShowTimeSeconds();

	var inter = setInterval(function(){
		render(ctx);
		update();
	}, 33);

	document.onkeydown = function(){
		var e = window.event;
		if(e.keyCode === 13){//回车
			clearInterval(inter);
		}
	}

};

function getCurShowTimeSeconds(){//获取当前展示时间的毫秒形式
	var curTime = new Date();

	//倒计时
	// var res = (endTime.getTime() - curTime.getTime()) / 1000;
	// res = Math.round(res);
	//当前时间HH：MM：SS
	var res = curTime.getHours() * 3600 + curTime.getMinutes() * 60 + curTime.getSeconds();

	return res > 0 ? res : 0;
}

function render(context){//总体渲染

	context.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);	

	var hours = parseInt(curShowTimeSeconds / 3600);
	var mins = parseInt((curShowTimeSeconds - hours * 3600) / 60);
	var seconds = curShowTimeSeconds % 60;

	renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(hours / 10), context);
	renderDigit(MARGIN_LEFT + 14 * (RADIUS + 1), MARGIN_TOP, hours % 10, context);
	renderDigit(MARGIN_LEFT + 28 * (RADIUS + 1), MARGIN_TOP, 10, context);
	renderDigit(MARGIN_LEFT + 36 * (RADIUS + 1), MARGIN_TOP, parseInt(mins / 10), context);
	renderDigit(MARGIN_LEFT + 50 * (RADIUS + 1), MARGIN_TOP, mins % 10, context);
	renderDigit(MARGIN_LEFT + 64 * (RADIUS + 1), MARGIN_TOP, 10, context);
	renderDigit(MARGIN_LEFT + 72 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), context);
	renderDigit(MARGIN_LEFT + 86 * (RADIUS + 1), MARGIN_TOP, seconds % 10, context);


	for (var i = 0; i < balls.length; i++) {
		context.fillStyle = balls[i].color;

		context.beginPath();
		context.arc(balls[i].x, balls[i].y, balls[i].r, 0, 2 * Math.PI);
		context.closePath();

		context.fill();
	}

}


function update(){//更新渲染数据
	var nextShowTimeSeconds = getCurShowTimeSeconds();

	var nextHours = parseInt(nextShowTimeSeconds / 3600);
	var nextMins = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
	var nextSeconds = nextShowTimeSeconds % 60;

	var curHours = parseInt(curShowTimeSeconds / 3600);
	var curMins = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
	var curSeconds = curShowTimeSeconds % 60;

	if(nextSeconds != curSeconds){
		if(parseInt(nextHours / 10) != parseInt(curHours / 10)){
			addBalls(MARGIN_LEFT, MARGIN_TOP, parseInt(nextHours / 10));
		}
		if(nextHours % 10 != curHours % 10){
			addBalls(MARGIN_LEFT + 14 * (RADIUS + 1), MARGIN_TOP, nextHours % 10);
		}
		if(parseInt(nextMins / 10) != parseInt(curMins / 10)){
			addBalls(MARGIN_LEFT + 36 * (RADIUS + 1), MARGIN_TOP, parseInt(nextMins / 10));
		}
		if(nextMins % 10 != curMins % 10){
			addBalls(MARGIN_LEFT + 50 * (RADIUS + 1), MARGIN_TOP, nextMins % 10);
		}
		if(parseInt(nextSeconds / 10) != parseInt(curSeconds / 10)){
			addBalls(MARGIN_LEFT + 72 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds / 10));
		}
		if(nextSeconds % 10 != curSeconds % 10){
			addBalls(MARGIN_LEFT + 86 * (RADIUS + 1), MARGIN_TOP, nextSeconds % 10);
		}

		curShowTimeSeconds = nextShowTimeSeconds;
	}

	updateBalls();
	//死亡判定
	// if(ball.vy < 1){
	// 	ball.vy = 0;
	// }

	// if(ball.lifeY == 0){
	// 	ball.vy = 0;
	// 	ball.y = WINDOW_HEIGHT - ball.r;
	// }else if(ball.y >= WINDOW_HEIGHT - ball.r){
			
	// 	ball.vy = -Math.floor(ball.vy * 0.5);

	// 	ball.y = WINDOW_HEIGHT - ball.r;
	// 	ball.lifeY--;
	// }

	// if(ball.lifeX == 0){
	// 	ball.vx = 0;
	// 	ball.x = WINDOW_WIDTH - ball.r;
	// }else{
	// 	if(ball.x >= WINDOW_WIDTH - ball.r){
	// 		ball.vx = -Math.floor(ball.vx * 0.75);
	// 		ball.x = WINDOW_WIDTH - ball.r;
	// 		ball.lifeX--;
	// 	}
	// 	if(ball.x <= ball.r){
	// 		ball.vx = -Math.floor(ball.vx * 0.75);
	// 		ball.x = ball.r;
	// 		ball.lifeX--;
	// 	}
	// }

}

function renderDigit(x, y, num, context){//渲染数字

	context.fillStyle = BASE_COLOR;

	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j] === 1){
				context.beginPath();
				context.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), 
					y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI);
				context.closePath();

				context.fill();
			}
		}
	}
}

function getRandomColor(){//获取随机颜色
	var range = 16;
	var ranNum = 0;
	for(var i = 0; i < 6; i++){
		ranNum = Math.floor(Math.random() * 16);

		switch(ranNum){
			case 10:
				ranNum = "A";
				break;
			case 11:
				ranNum = "B";
				break;	
			case 12:
				ranNum = "C";
				break;
			case 13:
				ranNum = "D";
				break;
			case 14:
				ranNum = "E";
				break;
			case 15:
				ranNum = "F";
				break;
			default:break;				
		}

		randomArray[i] = ranNum;
	}

	var randomColor = randomArray.join("");
	if(randomColor === "FFFFFF"){
		randomColor = "FF0000";
	}

	return "#" + randomColor;
}

function addBalls(x, y, num){//添加某个数字数量小球
	for (var i = 0; i < digit[num].length; i++) {
		for (var j = 0; j < digit[num][i].length; j++) {
			if(digit[num][i][j] === 1){
				var ball = {
					x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1), 
					y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1), 
					r: RADIUS, 
					vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4, 
					vy: -5,//Math.pow(-1, Math.ceil(Math.random() * 1000)) * Math.random() * 20, 
					g: 1.5 + Math.random(),
					color: getRandomColor()
				};
				balls.push(ball);
			}
		}
	}
}

function updateBalls(){//更新所有小球数据

	var live = 0;//未出界小球数量

	//console.log(balls.length);
	for (var i = 0; i < balls.length; i++) {
		balls[i].x += balls[i].vx; 
		balls[i].y += balls[i].vy; 
		balls[i].vy += balls[i].g; 

		if(balls[i].y >= WINDOW_HEIGHT - balls[i].r){
			balls[i].vy = -balls[i].vy * 0.75;
			balls[i].y = WINDOW_HEIGHT - balls[i].r;
		}
	}

	//遍历所有小球，判断哪些未出界，删去所有出界小球
	for (var i = 0; i < balls.length; i++) {
		if(balls[i].x >= -balls[i].r && balls[i].x <= WINDOW_WIDTH + balls[i].r){
			balls[live++] = balls[i]; 
		}
	}

	while(balls.length > Math.min(200, live)){//存活小球数量多于200 只取前200
		balls.pop();
	}
}