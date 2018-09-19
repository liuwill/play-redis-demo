import Router from 'koa-router'

var router = new Router()

const apiMap = {
  voter: {
    route: 'voter',
    module: 'voter',
  },
  elector: {
    route: 'elector',
    module: 'elector',
  }
}

const setupTime = new Date()
router.get('/health', async (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    time: setupTime.toISOString(),
    version: 'current',
  }
})

router.put('/json', async (ctx, next) => {
  console.log(ctx.request.body)
  ctx.body = {
    status: true,
    code: 200,
    message: ctx.request.body,
  }
})

router.get('/election.html', async (ctx, next) => {
  await ctx.render('election')
})

router.get('/', async (ctx, next) => {
  await ctx.render('election')
})

for (let route in apiMap) {
  const apiRouter = require(`./api/${apiMap[route].module}`)
  const routePath = apiMap[route].route
  router.use(`/api/${routePath}`, apiRouter.routes(), apiRouter.allowedMethods())
}

export default router
