function Llave(x, y, imagen)
{
	Kinetic.Image.call(this);
	this.setWidth(30);
	this.setX(x);
	this.setY(y);
	this.setImage(imagen);
	this.setHeight(40);
}

Llave.prototype = Object.create(Kinetic.Image.prototype);