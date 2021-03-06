import initializer from './init'
import serverUtils from './utils/server'

const Koa = require('koa')
const path = require('path')
const views = require('koa-views')
const serve = require('koa-static')

const app = new Koa()

const bodyParser = require('koa-bodyparser')
app.use(bodyParser())

// Must be used before any router is used
app.use(views(__dirname + '/views', {
  map: {
    html: 'ejs'
  }
}))

app.use(serve(path.join(__dirname, '/public')))

// logger
app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time
app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})

// handle error
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.error(`UnHandler Exception - ${err.message}`)
    ctx.status = serverUtils.parseErrorCode(err)

    ctx.body = {
      message: err.message
    }
  }
})

/*
app.on('error', err => {
  console.error(`UnHandler Exception - ${err.message}`)
  // console.error('server error', err)
})
*/

initializer.initModules(app)
initializer.installRouters(app)

export default {
  createApp: () => {
    return app
  },
}
