import Router from 'koa-router'
import chance from 'chance'

import storeConstant from '../../constant/store'
import electionUtils from '../../utils/election'

var router = new Router()

router.get('/meta', async (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    message: '参与投票',
  }
})

// 获取单个投票人
router.get('/single/:mobile', async (ctx) => {
  const redisHandler = ctx.redis

  let { mobile } = ctx.request.query
  const hashKey = storeConstant.VOTE_USER_HASH_KEY

  let existVoter = await redisHandler.hget(hashKey, mobile)
  if (!existVoter) {
    ctx.throw(404, '用户不存在')
  }

  let voterData = JSON.parse(existVoter)

  ctx.body = {
    status: true,
    code: 0,
    data: voterData,
  }
})

// 创建新的投票人
router.post('create', async (ctx) => {
  const fields = ['mobile', 'password']
  const hashKey = storeConstant.VOTE_USER_HASH_KEY
  let { mobile, password } = ctx.request.body

  let address = chance.address()
  let name = chance.name()
  let email = chance.email({ domain: "liuwill.com" })

  if (!password || password.length > 16 || password.length < 3) {
    ctx.throw(400, 'password error')
  } else if (isNaN(mobile) || mobile.length != 11) {
    ctx.throw(400, 'mobile error')
  }

  const redisHandler = ctx.redis
  let existVoter = await redisHandler.hget(hashKey, mobile)
  if (existVoter) {
    ctx.throw(400, '用户已经存在')
  }

  let createdVoter = {
    mobile,
    password,
    email,
    address,
    name,
  }

  await redisHandler.hset(hashKey, mobile, JSON.parse(createdVoter))
  ctx.body = {
    status: true,
    code: 0,
    data: createdVoter,
  }
})

// 为投票人分配额度
router.post('/collect', async (ctx) => {
  const redisHandler = ctx.redis

  let { mobile, password } = ctx.request.query
  const hashKey = storeConstant.VOTE_USER_HASH_KEY

  let existVoter = await redisHandler.hget(hashKey, mobile)
  if (!existVoter) {
    ctx.throw(404, '用户不存在')
  }

  let voterData = JSON.parse(existVoter)
  if (voterData.mobile !== mobile || voterData.password !== password) {
    ctx.throw(404, '用户不存在')
  }

  const pointer = chance.integer({ min: 1, max: 100 })
  const cachedKey = electionUtils.generateVoterPointsKey(mobile)

  redisHandler.incrby(cachedKey, pointer)
  ctx.body = {
    status: true,
    code: 0,
    data: Object.assign(voterData, {
      pointer,
    }),
  }
})

module.exports = router
