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
  this.defaultPath = ''
  this.router = {}

  this.current = ''
  this.emitter = new Emitter()

  var that = this
  this.emitter.on('HISTORY_PUSH_STATE', function (route) {
    that.handler(route)
  })
  window.addEventListener('popstate', function (event) {
    that.popstate(event)
  })
}

HistoryUtil.prototype.init = function () {
  this.hash = parseParams(location.hash)
  this.search = parseParams(location.search)

  var page = this.search.page
  if (page && this.router[page]) {
    this.current = page
    this.handler({ path: page })
  } else if (this.defaultPath) {
    this.current = this.defaultPath
    this.handler({ path: this.current })
  }
}

HistoryUtil.prototype.popstate = function (event) {
  if (!event.state || !event.state.path) {
    return
  }

  var path = event.state.path
  if (!this.router[path] || path === this.current) {
    return
  }

  this.handler(event.state)
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
  if (!router || typeof router.route !== 'function') {
    return
  }

  this.router[path] = router
  if (!this.defaultPath || router.default === true) {
    this.defaultPath = path
  }
}

HistoryUtil.prototype.push = function (path, data) {
  this.history.pushState({ path: path, data: data }, '', '?page=' + path)
  this.emitter.trigger('HISTORY_PUSH_STATE', { path: path, data: data })
}

function generateAvatarBackground(avatar) {
  // `this` 指向 vm 实例
  var TARGET_COLORS = [
    '009933', '333399', '336699', '339999', '6633CC', '990033', 'FFCC66', '000', '999966'
  ]
  var index = Math.floor(Math.random() * TARGET_COLORS.length)
  var color = TARGET_COLORS[index]
  var blander = 'linear-gradient(#' + color + ', #' + color + ')'
  return {
    backgroundBlendMode: 'lighten',
    backgroundImage: 'url(' + avatar + '), ' + blander
  }
}
