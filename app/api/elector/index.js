import Router from 'koa-router'
import validator from 'validator'

import storeConstant from '../../constant/store'
import electionUtils from '../../utils/election'

const chance = require('chance').Chance()

const router = new Router()

router.get('/meta', async (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    message: '创建并管理游戏',
  }
})

router.get('/list', async (ctx) => {
  const redisHandler = ctx.redis

  const hashKey = storeConstant.ELECTOR_USER_HASH_KEY
  let rawElectorMap = await redisHandler.hgetall(hashKey)
  let electorList = Object.values(rawElectorMap)

  ctx.body = {
    status: true,
    code: 0,
    data: electorList,
  }
})

router.get('/info/:mobile', async (ctx) => {
  const redisHandler = ctx.redis

  let { mobile } = ctx.params
  const hashKey = storeConstant.ELECTOR_USER_HASH_KEY

  let existElector = await redisHandler.hget(hashKey, mobile)
  if (!existElector || !validator.isJSON(existElector)) {
    ctx.throw(404, '用户不存在')
  }

  let electorData = JSON.parse(existElector)
  ctx.body = {
    status: true,
    code: 0,
    data: electionUtils.buildElectorData(electorData),
  }
})

router.post('/create', async (ctx) => {
  const fields = ['mobile', 'password']
  const hashKey = storeConstant.ELECTOR_USER_HASH_KEY
  let { mobile, password } = ctx.request.body

  let address = chance.address()
  let name = chance.name()
  let mascot = chance.animal()
  let description = chance.paragraph()
  let avatar = chance.avatar({ protocol: 'http' })
  let profession = chance.profession()
  let company = chance.company()
  let email = chance.email({ domain: "google.com" })
  let created = new Date()
  let id = chance.guid()

  if (!password || password.length > 16 || password.length < 3) {
    ctx.throw(400, 'password error')
  } else if (isNaN(mobile) || mobile.length != 11) {
    ctx.throw(400, 'mobile error')
  }

  const redisHandler = ctx.redis
  let existElector = await redisHandler.hget(hashKey, mobile)
  if (existElector) {
    ctx.throw(400, '竞选人已经存在')
  }

  let createdElector = {
    id,
    mobile,
    password,
    email,
    address,
    name,
    mascot,
    description,
    avatar,
    company,
    profession,
    created,
  }

  await redisHandler.hset(hashKey, mobile, JSON.stringify(createdElector))
  ctx.body = {
    status: true,
    code: 0,
    data: createdElector,
  }
})

module.exports = router
