import Router from 'koa-router'

var router = new Router()

router.get('/meta', (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    message: '创建并管理游戏',
  }
})

module.exports = router
