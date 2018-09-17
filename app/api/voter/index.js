import Router from 'koa-router'
import validator from 'validator'

import storeConstant from '../../constant/store'
import electionUtils from '../../utils/election'

import apiMiddleware from '../middleware'
import apiService from '../service'

const chance = require('chance').Chance()

const router = new Router()

router.get('/meta', async (ctx, next) => {
  ctx.body = {
    status: true,
    code: 200,
    message: '参与投票',
  }
})

// 获取单个投票人
router.get('/info/:mobile', async (ctx) => {
  const redisHandler = ctx.redis

  let { mobile } = ctx.params
  const hashKey = storeConstant.VOTE_USER_HASH_KEY

  let existVoter = await redisHandler.hget(hashKey, mobile)
  if (!existVoter || !validator.isJSON(existVoter)) {
    ctx.throw(404, '用户不存在')
  }

  let voterData = JSON.parse(existVoter)
  let cachedKey = electionUtils.generateVoterPointsKey(mobile)

  let point = await redisHandler.get(cachedKey)
  voterData.point = point || 0

  ctx.body = {
    status: true,
    code: 0,
    data: electionUtils.buildVoteData(voterData),
  }
})

// 创建新的投票人
router.post('/create', async (ctx) => {
  const fields = ['mobile', 'password']
  const hashKey = storeConstant.VOTE_USER_HASH_KEY
  let { mobile, password } = ctx.request.body

  let address = chance.address()
  let name = chance.name()
  let email = chance.email({ domain: "liuwill.com" })
  let created = new Date()
  let id = chance.guid()

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
    id,
    mobile,
    password,
    email,
    address,
    name,
    created,
  }

  await redisHandler.hset(hashKey, mobile, JSON.stringify(createdVoter))
  ctx.body = {
    status: true,
    code: 0,
    data: createdVoter,
  }
})

// 为投票人分配额度
router.post('/collect', apiMiddleware.authVoter, async (ctx) => {
  const redisHandler = ctx.redis
  let voterData = ctx.state.user

  const pointer = chance.integer({ min: 1, max: 100 })
  const cachedKey = electionUtils.generateVoterPointsKey(voterData.mobile)

  await redisHandler.incrby(cachedKey, pointer)
  ctx.body = {
    status: true,
    code: 0,
    data: Object.assign(voterData, {
      pointer,
    }),
  }
})

// 投票人为竞选人投票
router.post('/do_vote', apiMiddleware.authVoter, async (ctx) => {
  const redisHandler = ctx.redis
  let voterData = ctx.state.user

  let { elector_id, point } = ctx.request.body
  let elector = await apiService.findElectorById(elector_id)
  if (!elector) {
    ctx.throw(404, '竞选人不存在')
  } else if (!point || isNaN(point)) {
    ctx.throw(400, '票数不正确')
  }
  const lockKey = electionUtils.generateVoterLockKey(voterData.mobile)
  const pointKey = electionUtils.generateVoterPointsKey(voterData.mobile)

  const pipelineActions = [
    ['get', lockKey],
    ['get', pointKey],
    ['setex', lockKey, 3, 1],
  ]
  const pipelineResult = await redisHandler.pipeline(pipelineActions).exec()
  if (pipelineResult[0][1]) {
    ctx.throw(500, '没有获得锁')
  }

  if (!pipelineResult[1][1]) {
    ctx.throw(400, '没有足够的票数')
  } else if (Number(pipelineResult[1][1]) < Number(point)) {
    ctx.throw(400, '没有足够的票数')
  }

  const totalVoteKey = storeConstant.TOTAL_ELECTION_HASH_KEY
  const electorVoteKey = electionUtils.generateElectorVoteKey(elector_id)

  const doActions = [
    ['zincrby', totalVoteKey, point, elector_id],
    ['zincrby', electorVoteKey, point, voterData.mobile],
    ['decrby', pointKey, point],
    ['del', lockKey],
  ]

  const actionResult = await redisHandler.pipeline(pipelineActions).exec()
  ctx.body = {
    status: true,
    code: 0,
    data: {
      point,
    },
  }
})

module.exports = router
