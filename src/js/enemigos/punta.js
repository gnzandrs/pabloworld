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
