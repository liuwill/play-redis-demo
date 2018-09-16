import Router from 'koa-router'

var router = new Router()

router.get('/meta', (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    message: '参与投票',
  }
})

module.exports = router
