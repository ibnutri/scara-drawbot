var five = require("johnny-five");
var config = require("./config");
var kinematic = require("./lib/kinematic.js");
console.log(kinematic);
console.log(config);
var board = new five.Board({
	port: config.board.port
});

var stdin = process.openStdin(); 

kinematic.start(); // priming the variable

var elbowOffset = 38;
var shoulderOffset = 7;

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

	kinematicReturn = kinematic.armMoveTo( 5, 5 );
	console.log(kinematicReturn);
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
 	makeGrid: makeGrid
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
  	}, i);
}

 