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

function parseParams(raw) {
  var target = {}
  if (!raw) {
    return target
  }
  var param = raw.substr(1)
  var piece = param.split('&')
  for (var i in piece) {
    var item = piece[i]
    var meta = item.split('=')
    if (meta[0]) {
      target[meta[0]] = meta[1] || ''
    }
  }
  return target
}

function HistoryUtil(location, history) {
  this.history = history
  this.location = location
  this.router = {}

  this.current = ''
  this.emitter = new Emitter()

  this.emitter.on('HISTORY_PUSH_STATE', this.handler)
}

HistoryUtil.prototype.init = function () {
  this.hash = parseParams(location.hash)
  this.search = parseParams(location.search)

  var page = this.search.page
  if (page && this.router[page]) {
    this.current = page
    this.handler({ path: page })
  }
}

HistoryUtil.prototype.handler = function (route) {
  if (!this.router || !this.router.hasOwnProperty(route.path)) {
    return
  }

  this.current = route.path
  var config = this.router[route.path]
  config.route.call(null, route.data)
}

HistoryUtil.prototype.register = function (path, router) {
  if (router && typeof router.route === 'function') {
    this.router[path] = router
  }
}

HistoryUtil.prototype.push = function (path, data) {
  this.history.pushState(data, '', '?page=' + path)
  this.emitter.trigger('HISTORY_PUSH_STATE', { path: path, data: data })
}
