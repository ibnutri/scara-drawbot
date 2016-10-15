var Kinematic  = {};
Kinematic.start = function(){
	this.elbowServo, shoulderServo = null;
	this.elbowOffset = 38;
	this.shoulderOffset = 7;
	this.elbowPosition = 90 + this.elbowOffset; 
	this.shoulderPosition = 90+ this.shoulderOffset;
	this.L1 = 7; // panjang bahu ke siku cm
	this.L2 = 7.5; // panjang siku ke pergelangan tangan dari cm
	this.drawX = 5;
	this.drawY = 5;	
};
Kinematic.inverseValueE = function(x, y){
	var E = Math.acos( ( Math.pow(x, 2)+ Math.pow(y,2) - Math.pow(this.L1, 2) - Math.pow(this.L2,2) )/(2*this.L1*this.L2) );
	return E;

}

Kinematic.inverseE = function(x,y){
	var E =  Math.acos( ( Math.pow(x, 2)+ Math.pow(y,2) - Math.pow(this.L1, 2) - Math.pow(this.L2,2) )/(2*this.L1*this.L2) );
	return this.toDegrees(E);
}
Kinematic.inverseS = function(x,y){
	var S = Math.atan(y/x) - Math.acos( ( Math.pow(x,2)+Math.pow(y,2)+Math.pow(this.L1,2)-Math.pow(this.L2,2) )/( (2*this.L1 * Math.sqrt( Math.pow(x,2)+Math.pow(y,2) ) ) ) );
	return this.toDegrees(S);
}
Kinematic.forwardX = function(S, E){
	S = this.toRadians(S);
	E = this.toRadians(E);
	var x = ( this.L1*Math.cos(S) ) + (this.L2 * Math.cos(S+E));
	
	return x;
}
Kinematic.forwardY = function(S, E){
	S = this.toRadians(S);
	E = this.toRadians(E);
	var y = ( this.L1*Math.sin(S) ) + (this.L2 * Math.sin(S+E));
	return y;
}
Kinematic.armMoveTo = function(x,y){
	console.log(x +','+ y);
	var S = this.inverseS(x,y);
	var E = this.inverseE(x,y);
	console.log(S+','+E);
	// shoulderServo.to(shoulderPosition+S);
	// elbowServo.to(elbowPosition - E);
	var returned = {
		shoulder: this.shoulderPosition + S,
		elbow: this.elbowPosition - E
	}
	return returned;
}
Kinematic.toDegrees = function (angle) {
  return angle * (180 / Math.PI);
}
 
Kinematic.toRadians = function (angle) {
  return angle * (Math.PI / 180);
}

module.exports = Kinematic;