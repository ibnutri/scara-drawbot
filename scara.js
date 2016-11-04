var five = require("johnny-five");
var config = require("./config");
var kinematic = require("./lib/kinematic.js");
var board = new five.Board({
	port: config.board.port
});

var stdin = process.openStdin(); 

kinematic.start(); // priming the variable

var elbowOffset = 38;
var shoulderOffset = 7;
var animation;
board.on("ready", function() {
  	config.board.test1();
 	elbowServo = new five.Servo({
	  pin: 6,
	  startAt: 45 + elbowOffset
	});
 	//elbowServo.sweep();

 	shoulderServo = new five.Servo({
	  pin: 5,
	  startAt: 135 + shoulderOffset
	});

 	animation = new five.Animation(shoulderServo);
 	animation2 = new five.Animation(elbowServo);
 	var love = [
 		[6,5.5],
		[6.8,5.5],
		[7,6],
		[7.2,5.5],
		[8,5.5],
		[8.5,6],
		[8.5,7],
		[7.8,7.8],
		[7,9],
		[6.2,7.8],
		[5.5,7],
		[5.5,6],
		[6,5.5],
 	];
 	var loveResult = [];
 	var loveX = [];
 	var loveY = [];
 	for(var i = 0; i < love.length; i++){
 		var kinematicResult = kinematic.armMoveTo(love[i][0],love[i][1]);
 		var kinematicConvert = [kinematicResult.shoulder, kinematicResult.elbow];
 		loveResult.push(kinematicConvert);
 		loveX.push({degrees: kinematicConvert.shoulder});
 		loveY.push({degrees: kinematicConvert.elbow});
 	}
	// kinRet1 = kinematic.armMoveTo(6,5.5);
	// kinRet2 = kinematic.armMoveTo(6.8,5.5);
	// kinRet3 = kinematic.armMoveTo(7,6);
	// kinRet4 = kinematic.armMoveTo(7.2,5.5);
	// kinRet5 = kinematic.armMoveTo(8,5.5);

	// kinRet6 = kinematic.armMoveTo(8.5,6);
	// kinRet7 = kinematic.armMoveTo(8.5,7);
	// kinRet8 = kinematic.armMoveTo(7.8,7.8);
	// kinRet9 = kinematic.armMoveTo(7,9);
	// kinRet10 = kinematic.armMoveTo(6.2,7.8);

	// kinRet11 = kinematic.armMoveTo(5.5,7);
	// kinRet12 = kinematic.armMoveTo(5.5,6);
	// kinRet13 = kinematic.armMoveTo(6,5.5);
	
	animation.enqueue({
		duration:8000,
		cuePoints: [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.96, 1],
		keyFrames://[
			// [{degrees: kinRet1.shoulder},{degrees: kinRet2.shoulder},{degrees: kinRet3.shoulder},{degrees: kinRet4.shoulder},{degrees: kinRet5.shoulder},
			// {degrees: kinRet6.shoulder},{degrees: kinRet7.shoulder},{degrees: kinRet8.shoulder},{degrees: kinRet9.shoulder},
			// {degrees: kinRet10.shoulder},{degrees: kinRet11.shoulder},{degrees: kinRet12.shoulder},{degrees: kinRet13.shoulder}]
			// [{degrees: kinRet1.elbow},{degrees: kinRet2.elbow},{degrees: kinRet3.elbow}]
			// [{degrees: 80},{degrees: 90},{degrees: 100}]
			// [{},{},{}]
		//]
		loveX
		,
		metronomic: true,
		loop: true
	});
	animation.stop();
	animation2.enqueue({
		duration:8000,
		cuePoints: [0, 0.08, 0.16, 0.24, 0.32, 0.40, 0.48, 0.56, 0.64, 0.72, 0.80, 0.96, 1],
		keyFrames://[
			// [{degrees: kinRet1.shoulder},{degrees: kinRet2.shoulder},{degrees: kinRet3.shoulder}],
			// [{degrees: kinRet1.elbow},{degrees: kinRet2.elbow},{degrees: kinRet3.elbow},{degrees: kinRet4.elbow},{degrees: kinRet5.elbow},
			// {degrees: kinRet6.elbow},{degrees: kinRet7.elbow},{degrees: kinRet8.elbow},{degrees: kinRet9.elbow},
			// {degrees: kinRet10.elbow},{degrees: kinRet11.elbow},{degrees: kinRet12.elbow},{degrees: kinRet13.elbow}]
			// [{degrees: 80},{degrees: 90},{degrees: 100}]
			// [{},{},{}]
		//]
		loveY
		,
		metronomic: true,
		loop: true
	});
	animation2.stop();
	// animation.enqueue({
	//     cuePoints: [0, 0.25, 0.75, 1],
	//     keyFrames: [90, { value: 180, easing: "inQuad" }, { value: 0, easing: "outQuad" }, 90],

	//     duration: 2000
	// });
 	//shoulderServo.sweep();
 	// deviasi 56derajat
 	board.repl.inject({
 	shoulderTo: function(degree){
 		shoulderServo.to(shoulderPosition + degree);
 	},
 	elbowTo: function(degree){
 		elbowServo.to(elbowPosition - degree);
 	},
 	// inverseValueE: inverseValueE,
 	// forwardX: forwardX,
 	// forwardY: forwardY,
 	// inverseE: inverseE,
 	// inverseS: inverseS,
 	// armMoveTo: armMoveTo,
 	makeGrid: makeGrid,
 	startAnim: startAnim,
 	animation: animation,
 	animation2: animation2
 });
	this.on("exit", function(){
		// armMoveTo(5,5);
	});
});
function test(){
	console.log('sparta');
}

// stdin.on('keypress', function (chunk, key) {
//   	// if (key && key.ctrl && key.name == 'c') process.exit();
//   	if(key.name == 'right'){
//   		console.log('right');	
//   		if(drawY < 10){
//   			drawY += 0.5;
//   			armMoveTo(drawX, drawY);
//   		}
//   	}
//   	if(key.name == 'left'){
//   		console.log('left');	
//   		if(drawY > 5){
//   			drawY -= 0.5;
//   			armMoveTo(drawX, drawY);
//   		}
//   	}
//   	if(key.name == 'up'){
//   		console.log('up');	
//   		if(drawX > 5){
//   			drawX -= 0.5;
//   			armMoveTo(drawX, drawY);
//   		}
//   	}
//   	if(key.name == 'down'){
//   		console.log('down');	
//   		if(drawX < 10){
//   			drawX += 0.5;
//   			armMoveTo(drawX, drawY);
//   		}
//   	}
// });



function makeGrid(gridSize){
	if(gridSize == undefined){
		gridSize = 1;
	}
	// drawing board start at 5,5 and ends at 10,10
	var drawingWidth = 5;
	var drawingHeight = 5;
	var drawingOffsetWidth = 5;
	var drawingOffsetHeight = 5;
	var currentX = 5;
	var currentY = 5;
	var counterHeight = 0;
	var currentTimeline = 0;
	var gridDelay = 500;
	for(var i = 0; i < 3; i++){
		while(currentX<drawingHeight+drawingOffsetHeight){
			currentX += gridSize;
			doSetTimeout(gridDelay*counterHeight, currentX, currentY);
			currentTimeline = gridDelay*counterHeight;
			counterHeight++;
		}
		currentY += gridSize;
		currentTimeline+=gridDelay;
		counterHeight += 1;
		doSetTimeout(currentTimeline, currentX, currentY);
		while(currentX>drawingOffsetHeight){
			currentX -= gridSize;
			doSetTimeout(gridDelay*counterHeight, currentX, currentY);
			currentTimeline = gridDelay*counterHeight;
			counterHeight++;
		}
		currentY += gridSize;
		currentTimeline+=gridDelay;
		counterHeight += 1;
		doSetTimeout(currentTimeline, currentX, currentY);
	}
	while(currentX<drawingHeight+drawingOffsetHeight){
		currentX += gridSize;
		if(currentX < 10){
			doSetTimeout(gridDelay*counterHeight, currentX, currentY);
		}
		currentTimeline = gridDelay*counterHeight;
		counterHeight++;
	}
}
function doSetTimeout(i,currentX,currentY) {
  	setTimeout(function() { 
		console.log('armMoveTo('+currentX+','+currentY+')');
		kinematicReturn = kinematic.armMoveTo(currentX, currentY);
		console.log(kinematicReturn);
		shoulderServo.to(kinematicReturn.shoulder);
		elbowServo.to(kinematicReturn.elbow);
  	}, i);
}
function startAnim(){
	animation.play();
	animation2.play();
 }
