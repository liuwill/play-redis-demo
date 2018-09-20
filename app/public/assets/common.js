// Dom Operations
function removeClass(domElement, className) {
  var rawClassName = domElement.className
  var clsList = rawClassName.split(" ")

  domElement.className = ""
  for (var i in clsList) {
    if (!clsList[i] || clsList[i] == className) {
      continue
    }
    domElement.className += " " + clsList[i]
  }
}

function addClass(domElement, className) {
  var rawClassName = domElement.className
  domElement.className = rawClassName + " " + className
}

// General Utils
function generateUid() {
  return Math.random().toString(36).substr(2, 9)
}

// Event Emitter
function Emitter() {
  this.handlers = {}
}

Emitter.prototype.on = function (type, handler) {
  var handlers = this.handlers[type] || (this.handlers[type] = [])
  handlers.push(handler)
}

Emitter.prototype.off = function (type, handler) {
  var handlers = this.handlers[type]
  handlers.splice(handlers.indexOf(handler), 1)
}

Emitter.prototype.trigger = function (type, data) {
  var handlers = this.handlers[type]
  if (!handlers) {
    return
  }

  for (var i in handlers) {
    handlers[i] && typeof handlers[i] === 'function' && (function (index) {
      var nextTicket = typeof process === 'undefined' && setTimeout || process.nextTicket
      nextTicket(function () {
        handlers[index].call(null, data)
      })
    })(i)
  }
}

Emitter.prototype.reset = function () {
  for (var key in this.handlers) {
    this.handlers[key] = []
  }
}
