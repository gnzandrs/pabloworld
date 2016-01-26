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

  this.caminar = function () {
    this.setAnimation('caminar')

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

