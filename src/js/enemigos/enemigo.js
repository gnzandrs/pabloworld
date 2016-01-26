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
