(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Kinetic = require('../kinetic-v4.3.2.min.js')

var Enemigo = function (x, y, imagen) {
  Kinetic.Image.call(this)
  this.setImage(imagen)
  this.setWidth(60)
  this.setHeight(60)
  this.setX(x)
  this.setY(y)
  this.contador = 0

  this.aleatorio = function (inferior, superior) {
    var posibilidades = superior - inferior
    var random = Math.random() * posibilidades
    random = Math.floor(random)
    return parseInt(inferior, 10) + random
  }

  this.mover = function () {
    this.contador++
    /* posicion actual del x se le aumenta el seno del contador x
    pi/50 el 50 y el ^5 no son necesarios pero definen la cantidad
    de espacio que se van a mover antes de regresar al punto en
    el que estaban de un lado al otro */
    this.setX(this.getX() + Math.sin(this.contador * Math.PI / 50) * 5)
  }
}

Enemigo.prototype = Object.create(Kinetic.Image.prototype)

module.exports = Enemigo

},{"../kinetic-v4.3.2.min.js":7}],2:[function(require,module,exports){
var Kinetic = require('../kinetic-v4.3.2.min.js')

var Punta = function (x, y, imagen) {
  Kinetic.Image.call(this)
  this.setImage(imagen)
  this.setWidth(25)
  this.setHeight(45)
  this.setX(x)
  this.setY(y)
  this.contador = 0

  this.aleatorio = function (inferior, superior) {
    var posibilidades = superior - inferior
    var random = Math.random() * posibilidades
    random = Math.floor(random)
    return parseInt(inferior, 10) + random
  }
}

Punta.prototype = Object.create(Kinetic.Image.prototype)

module.exports = Punta

},{"../kinetic-v4.3.2.min.js":7}],3:[function(require,module,exports){
var Kinetic = require('../kinetic-v4.3.2.min.js')

var PuntaA = function (x, y, imagen) {
  Kinetic.Image.call(this)
  this.setImage(imagen)
  this.setWidth(90)
  this.setHeight(50)
  this.setX(x)
  this.setY(y)
  this.contador = 0

  this.aleatorio = function (inferior, superior) {
    var posibilidades = superior - inferior
    var random = Math.random() * posibilidades
    random = Math.floor(random)
    return parseInt(inferior, 10) + random
  }
}

PuntaA.prototype = Object.create(Kinetic.Image.prototype)

module.exports = PuntaA

},{"../kinetic-v4.3.2.min.js":7}],4:[function(require,module,exports){
var Game = function () {
  this.estado = 'antes'
  this.puntaje = 0
  this.llave = false
  this.nivel = 1
}

module.exports = Game

},{}],5:[function(require,module,exports){
var Kinetic = require('./kinetic-v4.3.2.min.js')

var Heroe = function (imagen, animaciones) {
  Kinetic.Sprite.call(this)
  this.setWidth(58)
  this.setHeight(78)
  this.attrs.image = imagen
  this.setAnimations(animaciones)
  this.setAnimation('estatico')
  this.vx = 15
  this.vy = 0
  this.limiteDer = 0
  this.direccion = 1
  this.contador = 0
  this.attrs.frameRate = 10
  this.estaSaltando = false
  this.direccion = true
  this.animacion = false // si existe otra animacion corriendo

  this.caminar = function () {
    this.animacion = true
    this.setAnimation('caminar')
    this.afterFrame(3, function () {
      this.animacion = false
    })

    if (this.direccion) {
      this.move(this.vx, 0)
    } else {
      // volver funcion drawfunc a estado natural
      this.attrs.drawFunc = function (a) {
        var b = this.attrs.animation
        var c = this.attrs.index
        var d = this.attrs.animations[b][c]
        var e = a.getContext()
        var f = this.attrs.image
        f && e.drawImage(f, d.x, d.y, d.width, d.height, 0, 0, d.width, d.height)
      }
      this.setScale({x: 1})
      this.direccion = true
    }
    // si pasamos el limite derecho lo movemos de regreso al escenario
    if (this.getX() > this.limiteDer) {
      this.move(this.limiteDer - this.getX(), 0)
    }
  }

  this.retroceder = function () {
    this.animacion = true
    this.setAnimation('caminar')
    this.afterFrame(3, function () {
      this.animacion = false
    })

    if (!this.direccion) {
      this.move(-15, 0)
    } else {
      // redefinidir drawfunc para arreglar bug en plataforma al voltear personaje
      this.attrs.drawFunc = function (a) {
        var b = this.attrs.animation
        var c = this.attrs.index
        var d = this.attrs.animations[b][c]
        var e = a.getContext()
        var f = this.attrs.image
        f && e.drawImage(f, d.x, d.y, d.width, d.height, -d.width, 0, d.width, d.height)
      }
      this.setScale({x: -1})
      this.direccion = false
    }

    if (this.getX() < 0) {
      this.move(-this.getX(), 0)
    }
  }

  this.saltar = function () {
    this.estaSaltando = true

    if (this.vy <= 2) {
      // solo salta si esta en suelo
      this.setAnimation('saltar')
      this.vy = -20
      this.contador++
      this.afterFrame(9, function () {
        // this.estaSaltando = false;
        this.setAnimation('caer')
      })
      this.estaSaltando = false
    }
  }

  this.aplicarGravedad = function (gravedad, vRebote) {
    this.vy += gravedad
    this.move(0, this.vy)
    // al contacto con el piso se sostenga
    if ((this.getY() + this.getHeight()) > this.limiteTope) {
      this.setY(this.limiteTope - this.getHeight())
      this.vy = 0
      this.contador = 0 // para volver a saltar...
      this.setAnimation('estatico')
    }
  }
}

Heroe.prototype = Object.create(Kinetic.Sprite.prototype)

module.exports = Heroe

},{"./kinetic-v4.3.2.min.js":7}],6:[function(require,module,exports){
require('./preloadjs-0.1.0.min.js')
var Kinetic = require('./kinetic-v4.3.2.min.js')
var Game = require('./game.js')
var Heroe = require('./heroe.js')
var Enemigo = require('./enemigos/enemigo.js')
var Punta = require('./enemigos/punta.js')
var PuntaA = require('./enemigos/puntaa.js')
var Plataforma = require('./plataforma.js')
var Moneda = require('./moneda.js')
var Llave = require('./llave.js')
var Puerta = require('./puerta.js')

var Preloader

var imgsAssets = ['imgs/heroe.png',
  'imgs/enemigo.png',
  'imgs/punta.png',
  'imgs/monstruo_punta_a.png',
  'imgs/plataforma.png',
  'imgs/fondo.png',
  'imgs/llave.png',
  'imgs/moneda.png',
  'imgs/piso.png']

window.addEventListener('load', function () {
  Preloader = new PreloadJS()
  Preloader.onProgress = progresoCarga
  carga()
  var iniciadores = document.getElementsByClassName('start')

  for (var i in iniciadores) {
    var boton = iniciadores[i]
    if (boton.addEventListener) {
      boton.addEventListener('click', iniciarJuego)
    }
  }
})

function carga () {
  while (imgsAssets.length > 0) {
    var url = imgsAssets.shift()
    Preloader.loadFile(url)
  }
}

function progresoCarga () {
  if (Preloader.progress === 1) {
    document.querySelector('#info').style.display = 'block'
  }
}

function iniciarJuego () {
  document.querySelector('#info').style.display = 'none'
  document.querySelector('#perder').style.display = 'none'
  document.querySelector('#ganar').style.display = 'none'
  document.querySelector('#game').style.display = 'block'
  nivelUno()
}

// Main
var stage, fondo, intv, personaje, grupoAssets, puntaje, imagenFondo
var keyboard = { }
var b = false // bandera para evitar rejecucion de nivel
var grav = 1.1 // gravedad
var val_reb = 0 // rebote en piso
var juego = new Game()

/*eslint-disable */
var imgEnemigo = new Image()
imgEnemigo.src = 'imgs/enemigo.png'

var imgPunta = new Image()
imgPunta.src = 'imgs/punta.png'

var imgMonstruoPuntaA = new Image()
imgMonstruoPuntaA.src = 'imgs/monstruo_punta_a.png'

var imgPlataforma = new Image()
imgPlataforma.src = 'imgs/plataforma.png'

var imgFondo = new Image()
imgFondo.src = 'imgs/fondo.png'

var imgPuerta = new Image()
imgPuerta.src = 'imgs/puerta.png'

var imgLlave = new Image()
imgLlave.src = 'imgs/llave.png'

var imgHeroe = new Image()
imgHeroe.src = 'imgs/heroe.png'

var imgMoneda = new Image()
imgMoneda.src = 'imgs/moneda.png'

var imgPiso = new Image()
imgPiso.src = 'imgs/piso.png'
/*eslint-enable */

var framesP = {
  estatico: [{
    x: 3,
    y: 4,
    width: 58,
    height: 78
  }, {
    x: 76,
    y: 4,
    width: 58,
    height: 78
  }],
  caminar: [{
    x: 3,
    y: 92,
    width: 57,
    height: 78
  }, {
    x: 76,
    y: 92,
    width: 58,
    height: 78
  }, {
    x: 144,
    y: 93,
    width: 57,
    height: 77
  }, {
    x: 221,
    y: 92,
    width: 58,
    height: 78
  }],
  saltar: [{
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 148,
    y: 4,
    width: 53,
    height: 77
  }, {
    x: 212,
    y: 8,
    width: 54,
    height: 73
  }, {
    x: 212,
    y: 8,
    width: 54,
    height: 73
  }],
  caer: [{
    x: 212,
    y: 8,
    width: 54,
    height: 73
  }]
}

grupoAssets = new Kinetic.Group({
  x: 0,
  y: 0
})

stage = new Kinetic.Stage({
  container: 'game',
  width: 900,
  height: 500
})

puntaje = new Kinetic.Text({
  text: 'Puntaje: 0',
  height: 25,
  width: 150,
  x: stage.getWidth() - 150,
  y: 15,
  fill: '#f7f7f7',
  fontFamily: 'Arial',
  fontSize: 20
})

imagenFondo = new Kinetic.Image({
  x: 0,
  y: 0,
  image: imgFondo,
  width: stage.getWidth(),
  height: stage.getHeight()
})

function nivelUno () {
  if (b) return
  b = true // ejecutar la funcion solo una vez.
  juego.nivel = 1
  juego.puntaje = 0
  juego.llave = true // en este nivel no necesita llave
  fondo = new Kinetic.Layer()

  /* Enemigos */
  grupoAssets.add(new Enemigo(200, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(850, stage.getHeight() / 3.9 - 60, imgEnemigo))
  grupoAssets.add(new Enemigo(170, stage.getHeight() / 3 - 60, imgEnemigo))
  grupoAssets.add(new Enemigo(1020, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(1120, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(1220, stage.getHeight() / 1.6, imgEnemigo))
  grupoAssets.add(new PuntaA(540, stage.getHeight() / 1.9, imgMonstruoPuntaA))
  grupoAssets.add(new Punta(775, stage.getHeight() - 60, imgPunta))
  grupoAssets.add(new Punta(800, stage.getHeight() - 60, imgPunta))
  grupoAssets.add(new Punta(825, stage.getHeight() - 60, imgPunta))
  grupoAssets.add(new Punta(850, stage.getHeight() - 60, imgPunta))

  /* Plataformas */
  var piso = new Plataforma(0, stage.getHeight() - 15, imgPiso)
  piso.setWidth(stage.getWidth() * 2)
  grupoAssets.add(piso)
  grupoAssets.add(new Plataforma(20, stage.getHeight() / 1.5, imgPlataforma))
  grupoAssets.add(new Plataforma(190, stage.getHeight() / 3, imgPlataforma))
  grupoAssets.add(new Plataforma(510, stage.getHeight() / 1.6, imgPlataforma))
  grupoAssets.add(new Plataforma(870, stage.getHeight() / 3.9, imgPlataforma))

  /* Monedas */
  grupoAssets.add(new Moneda(350, stage.getHeight() / 3 - 130, imgMoneda))
  grupoAssets.add(new Moneda(650, stage.getHeight() / 2 - 130, imgMoneda))
  grupoAssets.add(new Moneda(80, stage.getHeight() - 80, imgMoneda))
  grupoAssets.add(new Moneda(350, stage.getHeight() / 3 - 130, imgMoneda))
  grupoAssets.add(new Moneda(910, stage.getHeight() / 6, imgMoneda))
  grupoAssets.add(new Moneda(1220, stage.getHeight() - 80, imgMoneda))

  /* Puerta */
  grupoAssets.add(new Puerta(910, stage.getHeight() - 85, imgPuerta))

  personaje = new Heroe(imgHeroe, framesP)
  personaje.setX(0)
  personaje.setY(stage.getHeight() - personaje.getHeight())
  personaje.limiteDer = stage.getWidth() - personaje.getWidth()
  personaje.limiteTope = stage.getHeight()
  fondo.add(imagenFondo)
  fondo.add(personaje) // añadir personaje
  fondo.add(grupoAssets) // añadir enemigos, plataformas y piso
  fondo.add(puntaje) // añadir puntaje
  personaje.start()
  stage.add(fondo)
  intv = setInterval(frameLoop, 1000 / 20) // 20 FPS
}

function nivelDos () {
  fondo = new Kinetic.Layer()
  juego.llave = false

  /* Enemigos */
  grupoAssets.add(new Enemigo(200, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(850, stage.getHeight() / 3.9 - 60, imgEnemigo))
  grupoAssets.add(new Enemigo(170, stage.getHeight() / 3 - 60, imgEnemigo))
  grupoAssets.add(new Enemigo(1020, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(1120, stage.getHeight() - 75, imgEnemigo))
  grupoAssets.add(new Enemigo(1220, stage.getHeight() - 75, imgEnemigo))

  /* Plataformas */
  var piso = new Plataforma(0, stage.getHeight() - 15, imgPiso)
  piso.setWidth(stage.getWidth() * 2)
  grupoAssets.add(piso)
  grupoAssets.add(new Plataforma(20, stage.getHeight() / 1.5, imgPlataforma))
  grupoAssets.add(new Plataforma(190, stage.attrs.height / 3, imgPlataforma))
  grupoAssets.add(new Plataforma(590, stage.getHeight() - 200, imgPlataforma))

  /* Monedas */
  grupoAssets.add(new Moneda(350, stage.getHeight() / 3 - 130, imgMoneda))
  grupoAssets.add(new Moneda(650, stage.getHeight() / 2 - 130, imgMoneda))
  grupoAssets.add(new Moneda(80, stage.getHeight() - 80, imgMoneda))
  grupoAssets.add(new Moneda(350, stage.getHeight() / 3 - 130, imgMoneda))
  grupoAssets.add(new Moneda(910, stage.getHeight() / 6, imgMoneda))
  grupoAssets.add(new Moneda(1220, stage.getHeight() - 80, imgMoneda))

  /* Llave */
  grupoAssets.add(new Llave(850, stage.getHeight() / 3.9 - 60, imgLlave))

  /* Puerta */
  grupoAssets.add(new Puerta(910, stage.getHeight() - 85, imgPuerta))

  personaje = new Heroe(imgHeroe, framesP)
  personaje.setX(0)
  personaje.setY(stage.getHeight() - personaje.getHeight())
  personaje.limiteDer = stage.getWidth() - personaje.getWidth()
  personaje.limiteTope = stage.getHeight()
  fondo.add(imagenFondo)
  fondo.add(personaje) // añadir personaje
  fondo.add(grupoAssets) // añadir enemigos, plataformas y piso
  fondo.add(puntaje) // añadir puntaje
  personaje.start()
  stage.add(fondo)
  intv = setInterval(frameLoop, 1000 / 20) // 20 FPS
}

function moverPersonaje () {
	// si esta caminando, entonces no ejecutar denuevo
  if (personaje.getAnimation() !== 'caminar' && (keyboard[37] || keyboard[39])) {
    personaje.setAnimation('caminar')
  }
  if (keyboard[37]) {
    personaje.retroceder()
  }
  if (keyboard[39]) {
    personaje.caminar()
  }
  if (keyboard[38] && personaje.contador < 1) {
    personaje.saltar()
  }
}

function addKeyBoardEvents () {
  addEvent(document, 'keydown', function (e) {
    keyboard[e.keyCode] = true
  })

  addEvent(document, 'keyup', function (e) {
    keyboard[e.keyCode] = false
  })

  function addEvent (element, eventName, func) {
    // navegador
    if (element.addEventListener) {
      element.addEventListener(eventName, func, false)
    } else if (element.attachEvent) {
      element.attachEvent(eventName, func)
    }
  }
}

function hit (a, b) {
  var hit = false

  if (b.getX() + b.getWidth() >= a.getX() && b.getX() < a.getX() + a.getWidth()) {
    // colisiones verticales
    if (b.getY() + b.getHeight() >= a.getY() && b.getY() < a.getY() + a.getHeight()) {
      hit = true
    }
  }

  // colisiones de a con b
  if (b.getX() <= a.getX() && b.getX() + b.getWidth() >= a.getX() + a.getWidth()) {
    if (b.getY() <= a.getY() && b.getY() + b.getHeight() >= a.getY() + a.getHeight()) {
      hit = true
    }
  }

  // colision b con a
  if (a.getX() <= b.getX() && a.getX() + a.getWidth() >= b.getX() + b.getWidth()) {
    if (a.getY() <= b.getY() && a.getY() + a.getHeight() >= b.getY() + b.getHeight()) {
      hit = true
    }
  }
  return hit
}

function moverFondo () {
  /* si el personaje pasa el centro de la pantalla se desplazan los assets a la izquierda
  y se le baja la velocidad a 2. */
  if (personaje.getX() > (stage.getWidth() / 2) && keyboard[39]) {
    personaje.vx = 2

    for (var i in grupoAssets.children) {
      var asset = grupoAssets.children[i]
      // si el asset es el piso, verificar si el personaje llego al final
      if (asset instanceof Plataforma) {
        // si no ha llegado al final, entonces mover piso
        if (asset.getX() > (stage.getWidth() * -1)) {
          asset.move(-5, 0)
        } else {  // si llego al final, no mover y cambiar la velocidad a normal
          personaje.vx = 10
        }
      } else { // si el asset no es el piso, mover.
        asset.move(-5, 0)
      }
    }
  } else {
    personaje.vx = 10
  }
}

function moverEnemigos () {
  var enemigos = grupoAssets.children

  for (var i in enemigos) {
    var enemigo = enemigos[i]
    // omitir todo lo que no sea enemigo
    if (enemigo instanceof Enemigo) {
      enemigo.mover()
    }
  }
}

function aplicarFuerzas () {
  personaje.aplicarGravedad(grav, val_reb)
}

function detectarColPlataformas () {
  var plataformas = grupoAssets.children

  for (var i in plataformas) {
    var plataforma = plataformas[i]
    if (hit(plataforma, personaje)) {
      if (plataforma instanceof Enemigo) {
        if (personaje.vy > 2 && personaje.getY() < plataforma.getY()) {
          plataforma.remove()
          juego.puntaje += 5
        } else {
          grupoAssets.removeChildren()
          document.querySelector('#perder').style.display = 'block'
          document.querySelector('#game').style.display = 'none'
          window.clearInterval(intv)
          b = false
        }
      }

      if (plataforma instanceof PuntaA) {
        grupoAssets.removeChildren()
        document.querySelector('#perder').style.display = 'block'
        document.querySelector('#game').style.display = 'none'
        window.clearInterval(intv)
        b = false
      }

      if (plataforma instanceof Punta) {
        grupoAssets.removeChildren()
        document.querySelector('#perder').style.display = 'block'
        document.querySelector('#game').style.display = 'none'
        window.clearInterval(intv)
        b = false
      } else if (plataforma instanceof Plataforma && personaje.getY() < plataforma.getY() && personaje.vy >= 0) {
        personaje.contador = 0
        personaje.setY(plataforma.getY() - personaje.getHeight())
        personaje.vy *= val_reb
        if (personaje.animacion == false)
        {
          personaje.setAnimation('estatico')
        }
      } else if (plataforma instanceof Moneda) {
        plataforma.remove()
        juego.puntaje++
      } else if (plataforma instanceof Llave) {
        plataforma.remove()
        juego.llave = true
        continue // saltar iteracion para pasar a siguiente plataforma
      } else if (plataforma instanceof Puerta && juego.llave) {
        if (juego.nivel === 1) {
          grupoAssets.removeChildren()
          window.clearInterval(intv)
          juego.nivel = 2
          nivelDos()
        } else if (juego.nivel === 2) {
          grupoAssets.removeChildren()
          document.querySelector('#ganar').style.display = 'block'
          document.querySelector('#perder').style.display = 'none'
          document.querySelector('#game').style.display = 'none'
          document.querySelector('#puntaje').innerHTML = juego.puntaje
          window.clearInterval(intv)
          b = false
        }
      }
    }
  }
}

function actualizarTexto () {
  puntaje.setText('Puntaje: ' + juego.puntaje)
}

addKeyBoardEvents()

function frameLoop () {
  moverPersonaje()
  detectarColPlataformas()
  actualizarTexto()
  moverFondo()
  aplicarFuerzas()
  moverEnemigos()
  stage.draw()
}

},{"./enemigos/enemigo.js":1,"./enemigos/punta.js":2,"./enemigos/puntaa.js":3,"./game.js":4,"./heroe.js":5,"./kinetic-v4.3.2.min.js":7,"./llave.js":8,"./moneda.js":9,"./plataforma.js":10,"./preloadjs-0.1.0.min.js":11,"./puerta.js":12}],7:[function(require,module,exports){
/**
 * KineticJS JavaScript Framework v4.3.2
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Jan 30 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic={};(function(){Kinetic.version="4.3.2",Kinetic.Filters={},Kinetic.Plugins={},Kinetic.Global={stages:[],idCounter:0,ids:{},names:{},shapes:{},warn:function(a){window.console&&console.warn&&console.warn("Kinetic warning: "+a)},extend:function(a,b){for(var c in b.prototype)c in a.prototype||(a.prototype[c]=b.prototype[c])},_addId:function(a,b){b!==undefined&&(this.ids[b]=a)},_removeId:function(a){a!==undefined&&delete this.ids[a]},_addName:function(a,b){b!==undefined&&(this.names[b]===undefined&&(this.names[b]=[]),this.names[b].push(a))},_removeName:function(a,b){if(a!==undefined){var c=this.names[a];if(c!==undefined){for(var d=0;d<c.length;d++){var e=c[d];e._id===b&&c.splice(d,1)}c.length===0&&delete this.names[a]}}}}})(),function(a,b){typeof exports=="object"?module.exports=b():typeof define=="function"&&define.amd?define(b):a.returnExports=b()}(this,function(){return Kinetic}),function(){Kinetic.Type={_isElement:function(a){return!!a&&a.nodeType==1},_isFunction:function(a){return!!(a&&a.constructor&&a.call&&a.apply)},_isObject:function(a){return!!a&&a.constructor==Object},_isArray:function(a){return Object.prototype.toString.call(a)=="[object Array]"},_isNumber:function(a){return Object.prototype.toString.call(a)=="[object Number]"},_isString:function(a){return Object.prototype.toString.call(a)=="[object String]"},_hasMethods:function(a){var b=[];for(var c in a)this._isFunction(a[c])&&b.push(c);return b.length>0},_isInDocument:function(a){while(a=a.parentNode)if(a==document)return!0;return!1},_getXY:function(a){if(this._isNumber(a))return{x:a,y:a};if(this._isArray(a)){if(a.length===1){var b=a[0];if(this._isNumber(b))return{x:b,y:b};if(this._isArray(b))return{x:b[0],y:b[1]};if(this._isObject(b))return b}else if(a.length>=2)return{x:a[0],y:a[1]}}else if(this._isObject(a))return a;return null},_getSize:function(a){if(this._isNumber(a))return{width:a,height:a};if(this._isArray(a))if(a.length===1){var b=a[0];if(this._isNumber(b))return{width:b,height:b};if(this._isArray(b)){if(b.length>=4)return{width:b[2],height:b[3]};if(b.length>=2)return{width:b[0],height:b[1]}}else if(this._isObject(b))return b}else{if(a.length>=4)return{width:a[2],height:a[3]};if(a.length>=2)return{width:a[0],height:a[1]}}else if(this._isObject(a))return a;return null},_getPoints:function(a){if(a===undefined)return[];if(this._isArray(a[0])){var b=[];for(var c=0;c<a.length;c++)b.push({x:a[c][0],y:a[c][1]});return b}if(this._isObject(a[0]))return a;var b=[];for(var c=0;c<a.length;c+=2)b.push({x:a[c],y:a[c+1]});return b},_getImage:function(a,b){if(!a)b(null);else if(this._isElement(a))b(a);else if(this._isString(a)){var c=new Image;c.onload=function(){b(c)},c.src=a}else if(a.data){var d=document.createElement("canvas");d.width=a.width,d.height=a.height;var e=d.getContext("2d");e.putImageData(a,0,0);var f=d.toDataURL(),c=new Image;c.onload=function(){b(c)},c.src=f}else b(null)},_rgbToHex:function(a,b,c){return((1<<24)+(a<<16)+(b<<8)+c).toString(16).slice(1)},_hexToRgb:function(a){var b=parseInt(a,16);return{r:b>>16&255,g:b>>8&255,b:b&255}},_getRandomColorKey:function(){var a=Math.round(Math.random()*255),b=Math.round(Math.random()*255),c=Math.round(Math.random()*255);return this._rgbToHex(a,b,c)},_merge:function(a,b){var c=this._clone(b);for(var d in a)this._isObject(a[d])?c[d]=this._merge(a[d],c[d]):c[d]=a[d];return c},_clone:function(a){var b={};for(var c in a)this._isObject(a[c])?b[c]=this._clone(a[c]):b[c]=a[c];return b},_degToRad:function(a){return a*Math.PI/180},_radToDeg:function(a){return a*180/Math.PI}}}(),function(){Kinetic.Canvas=function(a,b){this.width=a,this.height=b,this.element=document.createElement("canvas"),this.context=this.element.getContext("2d"),this.setSize(a||0,b||0)};var a=document.createElement("canvas"),b=a.getContext("2d"),c=window.devicePixelRatio||1,d=b.webkitBackingStorePixelRatio||b.mozBackingStorePixelRatio||b.msBackingStorePixelRatio||b.oBackingStorePixelRatio||b.backingStorePixelRatio||1;Kinetic.Canvas.pixelRatio=c/d,Kinetic.Canvas.prototype={clear:function(){var a=this.getContext(),b=this.getElement();a.clearRect(0,0,b.width,b.height)},getElement:function(){return this.element},getContext:function(){return this.context},setWidth:function(a){this.width=a,this.element.width=a*Kinetic.Canvas.pixelRatio,this.element.style.width=a+"px"},setHeight:function(a){this.height=a,this.element.height=a*Kinetic.Canvas.pixelRatio,this.element.style.height=a+"px"},getWidth:function(){return this.width},getHeight:function(){return this.height},setSize:function(a,b){this.setWidth(a),this.setHeight(b)},toDataURL:function(a,b){try{return this.element.toDataURL(a,b)}catch(c){try{return this.element.toDataURL()}catch(c){return Kinetic.Global.warn("Unable to get data URL. "+c.message),""}}},fill:function(a){a.getFillEnabled()&&this._fill(a)},stroke:function(a){a.getStrokeEnabled()&&this._stroke(a)},fillStroke:function(a){var b=a.getFillEnabled();b&&this._fill(a),a.getStrokeEnabled()&&this._stroke(a,a.hasShadow()&&a.hasFill()&&b)},applyShadow:function(a,b){var c=this.context;c.save(),this._applyShadow(a),b(),c.restore(),b()},_applyLineCap:function(a){var b=a.getLineCap();b&&(this.context.lineCap=b)},_applyOpacity:function(a){var b=a.getAbsoluteOpacity();b!==1&&(this.context.globalAlpha=b)},_applyLineJoin:function(a){var b=a.getLineJoin();b&&(this.context.lineJoin=b)},_handlePixelRatio:function(){var a=Kinetic.Canvas.pixelRatio;a!==1&&this.getContext().scale(a,a)},_counterPixelRatio:function(){var a=Kinetic.Canvas.pixelRatio;a!==1&&(a=1/a,this.getContext().scale(a,a))},_applyAncestorTransforms:function(a){var b=this.context;a._eachAncestorReverse(function(a){var c=a.getTransform(),d=c.getMatrix();b.transform(d[0],d[1],d[2],d[3],d[4],d[5])},!0)}},Kinetic.SceneCanvas=function(a,b){Kinetic.Canvas.call(this,a,b)},Kinetic.SceneCanvas.prototype={_fillColor:function(a){var b=this.context,c=a.getFill();b.fillStyle=c,a._fillFunc(b)},_fillPattern:function(a){var b=this.context,c=a.getFillPatternImage(),d=a.getFillPatternX(),e=a.getFillPatternY(),f=a.getFillPatternScale(),g=a.getFillPatternRotation(),h=a.getFillPatternOffset(),i=a.getFillPatternRepeat();(d||e)&&b.translate(d||0,e||0),g&&b.rotate(g),f&&b.scale(f.x,f.y),h&&b.translate(-1*h.x,-1*h.y),b.fillStyle=b.createPattern(c,i||"repeat"),b.fill()},_fillLinearGradient:function(a){var b=this.context,c=a.getFillLinearGradientStartPoint(),d=a.getFillLinearGradientEndPoint(),e=a.getFillLinearGradientColorStops(),f=b.createLinearGradient(c.x,c.y,d.x,d.y);for(var g=0;g<e.length;g+=2)f.addColorStop(e[g],e[g+1]);b.fillStyle=f,b.fill()},_fillRadialGradient:function(a){var b=this.context,c=a.getFillRadialGradientStartPoint(),d=a.getFillRadialGradientEndPoint(),e=a.getFillRadialGradientStartRadius(),f=a.getFillRadialGradientEndRadius(),g=a.getFillRadialGradientColorStops(),h=b.createRadialGradient(c.x,c.y,e,d.x,d.y,f);for(var i=0;i<g.length;i+=2)h.addColorStop(g[i],g[i+1]);b.fillStyle=h,b.fill()},_fill:function(a,b){var c=this.context,d=a.getFill(),e=a.getFillPatternImage(),f=a.getFillLinearGradientStartPoint(),g=a.getFillRadialGradientStartPoint(),h=a.getFillPriority();c.save(),!b&&a.hasShadow()&&this._applyShadow(a),d&&h==="color"?this._fillColor(a):e&&h==="pattern"?this._fillPattern(a):f&&h==="linear-gradient"?this._fillLinearGradient(a):g&&h==="radial-gradient"?this._fillRadialGradient(a):d?this._fillColor(a):e?this._fillPattern(a):f?this._fillLinearGradient(a):g&&this._fillRadialGradient(a),c.restore(),!b&&a.hasShadow()&&this._fill(a,!0)},_stroke:function(a,b){var c=this.context,d=a.getStroke(),e=a.getStrokeWidth(),f=a.getDashArray();if(d||e)c.save(),this._applyLineCap(a),f&&a.getDashArrayEnabled()&&(c.setLineDash?c.setLineDash(f):"mozDash"in c?c.mozDash=f:"webkitLineDash"in c&&(c.webkitLineDash=f)),!b&&a.hasShadow()&&this._applyShadow(a),c.lineWidth=e||2,c.strokeStyle=d||"black",a._strokeFunc(c),c.restore(),!b&&a.hasShadow()&&this._stroke(a,!0)},_applyShadow:function(a){var b=this.context;if(a.hasShadow()&&a.getShadowEnabled()){var c=a.getAbsoluteOpacity(),d=a.getShadowColor()||"black",e=a.getShadowBlur()||5,f=a.getShadowOffset()||{x:0,y:0};a.getShadowOpacity()&&(b.globalAlpha=a.getShadowOpacity()*c),b.shadowColor=d,b.shadowBlur=e,b.shadowOffsetX=f.x,b.shadowOffsetY=f.y}}},Kinetic.Global.extend(Kinetic.SceneCanvas,Kinetic.Canvas),Kinetic.HitCanvas=function(a,b){Kinetic.Canvas.call(this,a,b)},Kinetic.HitCanvas.prototype={_fill:function(a){var b=this.context;b.save(),b.fillStyle="#"+a.colorKey,a._fillFunc(b),b.restore()},_stroke:function(a){var b=this.context,c=a.getStroke(),d=a.getStrokeWidth();if(c||d)this._applyLineCap(a),b.save(),b.lineWidth=d||2,b.strokeStyle="#"+a.colorKey,a._strokeFunc(b),b.restore()}},Kinetic.Global.extend(Kinetic.HitCanvas,Kinetic.Canvas)}(),function(){Kinetic.Tween=function(a,b,c,d,e,f){this._listeners=[],this.addListener(this),this.obj=a,this.propFunc=b,this.begin=d,this._pos=d,this.setDuration(f),this.isPlaying=!1,this._change=0,this.prevTime=0,this.prevPos=0,this.looping=!1,this._time=0,this._position=0,this._startTime=0,this._finish=0,this.name="",this.func=c,this.setFinish(e)},Kinetic.Tween.prototype={setTime:function(a){this.prevTime=this._time,a>this.getDuration()?this.looping?(this.rewind(a-this._duration),this.update(),this.broadcastMessage("onLooped",{target:this,type:"onLooped"})):(this._time=this._duration,this.update(),this.stop(),this.broadcastMessage("onFinished",{target:this,type:"onFinished"})):a<0?(this.rewind(),this.update()):(this._time=a,this.update())},getTime:function(){return this._time},setDuration:function(a){this._duration=a===null||a<=0?1e5:a},getDuration:function(){return this._duration},setPosition:function(a){this.prevPos=this._pos,this.propFunc(a),this._pos=a,this.broadcastMessage("onChanged",{target:this,type:"onChanged"})},getPosition:function(a){return a===undefined&&(a=this._time),this.func(a,this.begin,this._change,this._duration)},setFinish:function(a){this._change=a-this.begin},getFinish:function(){return this.begin+this._change},start:function(){this.rewind(),this.startEnterFrame(),this.broadcastMessage("onStarted",{target:this,type:"onStarted"})},rewind:function(a){this.stop(),this._time=a===undefined?0:a,this.fixTime(),this.update()},fforward:function(){this._time=this._duration,this.fixTime(),this.update()},update:function(){this.setPosition(this.getPosition(this._time))},startEnterFrame:function(){this.stopEnterFrame(),this.isPlaying=!0,this.onEnterFrame()},onEnterFrame:function(){this.isPlaying&&this.nextFrame()},nextFrame:function(){this.setTime((this.getTimer()-this._startTime)/1e3)},stop:function(){this.stopEnterFrame(),this.broadcastMessage("onStopped",{target:this,type:"onStopped"})},stopEnterFrame:function(){this.isPlaying=!1},continueTo:function(a,b){this.begin=this._pos,this.setFinish(a),this._duration!==undefined&&this.setDuration(b),this.start()},resume:function(){this.fixTime(),this.startEnterFrame(),this.broadcastMessage("onResumed",{target:this,type:"onResumed"})},yoyo:function(){this.continueTo(this.begin,this._time)},addListener:function(a){return this.removeListener(a),this._listeners.push(a)},removeListener:function(a){var b=this._listeners,c=b.length;while(c--)if(b[c]==a)return b.splice(c,1),!0;return!1},broadcastMessage:function(){var a=[];for(var b=0;b<arguments.length;b++)a.push(arguments[b]);var c=a.shift(),d=this._listeners,e=d.length;for(var b=0;b<e;b++)d[b][c]&&d[b][c].apply(d[b],a)},fixTime:function(){this._startTime=this.getTimer()-this._time*1e3},getTimer:function(){return(new Date).getTime()-this._time}},Kinetic.Tweens={"back-ease-in":function(a,b,c,d,e,f){var g=1.70158;return c*(a/=d)*a*((g+1)*a-g)+b},"back-ease-out":function(a,b,c,d,e,f){var g=1.70158;return c*((a=a/d-1)*a*((g+1)*a+g)+1)+b},"back-ease-in-out":function(a,b,c,d,e,f){var g=1.70158;return(a/=d/2)<1?c/2*a*a*(((g*=1.525)+1)*a-g)+b:c/2*((a-=2)*a*(((g*=1.525)+1)*a+g)+2)+b},"elastic-ease-in":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d)==1?b+c:(f||(f=d*.3),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),-(e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f))+b)},"elastic-ease-out":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d)==1?b+c:(f||(f=d*.3),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),e*Math.pow(2,-10*a)*Math.sin((a*d-g)*2*Math.PI/f)+c+b)},"elastic-ease-in-out":function(a,b,c,d,e,f){var g=0;return a===0?b:(a/=d/2)==2?b+c:(f||(f=d*.3*1.5),!e||e<Math.abs(c)?(e=c,g=f/4):g=f/(2*Math.PI)*Math.asin(c/e),a<1?-0.5*e*Math.pow(2,10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)+b:e*Math.pow(2,-10*(a-=1))*Math.sin((a*d-g)*2*Math.PI/f)*.5+c+b)},"bounce-ease-out":function(a,b,c,d){return(a/=d)<1/2.75?c*7.5625*a*a+b:a<2/2.75?c*(7.5625*(a-=1.5/2.75)*a+.75)+b:a<2.5/2.75?c*(7.5625*(a-=2.25/2.75)*a+.9375)+b:c*(7.5625*(a-=2.625/2.75)*a+.984375)+b},"bounce-ease-in":function(a,b,c,d){return c-Kinetic.Tweens["bounce-ease-out"](d-a,0,c,d)+b},"bounce-ease-in-out":function(a,b,c,d){return a<d/2?Kinetic.Tweens["bounce-ease-in"](a*2,0,c,d)*.5+b:Kinetic.Tweens["bounce-ease-out"](a*2-d,0,c,d)*.5+c*.5+b},"ease-in":function(a,b,c,d){return c*(a/=d)*a+b},"ease-out":function(a,b,c,d){return-c*(a/=d)*(a-2)+b},"ease-in-out":function(a,b,c,d){return(a/=d/2)<1?c/2*a*a+b:-c/2*(--a*(a-2)-1)+b},"strong-ease-in":function(a,b,c,d){return c*(a/=d)*a*a*a*a+b},"strong-ease-out":function(a,b,c,d){return c*((a=a/d-1)*a*a*a*a+1)+b},"strong-ease-in-out":function(a,b,c,d){return(a/=d/2)<1?c/2*a*a*a*a*a+b:c/2*((a-=2)*a*a*a*a+2)+b},linear:function(a,b,c,d){return c*a/d+b}}}(),function(){Kinetic.Transform=function(){this.m=[1,0,0,1,0,0]},Kinetic.Transform.prototype={translate:function(a,b){this.m[4]+=this.m[0]*a+this.m[2]*b,this.m[5]+=this.m[1]*a+this.m[3]*b},scale:function(a,b){this.m[0]*=a,this.m[1]*=a,this.m[2]*=b,this.m[3]*=b},rotate:function(a){var b=Math.cos(a),c=Math.sin(a),d=this.m[0]*b+this.m[2]*c,e=this.m[1]*b+this.m[3]*c,f=this.m[0]*-c+this.m[2]*b,g=this.m[1]*-c+this.m[3]*b;this.m[0]=d,this.m[1]=e,this.m[2]=f,this.m[3]=g},getTranslation:function(){return{x:this.m[4],y:this.m[5]}},multiply:function(a){var b=this.m[0]*a.m[0]+this.m[2]*a.m[1],c=this.m[1]*a.m[0]+this.m[3]*a.m[1],d=this.m[0]*a.m[2]+this.m[2]*a.m[3],e=this.m[1]*a.m[2]+this.m[3]*a.m[3],f=this.m[0]*a.m[4]+this.m[2]*a.m[5]+this.m[4],g=this.m[1]*a.m[4]+this.m[3]*a.m[5]+this.m[5];this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},invert:function(){var a=1/(this.m[0]*this.m[3]-this.m[1]*this.m[2]),b=this.m[3]*a,c=-this.m[1]*a,d=-this.m[2]*a,e=this.m[0]*a,f=a*(this.m[2]*this.m[5]-this.m[3]*this.m[4]),g=a*(this.m[1]*this.m[4]-this.m[0]*this.m[5]);this.m[0]=b,this.m[1]=c,this.m[2]=d,this.m[3]=e,this.m[4]=f,this.m[5]=g},getMatrix:function(){return this.m}}}(),function(){Kinetic.Collection=function(){var a=[].slice.call(arguments),b=a.length,c=0;this.length=b;for(;c<b;c++)this[c]=a[c];return this},Kinetic.Collection.prototype=new Array,Kinetic.Collection.prototype.apply=function(a){args=[].slice.call(arguments),args.shift();for(var b=0;b<this.length;b++)Kinetic.Type._isFunction(this[b][a])&&this[b][a].apply(this[b],args)},Kinetic.Collection.prototype.each=function(a){for(var b=0;b<this.length;b++)a.call(this[b],b,this[b])}}(),function(){Kinetic.Filters.Grayscale=function(a,b){var c=a.data;for(var d=0;d<c.length;d+=4){var e=.34*c[d]+.5*c[d+1]+.16*c[d+2];c[d]=e,c[d+1]=e,c[d+2]=e}}}(),function(){Kinetic.Filters.Brighten=function(a,b){var c=b.val||0,d=a.data;for(var e=0;e<d.length;e+=4)d[e]+=c,d[e+1]+=c,d[e+2]+=c}}(),function(){Kinetic.Filters.Invert=function(a,b){var c=a.data;for(var d=0;d<c.length;d+=4)c[d]=255-c[d],c[d+1]=255-c[d+1],c[d+2]=255-c[d+2]}}(),function(){Kinetic.Node=function(a){this._nodeInit(a)},Kinetic.Node.prototype={_nodeInit:function(a){this._id=Kinetic.Global.idCounter++,this.defaultNodeAttrs={visible:!0,listening:!0,name:undefined,opacity:1,x:0,y:0,scale:{x:1,y:1},rotation:0,offset:{x:0,y:0},draggable:!1,dragOnTop:!0},this.setDefaultAttrs(this.defaultNodeAttrs),this.eventListeners={},this.setAttrs(a)},on:function(a,b){var c=a.split(" "),d=c.length;for(var e=0;e<d;e++){var f=c[e],g=f,h=g.split("."),i=h[0],j=h.length>1?h[1]:"";this.eventListeners[i]||(this.eventListeners[i]=[]),this.eventListeners[i].push({name:j,handler:b})}},off:function(a){var b=a.split(" "),c=b.length;for(var d=0;d<c;d++){var e=b[d],f=e,g=f.split("."),h=g[0];if(g.length>1)if(h)this.eventListeners[h]&&this._off(h,g[1]);else for(var e in this.eventListeners)this._off(e,g[1]);else delete this.eventListeners[h]}},remove:function(){var a=this.getParent();a&&a.children&&(a.children.splice(this.index,1),a._setChildrenIndices()),delete this.parent},destroy:function(){var a=this.getParent(),b=this.getStage(),c=Kinetic.DD,d=Kinetic.Global;while(this.children&&this.children.length>0)this.children[0].destroy();d._removeId(this.getId()),d._removeName(this.getName(),this._id),c&&c.node&&c.node._id===this._id&&node._endDrag(),this.trans&&this.trans.stop(),this.remove()},getAttrs:function(){return this.attrs},setDefaultAttrs:function(a){this.attrs===undefined&&(this.attrs={});if(a)for(var b in a)this.attrs[b]===undefined&&(this.attrs[b]=a[b])},setAttrs:function(a){if(a)for(var b in a){var c="set"+b.charAt(0).toUpperCase()+b.slice(1);Kinetic.Type._isFunction(this[c])?this[c](a[b]):this.setAttr(b,a[b])}},getVisible:function(){var a=this.attrs.visible,b=this.getParent();return a&&b&&!b.getVisible()?!1:a},getListening:function(){var a=this.attrs.listening,b=this.getParent();return a&&b&&!b.getListening()?!1:a},show:function(){this.setVisible(!0)},hide:function(){this.setVisible(!1)},getZIndex:function(){return this.index},getAbsoluteZIndex:function(){function e(b){var f=[],g=b.length;for(var h=0;h<g;h++){var i=b[h];d++,i.nodeType!=="Shape"&&(f=f.concat(i.getChildren())),i._id===c._id&&(h=g)}f.length>0&&f[0].getLevel()<=a&&e(f)}var a=this.getLevel(),b=this.getStage(),c=this,d=0;return c.nodeType!=="Stage"&&e(c.getStage().getChildren()),d},getLevel:function(){var a=0,b=this.parent;while(b)a++,b=b.parent;return a},setPosition:function(){var a=Kinetic.Type._getXY([].slice.call(arguments));this.setAttr("x",a.x),this.setAttr("y",a.y)},getPosition:function(){var a=this.attrs;return{x:a.x,y:a.y}},getAbsolutePosition:function(){var a=this.getAbsoluteTransform(),b=this.getOffset();return a.translate(b.x,b.y),a.getTranslation()},setAbsolutePosition:function(){var a=Kinetic.Type._getXY([].slice.call(arguments)),b=this._clearTransform();this.attrs.x=b.x,this.attrs.y=b.y,delete b.x,delete b.y;var c=this.getAbsoluteTransform();c.invert(),c.translate(a.x,a.y),a={x:this.attrs.x+c.getTranslation().x,y:this.attrs.y+c.getTranslation().y},this.setPosition(a.x,a.y),this._setTransform(b)},move:function(){var a=Kinetic.Type._getXY([].slice.call(arguments)),b=this.getX(),c=this.getY();a.x!==undefined&&(b+=a.x),a.y!==undefined&&(c+=a.y),this.setPosition(b,c)},_eachAncestorReverse:function(a,b){var c=[],d=this.getParent();b&&c.unshift(this);while(d)c.unshift(d),d=d.parent;var e=c.length;for(var f=0;f<e;f++)a(c[f])},rotate:function(a){this.setRotation(this.getRotation()+a)},rotateDeg:function(a){this.setRotation(this.getRotation()+Kinetic.Type._degToRad(a))},moveToTop:function(){var a=this.index;return this.parent.children.splice(a,1),this.parent.children.push(this),this.parent._setChildrenIndices(),!0},moveUp:function(){var a=this.index,b=this.parent.getChildren().length;if(a<b-1)return this.parent.children.splice(a,1),this.parent.children.splice(a+1,0,this),this.parent._setChildrenIndices(),!0},moveDown:function(){var a=this.index;if(a>0)return this.parent.children.splice(a,1),this.parent.children.splice(a-1,0,this),this.parent._setChildrenIndices(),!0},moveToBottom:function(){var a=this.index;if(a>0)return this.parent.children.splice(a,1),this.parent.children.unshift(this),this.parent._setChildrenIndices(),!0},setZIndex:function(a){var b=this.index;this.parent.children.splice(b,1),this.parent.children.splice(a,0,this),this.parent._setChildrenIndices()},getAbsoluteOpacity:function(){var a=this.getOpacity();return this.getParent()&&(a*=this.getParent().getAbsoluteOpacity()),a},moveTo:function(a){Kinetic.Node.prototype.remove.call(this),a.add(this)},toObject:function(){var a=Kinetic.Type,b={},c=this.attrs;b.attrs={};for(var d in c){var e=c[d];!a._isFunction(e)&&!a._isElement(e)&&(!a._isObject(e)||!a._hasMethods(e))&&(b.attrs[d]=e)}return b.nodeType=this.nodeType,b.shapeType=this.shapeType,b},toJSON:function(){return JSON.stringify(this.toObject())},getParent:function(){return this.parent},getLayer:function(){return this.getParent().getLayer()},getStage:function(){return this.getParent()?this.getParent().getStage():undefined},simulate:function(a,b){this._handleEvent(a,b||{})},fire:function(a,b){this._executeHandlers(a,b||{})},getAbsoluteTransform:function(){var a=new Kinetic.Transform;return this._eachAncestorReverse(function(b){var c=b.getTransform();a.multiply(c)},!0),a},getTransform:function(){var a=new Kinetic.Transform,b=this.attrs,c=b.x,d=b.y,e=b.rotation,f=b.scale,g=f.x,h=f.y,i=b.offset,j=i.x,k=i.y;return(c!==0||d!==0)&&a.translate(c,d),e!==0&&a.rotate(e),(g!==1||h!==1)&&a.scale(g,h),(j!==0||k!==0)&&a.translate(-1*j,-1*k),a},clone:function(a){var b=this.shapeType||this.nodeType,c=new Kinetic[b](this.attrs);for(var d in this.eventListeners){var e=this.eventListeners[d],f=e.length;for(var g=0;g<f;g++){var h=e[g];h.name.indexOf("kinetic")<0&&(c.eventListeners[d]||(c.eventListeners[d]=[]),c.eventListeners[d].push(h))}}return c.setAttrs(a),c},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d,e,f=a.x||0,g=a.y||0;return a.width&&a.height?d=new Kinetic.SceneCanvas(a.width,a.height):(d=this.getStage().bufferCanvas,d.clear()),e=d.getContext(),e.save(),d._counterPixelRatio(),(f||g)&&e.translate(-1*f,-1*g),this.drawScene(d),e.restore(),d.toDataURL(b,c)},toImage:function(a){Kinetic.Type._getImage(this.toDataURL(a),function(b){a.callback(b)})},setSize:function(){var a=Kinetic.Type._getSize(Array.prototype.slice.call(arguments));this.setWidth(a.width),this.setHeight(a.height)},getSize:function(){return{width:this.getWidth(),height:this.getHeight()}},getWidth:function(){return this.attrs.width||0},getHeight:function(){return this.attrs.height||0},_get:function(a){return this.nodeType===a?[this]:[]},_off:function(a,b){for(var c=0;c<this.eventListeners[a].length;c++)if(this.eventListeners[a][c].name===b){this.eventListeners[a].splice(c,1);if(this.eventListeners[a].length===0){delete this.eventListeners[a];break}c--}},_clearTransform:function(){var a=this.attrs,b=a.scale,c=a.offset,d={x:a.x,y:a.y,rotation:a.rotation,scale:{x:b.x,y:b.y},offset:{x:c.x,y:c.y}};return this.attrs.x=0,this.attrs.y=0,this.attrs.rotation=0,this.attrs.scale={x:1,y:1},this.attrs.offset={x:0,y:0},d},_setTransform:function(a){for(var b in a)this.attrs[b]=a[b]},_fireBeforeChangeEvent:function(a,b,c){this._handleEvent("before"+a.toUpperCase()+"Change",{oldVal:b,newVal:c})},_fireChangeEvent:function(a,b,c){this._handleEvent(a+"Change",{oldVal:b,newVal:c})},setId:function(a){var b=this.getId(),c=this.getStage(),d=Kinetic.Global;d._removeId(b),d._addId(this,a),this.setAttr("id",a)},setName:function(a){var b=this.getName(),c=this.getStage(),d=Kinetic.Global;d._removeName(b,this._id),d._addName(this,a),this.setAttr("name",a)},setAttr:function(a,b){if(b!==undefined){var c=this.attrs[a];this._fireBeforeChangeEvent(a,c,b),this.attrs[a]=b,this._fireChangeEvent(a,c,b)}},_handleEvent:function(a,b,c){b&&this.nodeType==="Shape"&&(b.shape=this);var d=this.getStage(),e=this.eventListeners,f=!0;a==="mouseenter"&&c&&this._id===c._id?f=!1:a==="mouseleave"&&c&&this._id===c._id&&(f=!1),f&&(e[a]&&this.fire(a,b),b&&!b.cancelBubble&&this.parent&&(c&&c.parent?this._handleEvent.call(this.parent,a,b,c.parent):this._handleEvent.call(this.parent,a,b)))},_executeHandlers:function(a,b){var c=this.eventListeners[a],d=c.length;for(var e=0;e<d;e++)c[e].handler.apply(this,[b])}},Kinetic.Node.addSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addSetter(constructor,d)}},Kinetic.Node.addPointSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addPointSetter(constructor,d)}},Kinetic.Node.addRotationSetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addRotationSetter(constructor,d)}},Kinetic.Node.addGetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addGetter(constructor,d)}},Kinetic.Node.addRotationGetters=function(constructor,a){var b=a.length;for(var c=0;c<b;c++){var d=a[c];this._addRotationGetter(constructor,d)}},Kinetic.Node.addGettersSetters=function(constructor,a){this.addSetters(constructor,a),this.addGetters(constructor,a)},Kinetic.Node.addPointGettersSetters=function(constructor,a){this.addPointSetters(constructor,a),this.addGetters(constructor,a)},Kinetic.Node.addRotationGettersSetters=function(constructor,a){this.addRotationSetters(constructor,a),this.addRotationGetters(constructor,a)},Kinetic.Node._addSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){this.setAttr(a,b)}},Kinetic.Node._addPointSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(){var b=Kinetic.Type._getXY([].slice.call(arguments));b&&b.x===undefined&&(b.x=this.attrs[a].x),b&&b.y===undefined&&(b.y=this.attrs[a].y),this.setAttr(a,b)}},Kinetic.Node._addRotationSetter=function(constructor,a){var b=this,c="set"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){this.setAttr(a,b)},constructor.prototype[c+"Deg"]=function(b){this.setAttr(a,Kinetic.Type._degToRad(b))}},Kinetic.Node._addGetter=function(constructor,a){var b=this,c="get"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(b){return this.attrs[a]}},Kinetic.Node._addRotationGetter=function(constructor,a){var b=this,c="get"+a.charAt(0).toUpperCase()+a.slice(1);constructor.prototype[c]=function(){return this.attrs[a]},constructor.prototype[c+"Deg"]=function(){return Kinetic.Type._radToDeg(this.attrs[a])}},Kinetic.Node.create=function(a,b){return this._createNode(JSON.parse(a),b)},Kinetic.Node._createNode=function(a,b){var c;a.nodeType==="Shape"?a.shapeType===undefined?c="Shape":c=a.shapeType:c=a.nodeType,b&&(a.attrs.container=b);var d=new Kinetic[c](a.attrs);if(a.children){var e=a.children.length;for(var f=0;f<e;f++)d.add(this._createNode(a.children[f]))}return d},Kinetic.Node.addGettersSetters(Kinetic.Node,["x","y","opacity"]),Kinetic.Node.addGetters(Kinetic.Node,["name","id"]),Kinetic.Node.addRotationGettersSetters(Kinetic.Node,["rotation"]),Kinetic.Node.addPointGettersSetters(Kinetic.Node,["scale","offset"]),Kinetic.Node.addSetters(Kinetic.Node,["width","height","listening","visible"]),Kinetic.Node.prototype.isListening=Kinetic.Node.prototype.getListening,Kinetic.Node.prototype.isVisible=Kinetic.Node.prototype.getVisible;var a=["on","off"];for(var b=0;b<2;b++)(function(b){var c=a[b];Kinetic.Collection.prototype[c]=function(){var a=[].slice.call(arguments);a.unshift(c),this.apply.apply(this,a)}})(b)}(),function(){Kinetic.Animation=function(a,b){this.func=a,this.node=b,this.id=Kinetic.Animation.animIdCounter++,this.frame={time:0,timeDiff:0,lastTime:(new Date).getTime()}},Kinetic.Animation.prototype={isRunning:function(){var a=Kinetic.Animation,b=a.animations;for(var c=0;c<b.length;c++)if(b[c].id===this.id)return!0;return!1},start:function(){this.stop(),this.frame.timeDiff=0,this.frame.lastTime=(new Date).getTime(),Kinetic.Animation._addAnimation(this)},stop:function(){Kinetic.Animation._removeAnimation(this)},_updateFrameObject:function(a){this.frame.timeDiff=a-this.frame.lastTime,this.frame.lastTime=a,this.frame.time+=this.frame.timeDiff,this.frame.frameRate=1e3/this.frame.timeDiff}},Kinetic.Animation.animations=[],Kinetic.Animation.animIdCounter=0,Kinetic.Animation.animRunning=!1,Kinetic.Animation.fixedRequestAnimFrame=function(a){window.setTimeout(a,1e3/60)},Kinetic.Animation._addAnimation=function(a){this.animations.push(a),this._handleAnimation()},Kinetic.Animation._removeAnimation=function(a){var b=a.id,c=this.animations,d=c.length;for(var e=0;e<d;e++)if(c[e].id===b){this.animations.splice(e,1);break}},Kinetic.Animation._runFrames=function(){var a={},b=this.animations;for(var c=0;c<b.length;c++){var d=b[c],e=d.node,f=d.func;d._updateFrameObject((new Date).getTime()),e&&e._id!==undefined&&(a[e._id]=e),f&&f(d.frame)}for(var g in a)a[g].draw()},Kinetic.Animation._animationLoop=function(){var a=this;this.animations.length>0?(this._runFrames(),Kinetic.Animation.requestAnimFrame(function(){a._animationLoop()})):this.animRunning=!1},Kinetic.Animation._handleAnimation=function(){var a=this;this.animRunning||(this.animRunning=!0,a._animationLoop())},RAF=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||Kinetic.Animation.fixedRequestAnimFrame}(),Kinetic.Animation.requestAnimFrame=function(a){var b=Kinetic.DD&&Kinetic.DD.moving?this.fixedRequestAnimFrame:RAF;b(a)};var a=Kinetic.Node.prototype.moveTo;Kinetic.Node.prototype.moveTo=function(b){a.call(this,b)}}(),function(){Kinetic.DD={anim:new Kinetic.Animation,moving:!1,offset:{x:0,y:0}},Kinetic.getNodeDragging=function(){return Kinetic.DD.node},Kinetic.DD._setupDragLayerAndGetContainer=function(a){var b=a.getStage(),c=a.nodeType,d,e;return a._eachAncestorReverse(function(a){a.nodeType==="Layer"?(b.dragLayer.setAttrs(a.getAttrs()),d=b.dragLayer,b.add(b.dragLayer)):a.nodeType==="Group"&&(e=new Kinetic.Group(a.getAttrs()),d.add(e),d=e)}),d},Kinetic.DD._initDragLayer=function(a){a.dragLayer=new Kinetic.Layer,a.dragLayer.getCanvas().getElement().className="kinetic-drag-and-drop-layer"},Kinetic.DD._drag=function(a){var b=Kinetic.DD,c=b.node;if(c){var d=c.getStage().getUserPosition(),e=c.attrs.dragBoundFunc,f={x:d.x-b.offset.x,y:d.y-b.offset.y};e!==undefined&&(f=e.call(c,f,a)),c.setAbsolutePosition(f),b.moving||(b.moving=!0,c.setListening(!1),c._handleEvent("dragstart",a)),c._handleEvent("dragmove",a)}},Kinetic.DD._endDrag=function(a){var b=Kinetic.DD,c=b.node;if(c){var d=c.nodeType,e=c.getStage();c.setListening(!0),d==="Stage"?c.draw():((d==="Group"||d==="Shape")&&c.getDragOnTop()&&b.prevParent&&(c.moveTo(b.prevParent),c.getStage().dragLayer.remove(),b.prevParent=null),c.getLayer().draw()),delete b.node,b.anim.stop(),b.moving&&(b.moving=!1,c._handleEvent("dragend",a))}},Kinetic.Node.prototype._startDrag=function(a){var b=Kinetic.DD,c=this,d=this.getStage(),e=d.getUserPosition();if(e){var f=this.getTransform().getTranslation(),g=this.getAbsolutePosition(),h=this.nodeType,i;b.node=this,b.offset.x=e.x-g.x,b.offset.y=e.y-g.y,h==="Stage"||h==="Layer"?(b.anim.node=this,b.anim.start()):this.getDragOnTop()?(i=b._setupDragLayerAndGetContainer(this),b.anim.node=d.dragLayer,b.prevParent=this.getParent(),setTimeout(function(){b.node&&(c.moveTo(i),b.prevParent.getLayer().draw(),d.dragLayer.draw(),b.anim.start())},0)):(b.anim.node=this.getLayer(),b.anim.start())}},Kinetic.Node.prototype.setDraggable=function(a){this.setAttr("draggable",a),this._dragChange()},Kinetic.Node.prototype.getDraggable=function(){return this.attrs.draggable},Kinetic.Node.prototype.isDragging=function(){var a=Kinetic.DD;return a.node&&a.node._id===this._id&&a.moving},Kinetic.Node.prototype._listenDrag=function(){this._dragCleanup
();var a=this;this.on("mousedown.kinetic touchstart.kinetic",function(b){Kinetic.getNodeDragging()||a._startDrag(b)})},Kinetic.Node.prototype._dragChange=function(){if(this.attrs.draggable)this._listenDrag();else{this._dragCleanup();var a=this.getStage(),b=Kinetic.DD;a&&b.node&&b.node._id===this._id&&b._endDrag()}},Kinetic.Node.prototype._dragCleanup=function(){this.off("mousedown.kinetic"),this.off("touchstart.kinetic")},Kinetic.Node.prototype.isDraggable=Kinetic.Node.prototype.getDraggable,Kinetic.Node.addGettersSetters(Kinetic.Node,["dragBoundFunc","dragOnTop"]);var a=document.getElementsByTagName("html")[0];a.addEventListener("mouseup",Kinetic.DD._endDrag,!0),a.addEventListener("touchend",Kinetic.DD._endDrag,!0)}(),function(){Kinetic.Transition=function(a,b){function e(a,b,d,f){for(var g in a)g!=="duration"&&g!=="easing"&&g!=="callback"&&(Kinetic.Type._isObject(a[g])?(d[g]={},e(a[g],b[g],d[g],f)):c._add(c._getTween(b,g,a[g],d,f)))}var c=this,d={};this.node=a,this.config=b,this.tweens=[],e(b,a.attrs,d,d),this.tweens[0].onStarted=function(){},this.tweens[0].onStopped=function(){a.transAnim.stop()},this.tweens[0].onResumed=function(){a.transAnim.start()},this.tweens[0].onLooped=function(){},this.tweens[0].onChanged=function(){},this.tweens[0].onFinished=function(){var c={};for(var d in b)d!=="duration"&&d!=="easing"&&d!=="callback"&&(c[d]=b[d]);a.transAnim.stop(),a.setAttrs(c),b.callback&&b.callback()}},Kinetic.Transition.prototype={start:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].start()},stop:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].stop()},resume:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].resume()},_onEnterFrame:function(){for(var a=0;a<this.tweens.length;a++)this.tweens[a].onEnterFrame()},_add:function(a){this.tweens.push(a)},_getTween:function(a,b,c,d,e){var f=this.config,g=this.node,h=f.easing;h===undefined&&(h="linear");var i=new Kinetic.Tween(g,function(a){d[b]=a,g.setAttrs(e)},Kinetic.Tweens[h],a[b],c,f.duration);return i}},Kinetic.Node.prototype.transitionTo=function(a){var b=this,c=new Kinetic.Transition(this,a);return this.transAnim||(this.transAnim=new Kinetic.Animation),this.transAnim.func=function(){c._onEnterFrame()},this.transAnim.node=this.nodeType==="Stage"?this:this.getLayer(),c.start(),this.transAnim.start(),this.trans=c,c}}(),function(){Kinetic.Container=function(a){this._containerInit(a)},Kinetic.Container.prototype={_containerInit:function(a){this.children=[],Kinetic.Node.call(this,a)},getChildren:function(){return this.children},removeChildren:function(){while(this.children.length>0)this.children[0].remove()},add:function(a){var b=Kinetic.Global,c=this.children;return a.index=c.length,a.parent=this,c.push(a),this},get:function(a){var b=new Kinetic.Collection;if(a.charAt(0)==="#"){var c=this._getNodeById(a.slice(1));c&&b.push(c)}else if(a.charAt(0)==="."){var d=this._getNodesByName(a.slice(1));Kinetic.Collection.apply(b,d)}else{var e=[],f=this.getChildren(),g=f.length;for(var h=0;h<g;h++)e=e.concat(f[h]._get(a));Kinetic.Collection.apply(b,e)}return b},_getNodeById:function(a){var b=this.getStage(),c=Kinetic.Global,d=c.ids[a];return d!==undefined&&this.isAncestorOf(d)?d:null},_getNodesByName:function(a){var b=Kinetic.Global,c=b.names[a]||[];return this._getDescendants(c)},_get:function(a){var b=Kinetic.Node.prototype._get.call(this,a),c=this.getChildren(),d=c.length;for(var e=0;e<d;e++)b=b.concat(c[e]._get(a));return b},toObject:function(){var a=Kinetic.Node.prototype.toObject.call(this);a.children=[];var b=this.getChildren(),c=b.length;for(var d=0;d<c;d++){var e=b[d];a.children.push(e.toObject())}return a},_getDescendants:function(a){var b=[],c=a.length;for(var d=0;d<c;d++){var e=a[d];this.isAncestorOf(e)&&b.push(e)}return b},isAncestorOf:function(a){var b=a.getParent();while(b){if(b._id===this._id)return!0;b=b.getParent()}return!1},clone:function(a){var b=Kinetic.Node.prototype.clone.call(this,a);for(var c in this.children)b.add(this.children[c].clone());return b},getIntersections:function(){var a=Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),b=[],c=this.get("Shape"),d=c.length;for(var e=0;e<d;e++){var f=c[e];f.isVisible()&&f.intersects(a)&&b.push(f)}return b},_setChildrenIndices:function(){var a=this.children,b=a.length;for(var c=0;c<b;c++)a[c].index=c},draw:function(){this.drawScene(),this.drawHit()},drawScene:function(a){if(this.isVisible()){var b=this.children,c=b.length;for(var d=0;d<c;d++)b[d].drawScene(a)}},drawHit:function(){if(this.isVisible()&&this.isListening()){var a=this.children,b=a.length;for(var c=0;c<b;c++)a[c].drawHit()}}},Kinetic.Global.extend(Kinetic.Container,Kinetic.Node)}(),function(){function a(a){a.fill()}function b(a){a.stroke()}Kinetic.Shape=function(a){this._initShape(a)},Kinetic.Shape.prototype={_initShape:function(c){this.setDefaultAttrs({fillEnabled:!0,strokeEnabled:!0,shadowEnabled:!0,dashArrayEnabled:!0,fillPriority:"color"}),this.nodeType="Shape",this._fillFunc=a,this._strokeFunc=b;var d=Kinetic.Global.shapes,e;for(;;){e=Kinetic.Type._getRandomColorKey();if(e&&!(e in d))break}this.colorKey=e,d[e]=this,Kinetic.Node.call(this,c)},getContext:function(){return this.getLayer().getContext()},getCanvas:function(){return this.getLayer().getCanvas()},hasShadow:function(){return!!(this.getShadowColor()||this.getShadowBlur()||this.getShadowOffset())},hasFill:function(){return!!(this.getFill()||this.getFillPatternImage()||this.getFillLinearGradientStartPoint()||this.getFillRadialGradientStartPoint())},_get:function(a){return this.nodeType===a||this.shapeType===a?[this]:[]},intersects:function(){var a=Kinetic.Type._getXY(Array.prototype.slice.call(arguments)),b=this.getStage(),c=b.hitCanvas;c.clear(),this.drawScene(c);var d=c.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data;return d[3]>0},enableFill:function(){this.setAttr("fillEnabled",!0)},disableFill:function(){this.setAttr("fillEnabled",!1)},enableStroke:function(){this.setAttr("strokeEnabled",!0)},disableStroke:function(){this.setAttr("strokeEnabled",!1)},enableShadow:function(){this.setAttr("shadowEnabled",!0)},disableShadow:function(){this.setAttr("shadowEnabled",!1)},enableDashArray:function(){this.setAttr("dashArrayEnabled",!0)},disableDashArray:function(){this.setAttr("dashArrayEnabled",!1)},remove:function(){Kinetic.Node.prototype.remove.call(this),delete Kinetic.Global.shapes[this.colorKey]},drawScene:function(a){var b=this.attrs,c=b.drawFunc,a=a||this.getLayer().getCanvas(),d=a.getContext();c&&this.isVisible()&&(d.save(),a._handlePixelRatio(),a._applyOpacity(this),a._applyLineJoin(this),a._applyAncestorTransforms(this),c.call(this,a),d.restore())},drawHit:function(){var a=this.attrs,b=a.drawHitFunc||a.drawFunc,c=this.getLayer().hitCanvas,d=c.getContext();b&&this.isVisible()&&this.isListening()&&(d.save(),c._applyLineJoin(this),c._applyAncestorTransforms(this),b.call(this,c),d.restore())},_setDrawFuncs:function(){!this.attrs.drawFunc&&this.drawFunc&&this.setDrawFunc(this.drawFunc),!this.attrs.drawHitFunc&&this.drawHitFunc&&this.setDrawHitFunc(this.drawHitFunc)}},Kinetic.Global.extend(Kinetic.Shape,Kinetic.Node),Kinetic.Node.addGettersSetters(Kinetic.Shape,["stroke","lineJoin","lineCap","strokeWidth","drawFunc","drawHitFunc","dashArray","shadowColor","shadowBlur","shadowOpacity","fillPatternImage","fill","fillPatternX","fillPatternY","fillLinearGradientColorStops","fillRadialGradientStartRadius","fillRadialGradientEndRadius","fillRadialGradientColorStops","fillPatternRepeat","fillEnabled","strokeEnabled","shadowEnabled","dashArrayEnabled","fillPriority"]),Kinetic.Node.addPointGettersSetters(Kinetic.Shape,["fillPatternOffset","fillPatternScale","fillLinearGradientStartPoint","fillLinearGradientEndPoint","fillRadialGradientStartPoint","fillRadialGradientEndPoint","shadowOffset"]),Kinetic.Node.addRotationGettersSetters(Kinetic.Shape,["fillPatternRotation"])}(),function(){Kinetic.Stage=function(a){this._initStage(a)},Kinetic.Stage.prototype={_initStage:function(a){var b=Kinetic.DD;this.setDefaultAttrs({width:400,height:200}),Kinetic.Container.call(this,a),this._setStageDefaultProperties(),this._id=Kinetic.Global.idCounter++,this._buildDOM(),this._bindContentEvents(),Kinetic.Global.stages.push(this),b&&b._initDragLayer(this)},setContainer:function(a){typeof a=="string"&&(a=document.getElementById(a)),this.setAttr("container",a)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this._resizeDOM()},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this._resizeDOM()},clear:function(){var a=this.children;for(var b=0;b<a.length;b++)a[b].clear()},remove:function(){var a=this.content;Kinetic.Node.prototype.remove.call(this),a&&Kinetic.Type._isInDocument(a)&&this.attrs.container.removeChild(a)},reset:function(){this.removeChildren(),this._setStageDefaultProperties(),this.setAttrs(this.defaultNodeAttrs)},getMousePosition:function(){return this.mousePos},getTouchPosition:function(){return this.touchPos},getUserPosition:function(){return this.getTouchPosition()||this.getMousePosition()},getStage:function(){return this},getContent:function(){return this.content},toDataURL:function(a){function i(d){var e=h[d],j=e.toDataURL(),k=new Image;k.onload=function(){g.drawImage(k,0,0),d<h.length-1?i(d+1):a.callback(f.toDataURL(b,c))},k.src=j}a=a||{};var b=a.mimeType||null,c=a.quality||null,d=a.x||0,e=a.y||0,f=new Kinetic.SceneCanvas(a.width||this.getWidth(),a.height||this.getHeight()),g=f.getContext(),h=this.children;(d||e)&&g.translate(-1*d,-1*e),i(0)},toImage:function(a){var b=a.callback;a.callback=function(a){Kinetic.Type._getImage(a,function(a){b(a)})},this.toDataURL(a)},getIntersection:function(a){var b,c=this.getChildren();for(var d=c.length-1;d>=0;d--){var e=c[d];if(e.isVisible()&&e.isListening()){var f=e.hitCanvas.context.getImageData(Math.round(a.x),Math.round(a.y),1,1).data;if(f[3]===255){var g=Kinetic.Type._rgbToHex(f[0],f[1],f[2]);return b=Kinetic.Global.shapes[g],{shape:b,pixel:f}}if(f[0]>0||f[1]>0||f[2]>0||f[3]>0)return{pixel:f}}}return null},_resizeDOM:function(){if(this.content){var a=this.attrs.width,b=this.attrs.height;this.content.style.width=a+"px",this.content.style.height=b+"px",this.bufferCanvas.setSize(a,b),this.hitCanvas.setSize(a,b);var c=this.children;for(var d=0;d<c.length;d++){var e=c[d];e.getCanvas().setSize(a,b),e.hitCanvas.setSize(a,b),e.draw()}}},add:function(a){return Kinetic.Container.prototype.add.call(this,a),a.canvas.setSize(this.attrs.width,this.attrs.height),a.hitCanvas.setSize(this.attrs.width,this.attrs.height),a.draw(),this.content.appendChild(a.canvas.element),this},getDragLayer:function(){return this.dragLayer},_setUserPosition:function(a){a||(a=window.event),this._setMousePosition(a),this._setTouchPosition(a)},_bindContentEvents:function(){var a=Kinetic.Global,b=this,c=["mousedown","mousemove","mouseup","mouseout","touchstart","touchmove","touchend"];for(var d=0;d<c.length;d++){var e=c[d];(function(){var a=e;b.content.addEventListener(a,function(c){b["_"+a](c)},!1)})()}},_mouseout:function(a){this._setUserPosition(a);var b=Kinetic.DD,c=this.targetShape;c&&(!b||!b.moving)&&(c._handleEvent("mouseout",a),c._handleEvent("mouseleave",a),this.targetShape=null),this.mousePos=undefined},_mousemove:function(a){this._setUserPosition(a);var b=Kinetic.DD,c=this.getIntersection(this.getUserPosition());if(c){var d=c.shape;d&&(!!b&&!!b.moving||c.pixel[3]!==255||!!this.targetShape&&this.targetShape._id===d._id?d._handleEvent("mousemove",a):(this.targetShape&&(this.targetShape._handleEvent("mouseout",a,d),this.targetShape._handleEvent("mouseleave",a,d)),d._handleEvent("mouseover",a,this.targetShape),d._handleEvent("mouseenter",a,this.targetShape),this.targetShape=d))}else this.targetShape&&(!b||!b.moving)&&(this.targetShape._handleEvent("mouseout",a),this.targetShape._handleEvent("mouseleave",a),this.targetShape=null);b&&b._drag(a)},_mousedown:function(a){var b,c=Kinetic.DD;this._setUserPosition(a),b=this.getIntersection(this.getUserPosition());if(b&&b.shape){var d=b.shape;this.clickStart=!0,d._handleEvent("mousedown",a)}c&&this.attrs.draggable&&!c.node&&this._startDrag(a)},_mouseup:function(a){this._setUserPosition(a);var b=this,c=Kinetic.DD,d=this.getIntersection(this.getUserPosition());if(d&&d.shape){var e=d.shape;e._handleEvent("mouseup",a),this.clickStart&&(!c||!c.moving||!c.node)&&(e._handleEvent("click",a),this.inDoubleClickWindow&&e._handleEvent("dblclick",a),this.inDoubleClickWindow=!0,setTimeout(function(){b.inDoubleClickWindow=!1},this.dblClickWindow))}this.clickStart=!1},_touchstart:function(a){var b,c=Kinetic.DD;this._setUserPosition(a),a.preventDefault(),b=this.getIntersection(this.getUserPosition());if(b&&b.shape){var d=b.shape;this.tapStart=!0,d._handleEvent("touchstart",a)}c&&this.attrs.draggable&&!c.node&&this._startDrag(a)},_touchend:function(a){this._setUserPosition(a);var b=this,c=Kinetic.DD,d=this.getIntersection(this.getUserPosition());if(d&&d.shape){var e=d.shape;e._handleEvent("touchend",a),this.tapStart&&(!c||!c.moving||!c.node)&&(e._handleEvent("tap",a),this.inDoubleClickWindow&&e._handleEvent("dbltap",a),this.inDoubleClickWindow=!0,setTimeout(function(){b.inDoubleClickWindow=!1},this.dblClickWindow))}this.tapStart=!1},_touchmove:function(a){this._setUserPosition(a);var b=Kinetic.DD;a.preventDefault();var c=this.getIntersection(this.getUserPosition());if(c&&c.shape){var d=c.shape;d._handleEvent("touchmove",a)}b&&b._drag(a)},_setMousePosition:function(a){var b=a.clientX-this._getContentPosition().left,c=a.clientY-this._getContentPosition().top;this.mousePos={x:b,y:c}},_setTouchPosition:function(a){if(a.touches!==undefined&&a.touches.length===1){var b=a.touches[0],c=b.clientX-this._getContentPosition().left,d=b.clientY-this._getContentPosition().top;this.touchPos={x:c,y:d}}},_getContentPosition:function(){var a=this.content.getBoundingClientRect();return{top:a.top,left:a.left}},_buildDOM:function(){this.content=document.createElement("div"),this.content.style.position="relative",this.content.style.display="inline-block",this.content.className="kineticjs-content",this.attrs.container.appendChild(this.content),this.bufferCanvas=new Kinetic.SceneCanvas,this.hitCanvas=new Kinetic.HitCanvas,this._resizeDOM()},_onContent:function(a,b){var c=a.split(" ");for(var d=0;d<c.length;d++){var e=c[d];this.content.addEventListener(e,b,!1)}},_setStageDefaultProperties:function(){this.nodeType="Stage",this.dblClickWindow=400,this.targetShape=null,this.mousePos=undefined,this.clickStart=!1,this.touchPos=undefined,this.tapStart=!1}},Kinetic.Global.extend(Kinetic.Stage,Kinetic.Container),Kinetic.Node.addGetters(Kinetic.Stage,["container"])}(),function(){Kinetic.Layer=function(a){this._initLayer(a)},Kinetic.Layer.prototype={_initLayer:function(a){this.setDefaultAttrs({clearBeforeDraw:!0}),this.nodeType="Layer",this.beforeDrawFunc=undefined,this.afterDrawFunc=undefined,this.canvas=new Kinetic.SceneCanvas,this.canvas.getElement().style.position="absolute",this.hitCanvas=new Kinetic.HitCanvas,Kinetic.Container.call(this,a)},draw:function(){this.beforeDrawFunc!==undefined&&this.beforeDrawFunc.call(this),Kinetic.Container.prototype.draw.call(this),this.afterDrawFunc!==undefined&&this.afterDrawFunc.call(this)},drawHit:function(){this.hitCanvas.clear(),Kinetic.Container.prototype.drawHit.call(this)},drawScene:function(a){a=a||this.getCanvas(),this.attrs.clearBeforeDraw&&a.clear(),Kinetic.Container.prototype.drawScene.call(this,a)},toDataURL:function(a){a=a||{};var b=a.mimeType||null,c=a.quality||null,d,e,f=a.x||0,g=a.y||0;return a.width||a.height||a.x||a.y?Kinetic.Node.prototype.toDataURL.call(this,a):this.getCanvas().toDataURL(b,c)},beforeDraw:function(a){this.beforeDrawFunc=a},afterDraw:function(a){this.afterDrawFunc=a},getCanvas:function(){return this.canvas},getContext:function(){return this.canvas.context},clear:function(){this.getCanvas().clear()},setVisible:function(a){Kinetic.Node.prototype.setVisible.call(this,a),a?(this.canvas.element.style.display="block",this.hitCanvas.element.style.display="block"):(this.canvas.element.style.display="none",this.hitCanvas.element.style.display="none")},setZIndex:function(a){Kinetic.Node.prototype.setZIndex.call(this,a);var b=this.getStage();b&&(b.content.removeChild(this.canvas.element),a<b.getChildren().length-1?b.content.insertBefore(this.canvas.element,b.getChildren()[a+1].canvas.element):b.content.appendChild(this.canvas.element))},moveToTop:function(){Kinetic.Node.prototype.moveToTop.call(this);var a=this.getStage();a&&(a.content.removeChild(this.canvas.element),a.content.appendChild(this.canvas.element))},moveUp:function(){if(Kinetic.Node.prototype.moveUp.call(this)){var a=this.getStage();a&&(a.content.removeChild(this.canvas.element),this.index<a.getChildren().length-1?a.content.insertBefore(this.canvas.element,a.getChildren()[this.index+1].canvas.element):a.content.appendChild(this.canvas.element))}},moveDown:function(){if(Kinetic.Node.prototype.moveDown.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.canvas.element),a.content.insertBefore(this.canvas.element,b[this.index+1].canvas.element)}}},moveToBottom:function(){if(Kinetic.Node.prototype.moveToBottom.call(this)){var a=this.getStage();if(a){var b=a.getChildren();a.content.removeChild(this.canvas.element),a.content.insertBefore(this.canvas.element,b[1].canvas.element)}}},getLayer:function(){return this},remove:function(){var a=this.getStage(),b=this.canvas,c=b.element;Kinetic.Node.prototype.remove.call(this),a&&b&&Kinetic.Type._isInDocument(c)&&a.content.removeChild(c)}},Kinetic.Global.extend(Kinetic.Layer,Kinetic.Container),Kinetic.Node.addGettersSetters(Kinetic.Layer,["clearBeforeDraw"])}(),function(){Kinetic.Group=function(a){this._initGroup(a)},Kinetic.Group.prototype={_initGroup:function(a){this.nodeType="Group",Kinetic.Container.call(this,a)}},Kinetic.Global.extend(Kinetic.Group,Kinetic.Container)}(),function(){Kinetic.Rect=function(a){this._initRect(a)},Kinetic.Rect.prototype={_initRect:function(a){this.setDefaultAttrs({width:0,height:0,cornerRadius:0}),Kinetic.Shape.call(this,a),this.shapeType="Rect",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath();var c=this.getCornerRadius(),d=this.getWidth(),e=this.getHeight();c===0?b.rect(0,0,d,e):(b.moveTo(c,0),b.lineTo(d-c,0),b.arc(d-c,c,c,Math.PI*3/2,0,!1),b.lineTo(d,e-c),b.arc(d-c,e-c,c,0,Math.PI/2,!1),b.lineTo(c,e),b.arc(c,e-c,c,Math.PI/2,Math.PI,!1),b.lineTo(0,c),b.arc(c,c,c,Math.PI,Math.PI*3/2,!1)),b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Rect,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Rect,["cornerRadius"])}(),function(){Kinetic.Circle=function(a){this._initCircle(a)},Kinetic.Circle.prototype={_initCircle:function(a){this.setDefaultAttrs({radius:0}),Kinetic.Shape.call(this,a),this.shapeType="Circle",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath(),b.arc(0,0,this.getRadius(),0,Math.PI*2,!0),b.closePath(),a.fillStroke(this)},getWidth:function(){return this.getRadius()*2},getHeight:function(){return this.getRadius()*2},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius(a/2)},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius(a/2)}},Kinetic.Global.extend(Kinetic.Circle,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Circle,["radius"])}(),function(){Kinetic.Wedge=function(a){this._initWedge(a)},Kinetic.Wedge.prototype={_initWedge:function(a){this.setDefaultAttrs({radius:0,angle:0,clickwise:!0}),Kinetic.Shape.call(this,a),this.shapeType="Wedge",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext();b.beginPath(),b.arc(0,0,this.getRadius(),0,this.getAngle(),this.getClockwise()),b.lineTo(0,0),b.closePath(),a.fillStroke(this)},setAngleDeg:function(a){this.setAngle(Kinetic.Type._degToRad(a))},getAngleDeg:function(){return Kinetic.Type._radToDeg(this.getAngle())}},Kinetic.Global.extend(Kinetic.Wedge,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Wedge,["radius","angle","clockwise"])}(),function(){Kinetic.Ellipse=function(a){this._initEllipse(a)},Kinetic.Ellipse.prototype={_initEllipse:function(a){this.setDefaultAttrs({radius:{x:0,y:0}}),Kinetic.Shape.call(this,a),this.shapeType="Ellipse",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getRadius();b.beginPath(),b.save(),c.x!==c.y&&b.scale(1,c.y/c.x),b.arc(0,0,c.x,0,Math.PI*2,!0),b.restore(),b.closePath(),a.fillStroke(this)},getWidth:function(){return this.getRadius().x*2},getHeight:function(){return this.getRadius().y*2},setWidth:function(a){Kinetic.Node.prototype.setWidth.call(this,a),this.setRadius({x:a/2})},setHeight:function(a){Kinetic.Node.prototype.setHeight.call(this,a),this.setRadius({y:a/2})}},Kinetic.Global.extend(Kinetic.Ellipse,Kinetic.Shape),Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse,["radius"])}(),function(){Kinetic.Image=function(a){this._initImage(a)},Kinetic.Image.prototype={_initImage:function(a){Kinetic.Shape.call(this,a),this.shapeType="Image",this._setDrawFuncs();var b=this;this.on("imageChange",function(a){b._syncSize()}),this._syncSize()},drawFunc:function(a){var b=this.getWidth(),c=this.getHeight(),d,e=this,f=a.getContext();f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.fillStroke(this);if(this.attrs.image){if(this.attrs.crop&&this.attrs.crop.width&&this.attrs.crop.height){var g=this.attrs.crop.x||0,h=this.attrs.crop.y||0,i=this.attrs.crop.width,j=this.attrs.crop.height;d=[this.attrs.image,g,h,i,j,0,0,b,c]}else d=[this.attrs.image,0,0,b,c];this.hasShadow()?a.applyShadow(this,function(){e._drawImage(f,d)}):this._drawImage(f,d)}},drawHitFunc:function(a){var b=this.getWidth(),c=this.getHeight(),d=this.imageHitRegion,e=!1,f=a.getContext();d?(f.drawImage(d,0,0,b,c),f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.stroke(this)):(f.beginPath(),f.rect(0,0,b,c),f.closePath(),a.fillStroke(this))},applyFilter:function(a,b,c){var d=new Kinetic.Canvas(this.attrs.image.width,this.attrs.image.height),e=d.getContext();e.drawImage(this.attrs.image,0,0);try{var f=e.getImageData(0,0,d.getWidth(),d.getHeight());a(f,b);var g=this;Kinetic.Type._getImage(f,function(a){g.setImage(a),c&&c()})}catch(h){Kinetic.Global.warn("Unable to apply filter. "+h.message)}},setCrop:function(){var a=[].slice.call(arguments),b=Kinetic.Type._getXY(a),c=Kinetic.Type._getSize(a),d=Kinetic.Type._merge(b,c);this.setAttr("crop",Kinetic.Type._merge(d,this.getCrop()))},createImageHitRegion:function(a){var b=new Kinetic.Canvas(this.attrs.width,this.attrs.height),c=b.getContext();c.drawImage(this.attrs.image,0,0);try{var d=c.getImageData(0,0,b.getWidth(),b.getHeight()),e=d.data,f=Kinetic.Type._hexToRgb(this.colorKey);for(var g=0,h=e.length;g<h;g+=4)e[g]=f.r,e[g+1]=f.g,e[g+2]=f.b;var i=this;Kinetic.Type._getImage(d,function(b){i.imageHitRegion=b,a&&a()})}catch(j){Kinetic.Global.warn("Unable to create image hit region. "+j.message)}},clearImageHitRegion:function(){delete this.imageHitRegion},_syncSize:function(){this.attrs.image&&(this.attrs.width||this.setWidth(this.attrs.image.width),this.attrs.height||this.setHeight(this.attrs.image.height))},_drawImage:function(a,b){b.length===5?a.drawImage(b[0],b[1],b[2],b[3],b[4]):b.length===9&&a.drawImage(b[0],b[1],b[2],b[3],b[4],b[5],b[6],b[7],b[8])}},Kinetic.Global.extend(Kinetic.Image,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Image,["image"]),Kinetic.Node.addGetters(Kinetic.Image,["crop"])}(),function(){Kinetic.Polygon=function(a){this._initPolygon(a)},Kinetic.Polygon.prototype={_initPolygon:function(a){this.setDefaultAttrs({points:[]}),Kinetic.Shape.call(this,a),this.shapeType="Polygon",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.getPoints(),d=c.length;b.beginPath(),b.moveTo(c[0].x,c[0].y);for(var e=1;e<d;e++)b.lineTo(c[e].x,c[e].y);b.closePath(),a.fillStroke(this)},setPoints:function(a){this.setAttr("points",Kinetic.Type._getPoints(a))}},Kinetic.Global.extend(Kinetic.Polygon,Kinetic.Shape),Kinetic.Node.addGetters(Kinetic.Polygon,["points"])}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}Kinetic.Text=function(a){this._initText(a)},Kinetic.Text.prototype={_initText:function(c){this.setDefaultAttrs({fontFamily:"Calibri",text:"",fontSize:12,align:"left",verticalAlign:"top",fontStyle:"normal",padding:0,width:"auto",height:"auto",lineHeight:1}),this.dummyCanvas=document.createElement("canvas"),Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this.shapeType="Text",this._setDrawFuncs();var d=["fontFamily","fontSize","fontStyle","padding","align","lineHeight","text","width","height"],e=this;for(var f=0;f<d.length;f++){var g=d[f];this.on(g+"Change.kinetic",e._setTextData)}e._setTextData()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.padding,d=this.attrs.lineHeight*this.getTextHeight(),e=this.textArr;b.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"px "+this.attrs.fontFamily,b.textBaseline="middle",b.textAlign="left",b.save(),b.translate(c,0),b.translate(0,c+this.getTextHeight()/2);for(var f=0;f<e.length;f++){var g=e[f];b.save(),this.attrs.align==="right"?b.translate(this.getWidth()-this._getTextSize(g).width-c*2,0):this.attrs.align==="center"&&b.translate((this.getWidth()-this._getTextSize(g).width-c*2)/2,0),this.partialText=g,a.fillStroke(this),b.restore(),b.translate(0,d)}b.restore()},drawHitFunc:function(a){var b=a.getContext(),c=this.getWidth(),d=this.getHeight();b.beginPath(),b.rect(0,0,c,d),b.closePath(),a.fillStroke(this)},setText:function(a){var b=Kinetic.Type._isString(a)?a:a.toString();this.setAttr("text",b)},getWidth:function(){return this.attrs.width==="auto"?this.getTextWidth()+this.attrs.padding*2:this.attrs.width},getHeight:function(){return this.attrs.height==="auto"?this.getTextHeight()*this.textArr.length*this.attrs.lineHeight+this.attrs.padding*2:this.attrs.height},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"px "+this.attrs.fontFamily;var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this.attrs.text.split(""),b=[],c=0,d=!0;this.textWidth=0,this.textHeight=this._getTextSize(this.attrs.text).height;var e=this.attrs.lineHeight*this.textHeight;while(a.length>0&&d&&(this.attrs.height==="auto"||e*(c+1)<this.attrs.height-this.attrs.padding*2)){var f=0,g=undefined;d=!1;while(f<a.length){if(a.indexOf("\n")===f){a.splice(f,1),g=a.splice(0,f).join("");break}var h=a.slice(0,f);if(this.attrs.width!=="auto"&&this._getTextSize(h.join("")).width>this.attrs.width-this.attrs.padding*2){if(f==0)break;var i=h.lastIndexOf(" "),j=h.lastIndexOf("-"),k=Math.max(i,j);if(k>=0){g=a.splice(0,1+k).join("");break}g=a.splice(0,f).join("");break}f++,f===a.length&&(g=a.splice(0,f).join(""))}this.textWidth=Math.max(this.textWidth,this._getTextSize(g).width),g!==undefined&&(b.push(g),d=!0),c++}this.textArr=b}},Kinetic.Global.extend(Kinetic.Text,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Text,["fontFamily","fontSize","fontStyle","padding","align","lineHeight"]),Kinetic.Node.addGetters(Kinetic.Text,["text"])}(),function(){Kinetic.Line=function(a){this._initLine(a)},Kinetic.Line.prototype={_initLine:function(a){this.setDefaultAttrs({points:[],lineCap:"butt"}),Kinetic.Shape.call(this,a),this.shapeType="Line",this._setDrawFuncs()},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext();d.beginPath(),d.moveTo(b[0].x,b[0].y);for(var e=1;e<c;e++){var f=b[e];d.lineTo(f.x,f.y)}a.stroke(this)},setPoints:function(a){this.setAttr("points",Kinetic.Type._getPoints(a))}},Kinetic.Global.extend(Kinetic.Line,Kinetic.Shape),Kinetic.Node.addGetters(Kinetic.Line,["points"])}(),function(){Kinetic.Spline=function(a){this._initSpline(a)},Kinetic.Spline._getControlPoints=function(a,b,c,d){var e=a.x,f=a.y,g=b.x,h=b.y,i=c.x,j=c.y,k=Math.sqrt(Math.pow(g-e,2)+Math.pow(h-f,2)),l=Math.sqrt(Math.pow(i-g,2)+Math.pow(j-h,2)),m=d*k/(k+l),n=d*l/(k+l),o=g-m*(i-e),p=h-m*(j-f),q=g+n*(i-e),r=h+n*(j-f);return[{x:o,y:p},{x:q,y:r}]},Kinetic.Spline.prototype={_initSpline:function(a){this.setDefaultAttrs({tension:1}),Kinetic.Line.call(this,a),this.shapeType="Spline"},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext(),e=this.getTension();d.beginPath(),d.moveTo(b[0].x,b[0].y);if(e!==0&&c>2){var f=this.allPoints,g=f.length;d.quadraticCurveTo(f[0].x,f[0].y,f[1].x,f[1].y);var h=2;while(h<g-1)d.bezierCurveTo(f[h].x,f[h++].y,f[h].x,f[h++].y,f[h].x,f[h++].y);d.quadraticCurveTo(f[g-1].x,f[g-1].y,b[c-1].x,b[c-1].y)}else for(var h=1;h<c;h++){var i=b[h];d.lineTo(i.x,i.y)}a.stroke(this)},setPoints:function(a){Kinetic.Line.prototype.setPoints.call(this,a),this._setAllPoints()},setTension:function(a){this.setAttr("tension",a),this._setAllPoints()},_setAllPoints:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=[];for(var e=1;e<b-1;e++){var f=Kinetic.Spline._getControlPoints(a[e-1],a[e],a[e+1],c);d.push(f[0]),d.push(a[e]),d.push(f[1])}this.allPoints=d}},Kinetic.Global.extend(Kinetic.Spline,Kinetic.Line),Kinetic.Node.addGetters(Kinetic.Spline,["tension"])}(),function(){Kinetic.Blob=function(a){this._initBlob(a)},Kinetic.Blob.prototype={_initBlob:function(a){Kinetic.Spline.call(this,a),this.shapeType="Blob"},drawFunc:function(a){var b=this.getPoints(),c=b.length,d=a.getContext(),e=this.getTension();d.beginPath(),d.moveTo(b[0].x,b[0].y);if(e!==0&&c>2){var f=this.allPoints,g=f.length,h=0;while(h<g-1)d.bezierCurveTo(f[h].x,f[h++].y,f[h].x,f[h++].y,f[h].x,f[h++].y)}else for(var h=1;h<c;h++){var i=b[h];d.lineTo(i.x,i.y)}d.closePath(),a.fillStroke(this)},_setAllPoints:function(){var a=this.getPoints(),b=a.length,c=this.getTension(),d=Kinetic.Spline._getControlPoints(a[b-1],a[0],a[1],c),e=Kinetic.Spline._getControlPoints(a[b-2],a[b-1],a[0],c);Kinetic.Spline.prototype._setAllPoints.call(this),this.allPoints.unshift(d[1]),this.allPoints.push(e[0]),this.allPoints.push(a[b-1]),this.allPoints.push(e[1]),this.allPoints.push(d[0]),this.allPoints.push(a[0])}},Kinetic.Global.extend(Kinetic.Blob,Kinetic.Spline)}(),function(){Kinetic.Sprite=function(a){this._initSprite(a)},Kinetic.Sprite.prototype={_initSprite:function(a){this.setDefaultAttrs({index:0,frameRate:17}),Kinetic.Shape.call(this,a),this.shapeType="Sprite",this._setDrawFuncs(),this.anim=new Kinetic.Animation;var b=this;this.on("animationChange",function(){b.setIndex(0)})},drawFunc:function(a){var b=this.attrs.animation,c=this.attrs.index,d=this.attrs.animations[b][c],e=a.getContext(),f=this.attrs.image;f&&e.drawImage(f,d.x,d.y,d.width,d.height,0,0,d.width,d.height)},drawHitFunc:function(a){var b=this.attrs.animation,c=this.attrs.index,d=this.attrs.animations[b][c],e=a.getContext();e.beginPath(),e.rect(0,0,d.width,d.height),e.closePath(),a.fill(this)},start:function(){var a=this,b=this.getLayer();this.anim.node=b,this.interval=setInterval(function(){var b=a.attrs.index;a._updateIndex(),a.afterFrameFunc&&b===a.afterFrameIndex&&(a.afterFrameFunc(),delete a.afterFrameFunc,delete a.afterFrameIndex)},1e3/this.attrs.frameRate),this.anim.start()},stop:function(){this.anim.stop(),clearInterval(this.interval)},afterFrame:function(a,b){this.afterFrameIndex=a,this.afterFrameFunc=b},_updateIndex:function(){var a=this.attrs.index,b=this.attrs.animation;a<this.attrs.animations[b].length-1?this.attrs.index++:this.attrs.index=0}},Kinetic.Global.extend(Kinetic.Sprite,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Sprite,["animation","animations","index"])}(),function(){Kinetic.Star=function(a){this._initStar(a)},Kinetic.Star.prototype={_initStar:function(a){this.setDefaultAttrs({numPoints:0,innerRadius:0,outerRadius:0}),Kinetic.Shape.call(this,a),this.shapeType="Star",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.innerRadius,d=this.attrs.outerRadius,e=this.attrs.numPoints;b.beginPath(),b.moveTo(0,0-this.attrs.outerRadius);for(var f=1;f<e*2;f++){var g=f%2===0?d:c,h=g*Math.sin(f*Math.PI/e),i=-1*g*Math.cos(f*Math.PI/e);b.lineTo(h,i)}b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Star,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.Star,["numPoints","innerRadius","outerRadius"])}(),function(){Kinetic.RegularPolygon=function(a){this._initRegularPolygon(a)},Kinetic.RegularPolygon.prototype={_initRegularPolygon:function(a){this.setDefaultAttrs({radius:0,sides:0}),Kinetic.Shape.call(this,a),this.shapeType="RegularPolygon",this._setDrawFuncs()},drawFunc:function(a){var b=a.getContext(),c=this.attrs.sides,d=this.attrs.radius;b.beginPath(),b.moveTo(0,0-d);for(var e=1;e<c;e++){var f=d*Math.sin(e*2*Math.PI/c),g=-1*d*Math
.cos(e*2*Math.PI/c);b.lineTo(f,g)}b.closePath(),a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.RegularPolygon,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon,["radius","sides"])}(),function(){Kinetic.Path=function(a){this._initPath(a)},Kinetic.Path.prototype={_initPath:function(a){this.dataArray=[];var b=this;Kinetic.Shape.call(this,a),this.shapeType="Path",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange",function(){b.dataArray=Kinetic.Path.parsePathData(b.attrs.data)})},drawFunc:function(a){var b=this.dataArray,c=a.getContext();c.beginPath();for(var d=0;d<b.length;d++){var e=b[d].command,f=b[d].points;switch(e){case"L":c.lineTo(f[0],f[1]);break;case"M":c.moveTo(f[0],f[1]);break;case"C":c.bezierCurveTo(f[0],f[1],f[2],f[3],f[4],f[5]);break;case"Q":c.quadraticCurveTo(f[0],f[1],f[2],f[3]);break;case"A":var g=f[0],h=f[1],i=f[2],j=f[3],k=f[4],l=f[5],m=f[6],n=f[7],o=i>j?i:j,p=i>j?1:i/j,q=i>j?j/i:1;c.translate(g,h),c.rotate(m),c.scale(p,q),c.arc(0,0,o,k,k+l,1-n),c.scale(1/p,1/q),c.rotate(-m),c.translate(-g,-h);break;case"z":c.closePath()}}a.fillStroke(this)}},Kinetic.Global.extend(Kinetic.Path,Kinetic.Shape),Kinetic.Path.getLineLength=function(a,b,c,d){return Math.sqrt((c-a)*(c-a)+(d-b)*(d-b))},Kinetic.Path.getPointOnLine=function(a,b,c,d,e,f,g){f===undefined&&(f=b),g===undefined&&(g=c);var h=(e-c)/(d-b+1e-8),i=Math.sqrt(a*a/(1+h*h));d<b&&(i*=-1);var j=h*i,k;if((g-c)/(f-b+1e-8)===h)k={x:f+i,y:g+j};else{var l,m,n=this.getLineLength(b,c,d,e);if(n<1e-8)return undefined;var o=(f-b)*(d-b)+(g-c)*(e-c);o/=n*n,l=b+o*(d-b),m=c+o*(e-c);var p=this.getLineLength(f,g,l,m),q=Math.sqrt(a*a-p*p);i=Math.sqrt(q*q/(1+h*h)),d<b&&(i*=-1),j=h*i,k={x:l+i,y:m+j}}return k},Kinetic.Path.getPointOnCubicBezier=function(a,b,c,d,e,f,g,h,i){function j(a){return a*a*a}function k(a){return 3*a*a*(1-a)}function l(a){return 3*a*(1-a)*(1-a)}function m(a){return(1-a)*(1-a)*(1-a)}var n=h*j(a)+f*k(a)+d*l(a)+b*m(a),o=i*j(a)+g*k(a)+e*l(a)+c*m(a);return{x:n,y:o}},Kinetic.Path.getPointOnQuadraticBezier=function(a,b,c,d,e,f,g){function h(a){return a*a}function i(a){return 2*a*(1-a)}function j(a){return(1-a)*(1-a)}var k=f*h(a)+d*i(a)+b*j(a),l=g*h(a)+e*i(a)+c*j(a);return{x:k,y:l}},Kinetic.Path.getPointOnEllipticalArc=function(a,b,c,d,e,f){var g=Math.cos(f),h=Math.sin(f),i={x:c*Math.cos(e),y:d*Math.sin(e)};return{x:a+(i.x*g-i.y*h),y:b+(i.x*h+i.y*g)}},Kinetic.Path.parsePathData=function(a){if(!a)return[];var b=a,c=["m","M","l","L","v","V","h","H","z","Z","c","C","q","Q","t","T","s","S","a","A"];b=b.replace(new RegExp(" ","g"),",");for(var d=0;d<c.length;d++)b=b.replace(new RegExp(c[d],"g"),"|"+c[d]);var e=b.split("|"),f=[],g=0,h=0;for(var d=1;d<e.length;d++){var i=e[d],j=i.charAt(0);i=i.slice(1),i=i.replace(new RegExp(",-","g"),"-"),i=i.replace(new RegExp("-","g"),",-"),i=i.replace(new RegExp("e,-","g"),"e-");var k=i.split(",");k.length>0&&k[0]===""&&k.shift();for(var l=0;l<k.length;l++)k[l]=parseFloat(k[l]);while(k.length>0){if(isNaN(k[0]))break;var m=null,n=[],o=g,p=h;switch(j){case"l":g+=k.shift(),h+=k.shift(),m="L",n.push(g,h);break;case"L":g=k.shift(),h=k.shift(),n.push(g,h);break;case"m":g+=k.shift(),h+=k.shift(),m="M",n.push(g,h),j="l";break;case"M":g=k.shift(),h=k.shift(),m="M",n.push(g,h),j="L";break;case"h":g+=k.shift(),m="L",n.push(g,h);break;case"H":g=k.shift(),m="L",n.push(g,h);break;case"v":h+=k.shift(),m="L",n.push(g,h);break;case"V":h=k.shift(),m="L",n.push(g,h);break;case"C":n.push(k.shift(),k.shift(),k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"c":n.push(g+k.shift(),h+k.shift(),g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"S":var q=g,r=h,s=f[f.length-1];s.command==="C"&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,k.shift(),k.shift()),g=k.shift(),h=k.shift(),m="C",n.push(g,h);break;case"s":var q=g,r=h,s=f[f.length-1];s.command==="C"&&(q=g+(g-s.points[2]),r=h+(h-s.points[3])),n.push(q,r,g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="C",n.push(g,h);break;case"Q":n.push(k.shift(),k.shift()),g=k.shift(),h=k.shift(),n.push(g,h);break;case"q":n.push(g+k.shift(),h+k.shift()),g+=k.shift(),h+=k.shift(),m="Q",n.push(g,h);break;case"T":var q=g,r=h,s=f[f.length-1];s.command==="Q"&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g=k.shift(),h=k.shift(),m="Q",n.push(q,r,g,h);break;case"t":var q=g,r=h,s=f[f.length-1];s.command==="Q"&&(q=g+(g-s.points[0]),r=h+(h-s.points[1])),g+=k.shift(),h+=k.shift(),m="Q",n.push(q,r,g,h);break;case"A":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g=k.shift(),h=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v);break;case"a":var t=k.shift(),u=k.shift(),v=k.shift(),w=k.shift(),x=k.shift(),y=g,z=h;g+=k.shift(),h+=k.shift(),m="A",n=this.convertEndpointToCenterParameterization(y,z,g,h,w,x,t,u,v)}f.push({command:m||j,points:n,start:{x:o,y:p},pathLength:this.calcLength(o,p,m||j,n)})}(j==="z"||j==="Z")&&f.push({command:"z",points:[],start:undefined,pathLength:0})}return f},Kinetic.Path.calcLength=function(a,b,c,d){var e,f,g,h=Kinetic.Path;switch(c){case"L":return h.getLineLength(a,b,d[0],d[1]);case"C":e=0,f=h.getPointOnCubicBezier(0,a,b,d[0],d[1],d[2],d[3],d[4],d[5]);for(t=.01;t<=1;t+=.01)g=h.getPointOnCubicBezier(t,a,b,d[0],d[1],d[2],d[3],d[4],d[5]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"Q":e=0,f=h.getPointOnQuadraticBezier(0,a,b,d[0],d[1],d[2],d[3]);for(t=.01;t<=1;t+=.01)g=h.getPointOnQuadraticBezier(t,a,b,d[0],d[1],d[2],d[3]),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return e;case"A":e=0;var i=d[4],j=d[5],k=d[4]+j,l=Math.PI/180;Math.abs(i-k)<l&&(l=Math.abs(i-k)),f=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],i,0);if(j<0)for(t=i-l;t>k;t-=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;else for(t=i+l;t<k;t+=l)g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],t,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),f=g;return g=h.getPointOnEllipticalArc(d[0],d[1],d[2],d[3],k,0),e+=h.getLineLength(f.x,f.y,g.x,g.y),e}return 0},Kinetic.Path.convertEndpointToCenterParameterization=function(a,b,c,d,e,f,g,h,i){var j=i*(Math.PI/180),k=Math.cos(j)*(a-c)/2+Math.sin(j)*(b-d)/2,l=-1*Math.sin(j)*(a-c)/2+Math.cos(j)*(b-d)/2,m=k*k/(g*g)+l*l/(h*h);m>1&&(g*=Math.sqrt(m),h*=Math.sqrt(m));var n=Math.sqrt((g*g*h*h-g*g*l*l-h*h*k*k)/(g*g*l*l+h*h*k*k));e==f&&(n*=-1),isNaN(n)&&(n=0);var o=n*g*l/h,p=n*-h*k/g,q=(a+c)/2+Math.cos(j)*o-Math.sin(j)*p,r=(b+d)/2+Math.sin(j)*o+Math.cos(j)*p,s=function(a){return Math.sqrt(a[0]*a[0]+a[1]*a[1])},t=function(a,b){return(a[0]*b[0]+a[1]*b[1])/(s(a)*s(b))},u=function(a,b){return(a[0]*b[1]<a[1]*b[0]?-1:1)*Math.acos(t(a,b))},v=u([1,0],[(k-o)/g,(l-p)/h]),w=[(k-o)/g,(l-p)/h],x=[(-1*k-o)/g,(-1*l-p)/h],y=u(w,x);return t(w,x)<=-1&&(y=Math.PI),t(w,x)>=1&&(y=0),f===0&&y>0&&(y-=2*Math.PI),f==1&&y<0&&(y+=2*Math.PI),[q,r,g,h,v,y,j,f]},Kinetic.Node.addGettersSetters(Kinetic.Path,["data"])}(),function(){function a(a){a.fillText(this.partialText,0,0)}function b(a){a.strokeText(this.partialText,0,0)}Kinetic.TextPath=function(a){this._initTextPath(a)},Kinetic.TextPath.prototype={_initTextPath:function(c){this.setDefaultAttrs({fontFamily:"Calibri",fontSize:12,fontStyle:"normal",text:""}),this.dummyCanvas=document.createElement("canvas"),this.dataArray=[];var d=this;Kinetic.Shape.call(this,c),this._fillFunc=a,this._strokeFunc=b,this.shapeType="TextPath",this._setDrawFuncs(),this.dataArray=Kinetic.Path.parsePathData(this.attrs.data),this.on("dataChange",function(){d.dataArray=Kinetic.Path.parsePathData(this.attrs.data)});var e=["text","textStroke","textStrokeWidth"];for(var f=0;f<e.length;f++){var g=e[f];this.on(g+"Change",d._setTextData)}d._setTextData()},drawFunc:function(a){var b=this.charArr,c=a.getContext();c.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"pt "+this.attrs.fontFamily,c.textBaseline="middle",c.textAlign="left",c.save();var d=this.glyphInfo;for(var e=0;e<d.length;e++){c.save();var f=d[e].p0,g=d[e].p1,h=parseFloat(this.attrs.fontSize);c.translate(f.x,f.y),c.rotate(d[e].rotation),this.partialText=d[e].text,a.fillStroke(this),c.restore()}c.restore()},getTextWidth:function(){return this.textWidth},getTextHeight:function(){return this.textHeight},setText:function(a){Kinetic.Text.prototype.setText.call(this,a)},_getTextSize:function(a){var b=this.dummyCanvas,c=b.getContext("2d");c.save(),c.font=this.attrs.fontStyle+" "+this.attrs.fontSize+"pt "+this.attrs.fontFamily;var d=c.measureText(a);return c.restore(),{width:d.width,height:parseInt(this.attrs.fontSize,10)}},_setTextData:function(){var a=this,b=this._getTextSize(this.attrs.text);this.textWidth=b.width,this.textHeight=b.height,this.glyphInfo=[];var c=this.attrs.text.split(""),d,e,f,g=-1,h=0,i=function(){h=0;var b=a.dataArray;for(var c=g+1;c<b.length;c++){if(b[c].pathLength>0)return g=c,b[c];b[c].command=="M"&&(d={x:b[c].points[0],y:b[c].points[1]})}return{}},j=function(b,c){var g=a._getTextSize(b).width,j=0,k=0,l=!1;e=undefined;while(Math.abs(g-j)/g>.01&&k<25){k++;var m=j;while(f===undefined)f=i(),f&&m+f.pathLength<g&&(m+=f.pathLength,f=undefined);if(f==={}||d===undefined)return undefined;var n=!1;switch(f.command){case"L":Kinetic.Path.getLineLength(d.x,d.y,f.points[0],f.points[1])>g?e=Kinetic.Path.getPointOnLine(g,d.x,d.y,f.points[0],f.points[1],d.x,d.y):f=undefined;break;case"A":var o=f.points[4],p=f.points[5],q=f.points[4]+p;h===0?h=o+1e-8:g>j?h+=Math.PI/180*p/Math.abs(p):h-=Math.PI/360*p/Math.abs(p),Math.abs(h)>Math.abs(q)&&(h=q,n=!0),e=Kinetic.Path.getPointOnEllipticalArc(f.points[0],f.points[1],f.points[2],f.points[3],h,f.points[6]);break;case"C":h===0?g>f.pathLength?h=1e-8:h=g/f.pathLength:g>j?h+=(g-j)/f.pathLength:h-=(j-g)/f.pathLength,h>1&&(h=1,n=!0),e=Kinetic.Path.getPointOnCubicBezier(h,f.start.x,f.start.y,f.points[0],f.points[1],f.points[2],f.points[3],f.points[4],f.points[5]);break;case"Q":h===0?h=g/f.pathLength:g>j?h+=(g-j)/f.pathLength:h-=(j-g)/f.pathLength,h>1&&(h=1,n=!0),e=Kinetic.Path.getPointOnQuadraticBezier(h,f.start.x,f.start.y,f.points[0],f.points[1],f.points[2],f.points[3])}e!==undefined&&(j=Kinetic.Path.getLineLength(d.x,d.y,e.x,e.y)),n&&(n=!1,f=undefined)}};for(var k=0;k<c.length;k++){j(c[k]);if(d===undefined||e===undefined)break;var l=Kinetic.Path.getLineLength(d.x,d.y,e.x,e.y),m=0,n=Kinetic.Path.getPointOnLine(m+l/2,d.x,d.y,e.x,e.y),o=Math.atan2(e.y-d.y,e.x-d.x);this.glyphInfo.push({transposeX:n.x,transposeY:n.y,text:c[k],rotation:o,p0:d,p1:e}),d=e}}},Kinetic.Global.extend(Kinetic.TextPath,Kinetic.Shape),Kinetic.Node.addGettersSetters(Kinetic.TextPath,["fontFamily","fontSize","fontStyle"]),Kinetic.Node.addGetters(Kinetic.TextPath,["text"])}();

},{}],8:[function(require,module,exports){
var Kinetic = require('./kinetic-v4.3.2.min.js')

var Llave = function (x, y, imagen) {
  Kinetic.Image.call(this)
  this.setWidth(30)
  this.setX(x)
  this.setY(y)
  this.setImage(imagen)
  this.setHeight(40)
}

Llave.prototype = Object.create(Kinetic.Image.prototype)

module.exports = Llave

},{"./kinetic-v4.3.2.min.js":7}],9:[function(require,module,exports){
var Kinetic = require('./kinetic-v4.3.2.min.js')

var Moneda = function (x, y, imagen) {
  Kinetic.Image.call(this)
  this.setWidth(30)
  this.setHeight(30)
  this.setX(x)
  this.setY(y)
  this.setImage(imagen)
}

Moneda.prototype = Object.create(Kinetic.Image.prototype)

module.exports = Moneda

},{"./kinetic-v4.3.2.min.js":7}],10:[function(require,module,exports){
var Kinetic = require('./kinetic-v4.3.2.min.js')

var Plataforma = function (x, y, imagen) {
  Kinetic.Rect.call(this)
  this.setWidth(200)
  this.setHeight(40)
  this.setX(x)
  this.setY(y)
  this.setFillPatternImage(imagen) // textura
}

Plataforma.prototype = Object.create(Kinetic.Rect.prototype)

module.exports = Plataforma

},{"./kinetic-v4.3.2.min.js":7}],11:[function(require,module,exports){
/**
* PreloadJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
**/(function(g){var c=function(){this.init()};c.prototype={};var a=c.prototype;a.loaded=false;a.progress=0;a._item=null;a.onProgress=null;a.onLoadStart=null;a.onFileLoad=null;a.onFileProgress=null;a.onComplete=null;a.onError=null;a.getItem=function(){return this._item};a.init=function(){};a.load=function(){};a.cancel=function(){};a._sendLoadStart=function(){if(this.onLoadStart)this.onLoadStart({target:this})};a._sendProgress=function(a){var f;if(a instanceof Number)this.progress=a,f={loaded:this.progress,
total:1};else if(f=a,this.progress=a.loaded/a.total,isNaN(this.progress)||this.progress==Infinity)this.progress=0;f.target=this;if(this.onProgress)this.onProgress(f)};a._sendFileProgress=function(a){if(this.onFileProgress)a.target=this,this.onFileProgress(a)};a._sendComplete=function(){if(this.onComplete)this.onComplete({target:this})};a._sendFileComplete=function(a){if(this.onFileLoad)a.target=this,this.onFileLoad(a)};a._sendError=function(a){if(this.onError)a==null&&(a={}),a.target=this,this.onError(a)};
a.toString=function(){return"[PreloadJS AbstractLoader]"};g.AbstractLoader=c})(window);(function(g){function c(){}var a=function(a){this.initialize(a)},b=a.prototype=new AbstractLoader;a.IMAGE="image";a.SOUND="sound";a.JSON="json";a.JAVASCRIPT="javascript";a.CSS="css";a.XML="xml";a.TEXT="text";a.TIMEOUT_TIME=8E3;b.useXHR=true;b.stopOnError=false;b.maintainScriptOrder=true;b.next=null;b.typeHandlers=null;b.extensionHandlers=null;b._maxConnections=1;b._currentLoads=null;b._loadQueue=null;b._loadedItemsById=null;b._loadedItemsBySrc=null;b._targetProgress=0;b._numItems=0;b._numItemsLoaded=
null;b._scriptOrder=null;b._loadedScripts=null;b.TAG_LOAD_OGGS=true;b.initialize=function(a){this._targetProgress=this._numItemsLoaded=this._numItems=0;this._paused=false;this._currentLoads=[];this._loadQueue=[];this._scriptOrder=[];this._loadedScripts=[];this._loadedItemsById={};this._loadedItemsBySrc={};this.typeHandlers={};this.extensionHandlers={};this.useXHR=a!=false&&g.XMLHttpRequest!=null;this.determineCapabilities()};b.determineCapabilities=function(){var f=a.lib.BrowserDetect;if(f!=null)a.TAG_LOAD_OGGS=
f.isFirefox||f.isOpera};a.isBinary=function(f){switch(f){case a.IMAGE:case a.SOUND:return true;default:return false}};b.installPlugin=function(a){if(!(a==null||a.getPreloadHandlers==null)){a=a.getPreloadHandlers();if(a.types!=null)for(var b=0,d=a.types.length;b<d;b++)this.typeHandlers[a.types[b]]=a.callback;if(a.extensions!=null)for(b=0,d=a.extensions.length;b<d;b++)this.extensionHandlers[a.extensions[b]]=a.callback}};b.setMaxConnections=function(a){this._maxConnections=a;this._paused||this._loadNext()};
b.loadFile=function(a,b){this._addItem(a);b!==false&&this.setPaused(false)};b.loadManifest=function(a,b){var d;a instanceof Array?d=a:a instanceof Object&&(d=[a]);for(var c=0,g=d.length;c<g;c++)this._addItem(d[c],false);b!==false&&this._loadNext()};b.load=function(){this.setPaused(false)};b.getResult=function(a){return this._loadedItemsById[a]||this._loadedItemsBySrc[a]};b.setPaused=function(a){(this._paused=a)||this._loadNext()};b.close=function(){for(;this._currentLoads.length;)this._currentLoads.pop().cancel();
this._currentLoads=[];this._scriptOrder=[];this._loadedScripts=[]};b._addItem=function(f){f=this._createLoadItem(f);f!=null&&(this._loadQueue.push(f),this._numItems++,this._updateProgress(),f.getItem().type==a.JAVASCRIPT&&(this._scriptOrder.push(f.getItem()),this._loadedScripts.push(null)))};b._loadNext=function(){if(!this._paused){this._loadQueue.length==0&&(this._sendComplete(),this.next&&this.next.load&&this.next.load.apply(this.next));for(;this._loadQueue.length&&this._currentLoads.length<this._maxConnections;){var f=
this._loadQueue.shift();f.onProgress=a.proxy(this._handleProgress,this);f.onComplete=a.proxy(this._handleFileComplete,this);f.onError=a.proxy(this._handleFileError,this);this._currentLoads.push(f);f.load()}}};b._handleFileError=function(a){var a=a.target,b=this._createResultData(a.getItem());this._numItemsLoaded++;this._updateProgress();this._sendError(b);this.stopOnError||(this._removeLoadItem(a),this._loadNext())};b._createResultData=function(a){return{id:a.id,result:null,data:a.data,type:a.type,
src:a.src}};b._handleFileComplete=function(b){this._numItemsLoaded++;var b=b.target,e=b.getItem();this._removeLoadItem(b);var d=this._createResultData(e);d.result=b instanceof a.lib.XHRLoader?this._createResult(e,b.getResult()):e.tag;this._loadedItemsById[e.id]=d;this._loadedItemsBySrc[e.src]=d;var c=this;switch(e.type){case a.IMAGE:if(b instanceof a.lib.XHRLoader){d.result.onload=function(){c._handleFileTagComplete(e,d)};return}break;case a.JAVASCRIPT:if(this.maintainScriptOrder){this._loadedScripts[this._scriptOrder.indexOf(e)]=
e;this._checkScriptLoadOrder();return}}this._handleFileTagComplete(e,d)};b._checkScriptLoadOrder=function(){for(var a=this._loadedScripts.length,b=0;b<a;b++){var d=this._loadedScripts[b];if(d===null)break;if(d!==true){var d=this.getResult(d.src),c=this._createResultData(d);c.result=d.result;this._handleFileTagComplete(d,c);this._loadedScripts[b]=true;b--;a--}}};b._handleFileTagComplete=function(a,b){a.completeHandler&&a.completeHandler(b);this._updateProgress();this._sendFileComplete(b);this._loadNext()};
b._removeLoadItem=function(a){for(var b=this._currentLoads.length,d=0;d<b;d++)if(this._currentLoads[d]==a){this._currentLoads.splice(d,1);break}};b._createResult=function(b,e){var d=null,c;switch(b.type){case a.IMAGE:d=this._createImage();break;case a.SOUND:d=b.tag||this._createAudio();break;case a.CSS:d=this._createLink();break;case a.JAVASCRIPT:d=this._createScript();break;case a.XML:if(g.DOMParser){var h=new DOMParser;h.parseFromString(e,"text/xml")}else h=new ActiveXObject("Microsoft.XMLDOM"),
h.async=false,h.loadXML(e),c=h;break;case a.JSON:case a.TEXT:c=e}return d?(b.type==a.CSS?d.href=b.src:d.src=b.src,d):c};b._handleProgress=function(a){var a=a.target,b=this._createResultData(a.getItem());b.progress=a.progress;this._sendFileProgress(b);this._updateProgress()};b._updateProgress=function(){var a=this._numItemsLoaded/this._numItems,b=this._numItems-this._numItemsLoaded;if(b>0){for(var d=0,c=0,g=this._currentLoads.length;c<g;c++)d+=this._currentLoads[c].progress;a+=d/b*(b/this._numItems)}this._sendProgress({loaded:a,
total:1})};b._createLoadItem=function(b){var e={};switch(typeof b){case "string":e.src=b;break;case "object":b instanceof HTMLAudioElement?(e.tag=b,e.src=e.tag.src,e.type=a.SOUND):e=b}e.ext=this._getNameAfter(e.src,".");if(!e.type)e.type=this.getType(e.ext);if(e.id==null||e.id=="")e.id=e.src;if(b=this.typeHandlers[e.type]||this.extensionHandlers[e.ext]){b=b(e.src,e.type,e.id,e.data);if(b===false)return null;else if(b!==true){if(b.src!=null)e.src=b.src;if(b.id!=null)e.id=b.id;if(b.tag!=null&&b.tag.load instanceof
Function)e.tag=b.tag}e.ext=this._getNameAfter(e.src,".")}b=this.useXHR;switch(e.type){case a.JSON:case a.XML:case a.TEXT:b=true;break;case a.SOUND:e.ext=="ogg"&&a.TAG_LOAD_OGGS&&(b=false)}if(b)return new a.lib.XHRLoader(e);else if(e.tag)return new a.lib.TagLoader(e);else{var d,b="src",c=false;switch(e.type){case a.IMAGE:d=this._createImage();break;case a.SOUND:d=this._createAudio();break;case a.CSS:b="href";c=true;d=this._createLink();break;case a.JAVASCRIPT:c=true,d=this._createScript()}e.tag=d;
return new a.lib.TagLoader(e,b,c)}};b.getType=function(b){switch(b){case "jpeg":case "jpg":case "gif":case "png":return a.IMAGE;case "ogg":case "mp3":case "wav":return a.SOUND;case "json":return a.JSON;case "xml":return a.XML;case "css":return a.CSS;case "js":return a.JAVASCRIPT;default:return a.TEXT}};b._getNameAfter=function(a,b){var d=a.lastIndexOf(b),d=a.substr(d+1),c=d.lastIndexOf(/[\b|\?|\#|\s]/);return c==-1?d:d.substr(0,c)};b._createImage=function(){return document.createElement("img")};b._createAudio=
function(){var a=document.createElement("audio");a.autoplay=false;a.type="audio/ogg";return a};b._createScript=function(){var a=document.createElement("script");a.type="text/javascript";return a};b._createLink=function(){var a=document.createElement("link");a.type="text/css";a.rel="stylesheet";return a};b.toString=function(){return"[PreloadJS]"};a.proxy=function(a,b){return function(c){return a.apply(b,arguments)}};a.lib={};g.PreloadJS=a;c.init=function(){var a=navigator.userAgent;c.isFirefox=a.indexOf("Firefox")>
-1;c.isOpera=g.opera!=null;c.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1};c.init();a.lib.BrowserDetect=c})(window);(function(){var g=function(a,b,c){this.init(a,b,c)},c=g.prototype=new AbstractLoader;c._srcAttr=null;c._loadTimeOutTimeout=null;c.tagCompleteProxy=null;c.init=function(a,b,c){this._item=a;this._srcAttr=b||"src";this._useXHR=c==true;this.isAudio=a.tag instanceof HTMLAudioElement;this.tagCompleteProxy=PreloadJS.proxy(this._handleTagLoad,this)};c.cancel=function(){this._clean();var a=this.getItem();if(a!=null)a.src=null};c.load=function(){this._useXHR?this.loadXHR():this.loadTag()};c.loadXHR=function(){var a=
this.getItem(),a=new PreloadJS.lib.XHRLoader(a);a.onProgress=PreloadJS.proxy(this._handleProgress,this);a.onFileLoad=PreloadJS.proxy(this._handleXHRComplete,this);a.onFileError=PreloadJS.proxy(this._handleLoadError,this);a.load()};c._handleXHRComplete=function(a){this._clean();var b=a.getItem();a.getResult();b.type==PreloadJS.IMAGE?(b.tag.onload=PreloadJS.proxy(this._sendComplete,this),b.tag.src=b.src):(b.tag[this._srcAttr]=b.src,this._sendComplete())};c._handleLoadError=function(a){this._clean();
this._sendError(a)};c.loadTag=function(){var a=this.getItem(),b=a.tag;clearTimeout(this._loadTimeOutTimeout);this._loadTimeOutTimeout=setTimeout(PreloadJS.proxy(this._handleLoadTimeOut,this),PreloadJS.TIMEOUT_TIME);if(this.isAudio)b.src=null,b.preload="auto",b.setAttribute("data-temp","true");b.onerror=PreloadJS.proxy(this._handleLoadError,this);b.onprogress=PreloadJS.proxy(this._handleProgress,this);this.isAudio?(b.onstalled=PreloadJS.proxy(this._handleStalled,this),b.addEventListener("canplaythrough",
this.tagCompleteProxy)):b.onload=PreloadJS.proxy(this._handleTagLoad,this);b[this._srcAttr]=a.src;a=a.type==PreloadJS.SOUND&&a.ext=="ogg"&&PreloadJS.lib.BrowserDetect.isFirefox;b.load!=null&&!a&&b.load()};c._handleLoadTimeOut=function(){this._clean();this._sendError()};c._handleStalled=function(){};c._handleLoadError=function(){this._clean();this._sendError()};c._handleTagLoad=function(){var a=this.getItem().tag;clearTimeout(this._loadTimeOutTimeout);if(!(this.isAudio&&a.readyState!==4)&&!this.loaded)this.loaded=
true,this._clean(),this._sendComplete()};c._clean=function(){clearTimeout(this._loadTimeOutTimeout);var a=this.getItem().tag;a.onload=null;a.removeEventListener("canplaythrough",this.tagCompleteProxy);a.onstalled=null;a.onprogress=null;a.onerror=null};c._handleProgress=function(a){clearTimeout(this._loadTimeOutTimeout);if(this.isAudio){a=this.getItem();if(a.buffered==null)return;a={loaded:a.buffered.length>0?a.buffered.end(0):0,total:a.duration}}this._sendProgress(a)};c.toString=function(){return"[PreloadJS TagLoader]"};
PreloadJS.lib.TagLoader=g})(window);(function(g){var c=function(a){this.init(a)},a=c.prototype=new AbstractLoader;a._wasLoaded=false;a._request=null;a._loadTimeOutTimeout=null;a._xhrLevel=null;a.init=function(a){this._item=a;this._createXHR(a)};a.getResult=function(){try{return this._request.responseText}catch(a){}return this._request.response};a.cancel=function(){this._clean();this._request.abort()};a.load=function(){if(this._request==null)this.handleError();else{if(this._xhrLevel==1)this._loadTimeOutTimeout=setTimeout(PreloadJS.proxy(this.handleTimeout,
this),PreloadJS.TIMEOUT_TIME);this._request.onloadstart=PreloadJS.proxy(this.handleLoadStart,this);this._request.onprogress=PreloadJS.proxy(this.handleProgress,this);this._request.onabort=PreloadJS.proxy(this.handleAbort,this);this._request.onerror=PreloadJS.proxy(this.handleError,this);this._request.ontimeout=PreloadJS.proxy(this.handleTimeout,this);this._request.onload=PreloadJS.proxy(this.handleLoad,this);this._request.onreadystatechange=PreloadJS.proxy(this.handleReadyStateChange,this);try{this._request.send()}catch(a){}}};
a.handleProgress=function(a){a.loaded>0&&a.total==0||this._sendProgress({loaded:a.loaded,total:a.total})};a.handleLoadStart=function(){clearTimeout(this._loadTimeOutTimeout);this._sendLoadStart()};a.handleAbort=function(){this._clean();this._sendError()};a.handleError=function(){this._clean();this._sendError()};a.handleReadyStateChange=function(){this._request.readyState==4&&this.handleLoad()};a._checkError=function(){switch(parseInt(this._request.status)){case 404:case 0:return false}if(this._request.response==
null){try{if(this._request.responseXML!=null)return true}catch(a){}return false}return true};a.handleLoad=function(){if(!this.loaded)this.loaded=true,this._checkError()?(this._clean(),this._sendComplete()):this.handleError()};a.handleTimeout=function(){this._clean();this._sendError()};a.handleLoadEnd=function(){this._clean()};a._createXHR=function(a){this._xhrLevel=1;if(g.ArrayBuffer)this._xhrLevel=2;if(g.XMLHttpRequest)this._request=new XMLHttpRequest;else try{this._request=new ActiveXObject("MSXML2.XMLHTTP.3.0")}catch(c){return null}a.type==
PreloadJS.TEXT&&this._request.overrideMimeType("text/plain; charset=x-user-defined");this._request.open("GET",a.src,true);if(PreloadJS.isBinary(a.type))this._request.responseType="arraybuffer";return true};a._clean=function(){clearTimeout(this._loadTimeOutTimeout);var a=this._request;a.onloadstart=null;a.onprogress=null;a.onabort=null;a.onerror=null;a.onload=null;a.ontimeout=null;a.onloadend=null;a.onreadystatechange=null;clearInterval(this._checkLoadInterval)};a.toString=function(){return"[PreloadJS XHRLoader]"};
PreloadJS.lib.XHRLoader=c})(window);

},{}],12:[function(require,module,exports){
var Kinetic = require('./kinetic-v4.3.2.min.js')

var Puerta = function (x, y, img) {
  Kinetic.Image.call(this)
  this.setHeight(70)
  this.setX(x)
  this.setY(y)
  this.setImage(img)
}

Puerta.prototype = Object.create(Kinetic.Image.prototype)

module.exports = Puerta

},{"./kinetic-v4.3.2.min.js":7}]},{},[6]);
