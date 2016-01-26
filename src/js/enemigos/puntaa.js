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
