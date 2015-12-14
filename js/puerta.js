function Puerta(x,y,img){
	Kinetic.Image.call(this);
	this.setHeight(70);
	this.setX(x);
	this.setY(y);
	this.setImage(img);
}
Puerta.prototype = Object.create(Kinetic.Image.prototype);