var five = require("johnny-five");
var config = require("./config");
var kinematic = require("./lib/kinematic.js");
var fs = require('fs');
var board = new five.Board({
	port: config.board.port
});

var stdin = process.openStdin(); 

kinematic.start(); // priming the variable

var elbowOffset = 38;
var shoulderOffset = 7;
var animation;
var animation2;
var loadedFile = '';
var startingPoint;
var msPerPoint = 800;
board.on("ready", function() {
  	config.board.test1();
  	startingPoint = kinematic.armMoveTo(5,5);
 	elbowServo = new five.Servo({
	  pin: 6,
	  // startAt: 45 + elbowOffset
	  startAt: startingPoint.elbow
	});
 	//elbowServo.sweep();

 	shoulderServo = new five.Servo({
	  pin: 5,
	  // startAt: 135 + shoulderOffset
	  startAt: startingPoint.shoulder
	});

 	

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
 	animation2: animation2,
 	loadFile: loadFile
 });
	this.on("exit", function(){
		parkArm();
	});
});



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
	if(loadedFile == ''){
		console.log('No file loaded, please load file first');
		return;
	}
	animation.play();
	animation2.play();
}
function loadFile(filename){
	if(filename == undefined){
		filename = 'sample-image/box.json'
	}
	var obj;
	fs.readFile(filename, 'utf8', function (err, data) {
		if (err) throw err;
		obj = JSON.parse(data);
		console.log('loaded '+obj.name);
		loadedFile = obj.name;
		if(obj.speed != undefined){
			msPerPoint = obj.speed;
		}else{
			msPerPoint = 800;
		}
		var love = obj.path;
		var cuePoints = [0];
		

		for(var c = 1; c <= obj.path.length; c++){
			var interval = 1/obj.path.length;
			var cuePoint = c*interval ;
			cuePoints.push(cuePoint);
		}
		console.log(cuePoints);
		var duration = obj.path.length*msPerPoint;
		animation = new five.Animation(shoulderServo);
	 	animation2 = new five.Animation(elbowServo);
	 	var loveResult = [];
	 	var loveX = [];
	 	var loveY = [];
 		if(obj.size != undefined){
 			var imageScaling = 4/obj.size.width; // grid 4 lebarnya
 		}
	 	for(var i = 0; i < love.length; i++){
	 		if(imageScaling != undefined){
		 		var kinematicResult = kinematic.armMoveTo(love[i][0]*imageScaling+5,love[i][1]*imageScaling+5);
	 		}else{
	 			var kinematicResult = kinematic.armMoveTo(love[i][0],love[i][1]);
	 		}
	 		var kinematicConvert = [kinematicResult.shoulder, kinematicResult.elbow];
	 		loveResult.push(kinematicConvert);
	 		loveX.push({degrees: kinematicConvert[0]});
	 		loveY.push({degrees: kinematicConvert[1]});
	 	}
		
		animation.enqueue({
			duration:duration,
			cuePoints: cuePoints,
			keyFrames: loveX,
			metronomic: false,
			loop: false
		});
		animation.stop();
		animation2.enqueue({
			duration:duration,
			cuePoints: cuePoints,
			keyFrames:loveY,
			metronomic: false,
			loop: false
		});
		animation2.stop();
	});
}
function parkArm(){
	shoulderServo.to(startingPoint.shoulder);
	elbowServo.to(startingPoint.elbow);
}