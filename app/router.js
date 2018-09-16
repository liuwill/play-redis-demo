import Router from 'koa-router'

var router = new Router()

const apiMap = {
  vote: {
    route: 'vote',
    module: 'vote',
  },
  manager: {
    route: 'manager',
    module: 'manager',
  }
}

const setupTime = new Date()
router.get('/health', (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    time: setupTime.toISOString(),
    version: 'current',
  }
})

router.put('/json', (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = {
    status: true,
    code: 200,
    message: ctx.request.body,
  }
})

for (let route in apiMap) {
  const apiRouter = require(`./api/${apiMap[route].module}`)
  const routePath = apiMap[route].route
  router.use(`/api/${routePath}`, apiRouter.routes(), apiRouter.allowedMethods())
}

export default router
