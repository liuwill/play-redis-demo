import initializer from './init'

const Koa = require('koa')
const app = new Koa()

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

// response
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(`UnHandler Exception - ${err.message}`)
  }
})

initializer.initModules(app)
initializer.installRouters(app)

const PORT = process.env.NODE_PORT || 3000
app.listen(PORT)

console.log(`🎡 SERVER START: http://0.0.0.0:${PORT}`)
