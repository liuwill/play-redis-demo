import Router from 'koa-router'

var router = new Router()

const setupTime = new Date()
router.get('/health', (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    time: setupTime.toISOString(),
    version: 'current',
  }
})

module.exports = router
