var stage, fondo, intv, personaje, grupoAssets, puntaje, imagenFondo;
var keyboard = { };
var b = false; // bandera para evitar rejecucion de nivel
var grav = 0.9; // gravedad
var val_reb = 0; // rebote en piso
var juego = new Game();

var imgEnemigo= new Image();
imgEnemigo.src = 'imgs/enemigo.png';

var imgPlataforma = new Image();
imgPlataforma.src = 'imgs/plataforma.png';

var imgFondo = new Image();
imgFondo.src = 'imgs/fondo.png';

var imgPuerta = new Image();
imgPuerta.src = 'imgs/puerta.png';

var imgLlave = new Image();
imgLlave.src = 'imgs/llave.png';

var imgHeroe = new Image();
imgHeroe.src = 'imgs/heroe.png';

var imgMoneda = new Image();
imgMoneda.src = 'imgs/moneda.png';

var imgPiso = new Image();
imgPiso.src = 'imgs/piso.png';


var framesP = {
	estatico: [{
		x: 3,
		y: 4,
		width: 58,
		height: 78
	},{
		x: 76,
		y: 4,
		width: 58,
		height: 78
	}],
	caminar: [{
		x:3,
		y:92,
		width: 57,
		height: 78
	}, {
		x:76,
		y:92,
		width: 58,
		height: 78
	}, {
		x:144,
		y:93,
		width:57,
		height: 77
	}, {
		x:221,
		y:92,
		width:58,
		height: 78
	}],
	saltar: [{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:148,
		y: 4,
		width: 53,
		height: 77
	},
	{
		x:212,
		y: 8,
		width: 54,
		height: 73
	},
	{
		x:212,
		y: 8,
		width: 54,
		height: 73
	}],
	caer: [{
		x:212,
		y: 8,
		width: 54,
		height: 73
	}]
};

grupoAssets = new Kinetic.Group({
	x: 0,
	y: 0
});

stage = new Kinetic.Stage({
	container: 'game',
	width: 900,
	height: 500
});

puntaje = new Kinetic.Text({
	text: 'Puntaje: 0',
	height: 25,
	width: 150,
	x:stage.getWidth()-150,
	y:15,
	fill: '#f7f7f7',
	fontFamily: 'Arial',
	fontSize: 20
});

imagenFondo = new Kinetic.Image({
	x: 0,
	y: 0,
	image: imgFondo,
	width: stage.getWidth(),
	height: stage.getHeight()
});

function nivelUno()
{
	if (b) return;
	b = true; // ejecutar la funcion solo una vez.
	juego.nivel = 1;
	juego.puntaje = 0;
	juego.llave = true; // en este nivel no necesita llave
	fondo = new Kinetic.Layer();

	/* Enemigos */
	grupoAssets.add(new Enemigo(200, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(850, stage.getHeight()/3.9-60, imgEnemigo));
	grupoAssets.add(new Enemigo(170, stage.getHeight()/3-60, imgEnemigo));
	grupoAssets.add(new Enemigo(1020, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(1120, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(1220, stage.getHeight()-75, imgEnemigo));

	/* Plataformas */
	var piso = new Plataforma(0, stage.getHeight()-15, imgPiso);
	piso.setWidth(stage.getWidth()*2);
	grupoAssets.add(piso);
	grupoAssets.add(new Plataforma(20,stage.getHeight()/1.5,imgPlataforma));
	grupoAssets.add(new Plataforma(190,stage.getHeight()/3,imgPlataforma));
	grupoAssets.add(new Plataforma(510,stage.getHeight()/1.6,imgPlataforma));
	grupoAssets.add(new Plataforma(870,stage.getHeight()/3.9,imgPlataforma));


	/*Monedas*/
	grupoAssets.add(new Moneda(350, stage.getHeight()/3-130, imgMoneda));
	grupoAssets.add(new Moneda(650, stage.getHeight()/2-130, imgMoneda));
	grupoAssets.add(new Moneda(80, stage.getHeight()-80, imgMoneda));
	grupoAssets.add(new Moneda(350, stage.getHeight()/3-130, imgMoneda));
	grupoAssets.add(new Moneda(910, stage.getHeight()/6, imgMoneda));
	grupoAssets.add(new Moneda(1220, stage.getHeight()-80, imgMoneda));

	/*Puerta*/
	grupoAssets.add(new Puerta(910, stage.getHeight()-85, imgPuerta));

	personaje = new Heroe(imgHeroe, framesP);
	personaje.setX(0);
	personaje.setY(stage.getHeight()-personaje.getHeight());
	personaje.limiteDer = stage.getWidth() - personaje.getWidth();
	personaje.limiteTope = stage.getHeight();
	fondo.add(imagenFondo);
	fondo.add(personaje); // añadir personaje
	fondo.add(grupoAssets); // añadir enemigos, plataformas y piso
	fondo.add(puntaje); // añadir puntaje
	personaje.start();
	stage.add(fondo);
	intv = setInterval(frameLoop, 1000/20); // 20 FPS
}

function nivelDos()
{
	fondo = new Kinetic.Layer();
	juego.llave = false; 

	/* Enemigos */
	grupoAssets.add(new Enemigo(200, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(850, stage.getHeight()/3.9-60, imgEnemigo));
	grupoAssets.add(new Enemigo(170, stage.getHeight()/3-60, imgEnemigo));
	grupoAssets.add(new Enemigo(1020, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(1120, stage.getHeight()-75, imgEnemigo));
	grupoAssets.add(new Enemigo(1220, stage.getHeight()-75, imgEnemigo));

	/* Plataformas */
	var piso = new Plataforma(0, stage.getHeight()-15, imgPiso);
	piso.setWidth(stage.getWidth()*2);
	grupoAssets.add(piso);
	grupoAssets.add(new Plataforma(20, stage.getHeight()/1.5, imgPlataforma));
	grupoAssets.add(new Plataforma(190, stage.attrs.height/3, imgPlataforma));
	grupoAssets.add(new Plataforma(590, stage.getHeight()-200, imgPlataforma));

	/*Monedas*/
	grupoAssets.add(new Moneda(350, stage.getHeight()/3-130, imgMoneda));
	grupoAssets.add(new Moneda(650, stage.getHeight()/2-130, imgMoneda));
	grupoAssets.add(new Moneda(80, stage.getHeight()-80, imgMoneda));
	grupoAssets.add(new Moneda(350, stage.getHeight()/3-130, imgMoneda));
	grupoAssets.add(new Moneda(910, stage.getHeight()/6,imgMoneda));
	grupoAssets.add(new Moneda(1220, stage.getHeight()-80, imgMoneda));

	/*Llave*/
	grupoAssets.add(new Llave(850, stage.getHeight()/3.9-60,imgLlave));

	/*Puerta*/
	grupoAssets.add(new Puerta(910, stage.getHeight()-85, imgPuerta));

	personaje = new Heroe(imgHeroe, framesP);
	personaje.setX(0);
	personaje.setY(stage.getHeight()-personaje.getHeight());
	personaje.limiteDer = stage.getWidth() - personaje.getWidth();
	personaje.limiteTope = stage.getHeight();
	fondo.add(imagenFondo);
	fondo.add(personaje); // añadir personaje
	fondo.add(grupoAssets); // añadir enemigos, plataformas y piso
	fondo.add(puntaje); // añadir puntaje
	personaje.start();
	stage.add(fondo);
	intv = setInterval(frameLoop, 1000/20); // 20 FPS
}

function moverPersonaje(){

	// si esta caminando, entonces no ejecutar denuevo
	if( personaje.getAnimation() != 'caminar' && (keyboard[37] || keyboard[39])){ 
		personaje.setAnimation('caminar'); 
	}
	if(keyboard[37]){
		personaje.retroceder();
	}
	if(keyboard[39]){
		personaje.caminar();
	}
	if(keyboard[38] && personaje.contador < 1){
		personaje.saltar();
	}
	// si no esta caminando, retrocediendo ni saltando, entonces esta estatico
	if (!(keyboard[39] || keyboard[38] || keyboard[37]) && !personaje.estaSaltando){
		personaje.setAnimation('estatico');
	}
}

function addKeyBoardEvents()
{

	addEvent(document, "keydown", function(e){
			keyboard[e.keyCode] = true;
		});

	addEvent(document, "keyup", function(e){
			keyboard[e.keyCode] = false;
		});


	function addEvent(element, eventName, func){
		//navegador
		if(element.addEventListener){
			element.addEventListener(eventName, func, false);			
		}
		else if (element.attachEvent)
		{
			element.attachEvent(eventName, func);
		}
	}
}

function hit(a,b)
{
	var hit = false;

	if(b.getX() + b.getWidth() >= a.getX()  && b.getX() < a.getX() + a.getWidth())
	{
		//colisiones verticales
		if(b.getY() + b.getHeight() >= a.getY() && b.getY() < a.getY() + a.getHeight())
		hit= true;
	}

	//colisiones de a con b
	if(b.getX() <= a.getX() && b.getX() + b.getWidth() >= a.getX() + a.getWidth() )
	{
		if(b.getY() <= a.getY() &&  b.getY() +  b.getHeight() >= a.getY() + a.getHeight())
		hit = true;
	}

	//Colision b con a
	if(a.getX() <= b.getX() && a.getX() + a.getWidth() >= b.getX() + b.getWidth() )
	{
		if(a.getY() <= b.getY() &&  a.getY() +  a.getHeight() >= b.getY() + b.getHeight())
		hit = true;
	}﻿ 

	return hit;
}

function moverFondo() 
{
	/* si el personaje pasa el centro de la pantalla se desplazan los assets a la izquierda
	y se le baja la velocidad a 2. */
	if (personaje.getX() > (stage.getWidth()/2) && keyboard[39])
	{
		personaje.vx = 2;

		for (i in grupoAssets.children) 
		{
			var asset = grupoAssets.children[i];

			// si el asset es el piso, verificar si el personaje llego al final
			if (asset instanceof Plataforma)
			{
				// si no ha llegado al final, entonces mover piso
				if (asset.getX() > (stage.getWidth()*-1))
				{
					asset.move(-5,0);
				}
				// si llego al final, no mover y cambiar la velocidad a normal
				else {
					personaje.vx = 10;
				}
			}
			// si el asset no es el piso, mover.
			else {
				asset.move(-5,0);
			}		
		}
	}
	else {
		personaje.vx = 10;
	}
}

function moverEnemigos()
{
	var enemigos = grupoAssets.children;

	for (i in enemigos) 
	{
		var enemigo = enemigos[i];
		// omitir todo lo que no sea enemigo
		if (enemigo instanceof Enemigo) 
			enemigo.mover();
	}
}

function aplicarFuerzas() 
{
	personaje.aplicarGravedad(grav, val_reb);
}

function detectarColPlataformas(){
	var plataformas = grupoAssets.children;

	for (i in plataformas){
		var plataforma = plataformas[i];
		if (hit(plataforma, personaje))
		{
			if (plataforma instanceof Enemigo){
				if (personaje.vy > 2 && personaje.getY() < plataforma.getY())
				{
					plataforma.remove();
					juego.puntaje += 5;
				}
				else {
					grupoAssets.removeChildren();
					document.querySelector('#perder').style.display = 'block';
					document.querySelector('#game').style.display = 'none';
					window.clearInterval(intv);
					b = false;
				}
			}

			else if(plataforma instanceof Plataforma && personaje.getY() < plataforma.getY() && personaje.vy >= 0)
			{
				personaje.contador = 0;
				personaje.setY(plataforma.getY() - personaje.getHeight());
				personaje.vy *= val_reb;
			}
			else if(plataforma instanceof Moneda)
			{
				plataforma.remove();
				juego.puntaje++;
			}
			else if(plataforma instanceof Llave)
			{
				plataforma.remove();
				juego.llave = true;
				continue; // saltar iteracion para pasar a siguiente plataforma
			}
			else if(plataforma instanceof Puerta && juego.llave)
			{
				if (juego.nivel == 1) 
				{
					grupoAssets.removeChildren();
					window.clearInterval(intv);
					juego.nivel = 2;
					nivelDos();
				}
					
				else if (juego.nivel == 2){
					grupoAssets.removeChildren();
					document.querySelector('#ganar').style.display = 'block';
					document.querySelector('#perder').style.display = 'none';
					document.querySelector('#game').style.display = 'none';
					document.querySelector('#puntaje').innerHTML = juego.puntaje;
					window.clearInterval(intv);
					b = false;
				}
			}
		}
	}
}

function actualizarTexto()
{
	puntaje.setText('Puntaje: ' + juego.puntaje);
}

addKeyBoardEvents();

function frameLoop(){
	moverPersonaje();
	detectarColPlataformas();
	actualizarTexto();
	moverFondo();
	aplicarFuerzas();
	moverEnemigos();
	stage.draw();
}