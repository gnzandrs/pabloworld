function Plataforma(x, y, imagen) 
{
	Kinetic.Rect.call(this);
	this.setWidth(200);
	this.setHeight(40);
	this.setX(x);
	this.setY(y);
	this.setFillPatternImage(imagen); // textura
}

Plataforma.prototype = Object.create(Kinetic.Rect.prototype);