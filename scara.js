var five = require("johnny-five");
var config = require("./config");
var board = new five.Board({
	port: ''
});

var stdin = process.openStdin(); 
require('tty').setRawMode(true);    

var elbowServo, shoulderServo = null;
var elbowOffset = 38;
var shoulderOffset = 7;
var elbowPosition = 90 + elbowOffset; 
var shoulderPosition = 90+shoulderOffset;
var L1 = 7; // panjang bahu ke siku cm
var L2 = 7.5; // panjang siku ke pergelangan tangan dari cm
board.on("ready", function() {
  
 	elbowServo = new five.Servo({
	  pin: 6,
	  startAt: 45 + elbowOffset
	});
 	//elbowServo.sweep();

 	shoulderServo = new five.Servo({
	  pin: 5,
	  startAt: 135 + shoulderOffset
	});
 	//shoulderServo.sweep();
 	// deviasi 56derajat
 	board.repl.inject({
 	shoulderTo: function(degree){
 		shoulderServo.to(shoulderPosition + degree);
 	},
 	elbowTo: function(degree){
 		elbowServo.to(elbowPosition - degree);
 	},
 	inverseValueE: inverseValueE,
 	forwardX: forwardX,
 	forwardY: forwardY,
 	inverseE: inverseE,
 	inverseS: inverseS,
 	armMoveTo: armMoveTo
 });
});
function test(){
	console.log('sparta');
}
/*
stdin.on('keypress', function (chunk, key) {
  // if (key && key.ctrl && key.name == 'c') process.exit();
  if(chunk == 'a'){
  	shoulderPosition += 1;
  	shoulderServo.to(shoulderPosition);
  	console.log('move shoulder to '+ shoulderPosition);
  }
  if(chunk == 'o'){
  	shoulderPosition -= 1;
  	shoulderServo.to(shoulderPosition);
  	console.log('move shoulder to '+ shoulderPosition);
  }
  if(chunk == 'e'){
  	elbowPosition += 1;
  	elbowServo.to(elbowPosition);
  	console.log('move elbow to '+elbowPosition);
  }
  if(chunk == 'u'){
  	elbowPosition -= 1;
  	elbowServo.to(elbowPosition);
  	console.log('move elbow to '+elbowPosition);
  }
});
*/

function inverseValueE(x, y){
	var E = Math.acos( ( Math.pow(x, 2)+ Math.pow(y,2) - Math.pow(L1, 2) - Math.pow(L2,2) )/(2*L1*L2) );
	return E;

}

function inverseE(x,y){
	var E =  Math.acos( ( Math.pow(x, 2)+ Math.pow(y,2) - Math.pow(L1, 2) - Math.pow(L2,2) )/(2*L1*L2) );
	return toDegrees(E);
}
function inverseS(x,y){
	var S = Math.atan(y/x) - Math.acos( ( Math.pow(x,2)+Math.pow(y,2)+Math.pow(L1,2)-Math.pow(L2,2) )/( (2*L1 * Math.sqrt( Math.pow(x,2)+Math.pow(y,2) ) ) ) );
	return toDegrees(S);
}
function forwardX(S, E){
	S = toRadians(S);
	E = toRadians(E);
	var x = ( L1*Math.cos(S) ) + (L2 * Math.cos(S+E));
	
	return x;
}
function forwardY(S, E){
	S = toRadians(S);
	E = toRadians(E);
	var y = ( L1*Math.sin(S) ) + (L2 * Math.sin(S+E));
	return y;
}
function armMoveTo(x,y){
	var S = inverseS(x,y);
	var E = inverseE(x,y);
	console.log(S+','+E);
	shoulderServo.to(shoulderPosition+S);
	elbowServo.to(elbowPosition - E);
}
function toDegrees (angle) {
  return angle * (180 / Math.PI);
}
 
 function toRadians (angle) {
  return angle * (Math.PI / 180);
}

 