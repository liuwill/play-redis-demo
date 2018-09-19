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

// Logger
function Logger() {
  this.history = []
  var that = this

  var getNowTime = function () {
    return new Date().toLocaleString()
  }

  var printLog = function (msg, fontType, level) {
    var currentTime = getNowTime()
    that.history.push({
      msg: msg,
      type: fontType,
      currentTime: currentTime,
      level
    })

    var systemIcon = ""
    if (level === 'system') {
      systemIcon = '<span class="log-tag system">SYSTEM</span>'
    }
    var item = document.createElement("div")
    item.setAttribute("class", "log-msg " + fontType)
    item.innerHTML = "<span class='font-meta'>" + currentTime + ":</span>" + systemIcon + "<span>" + msg + "</span>"
    return item
  }

  this.success = function (msg) {
    return printLog(msg, "font-success")
  }

  this.info = function (msg) {
    return printLog(msg, "font-info")
  }

  this.warning = function (msg) {
    return printLog(msg, "font-warning")
  }

  this.error = function (msg) {
    return printLog(msg, "font-error")
  }

  this.system = function (msg) {
    return printLog(msg, "font-system", "system")
  }
}

// Event Emitter
function Emitter() {
  this.handlers = {}

  this.on = function (type, handler) {
    var handlers = this.handlers[type] || (this.handlers[type] = [])
    handlers.push(handler)
  }

  this.off = function (type, handler) {
    var handlers = this.handlers[type]
    handlers.splice(handlers.indexOf(handler), 1)
  }

  this.trigger = function (type, data) {
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

  this.reset = function () {
    for (var key in this.handlers) {
      this.handlers[key] = []
    }
  }
}
