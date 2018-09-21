import Router from 'koa-router'
import validator from 'validator'

import storeConstant from '../../constant/store'
import electionUtils from '../../utils/election'

import apiMiddleware from '../middleware'
import apiService from '../service'

const chance = require('chance').Chance()

const router = new Router()

router.get('/list', async (ctx) => {
  const redisHandler = ctx.redis

  let hashKey = storeConstant.VOTE_USER_HASH_KEY
  let voterList = await apiService.listAll(hashKey, electionUtils.buildVoteData)

  let mobilePos = []
  let voterActions = voterList.map((item) => {
    mobilePos.push(item.mobile)
    let cachedKey = electionUtils.generateVoterPointsKey(item.mobile)
    return ['get', cachedKey]
  })

  let actionResults = await redisHandler.pipeline(voterActions).exec()
  let pointMap = actionResults.reduce((result, item, index) => {
    let mobile = mobilePos[index]
    result[`${mobile}`] = electionUtils.formatNumber(item[1])
    return result
  }, {})

  voterList.forEach(item => {
    let mobile = item.mobile
    item.point = pointMap[`${mobile}`]
  })

  ctx.body = {
    status: true,
    code: 0,
    data: {
      list: voterList,
      total: voterList.length,
    },
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
  voterData.point = electionUtils.formatNumber(point)

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

  try {
    electionUtils.checkCreateParams(mobile, password)
  } catch(err) {
    ctx.throw(400, err.message)
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

  const point = chance.integer({ min: 1, max: 100 })
  const cachedKey = electionUtils.generateVoterPointsKey(voterData.mobile)

  const parallelResult = await Promise.all([
    redisHandler.incrby(cachedKey, point),
    redisHandler.get(cachedKey),
  ])
  ctx.body = {
    status: true,
    code: 0,
    data: Object.assign(voterData, {
      collect_point: point,
      point: parallelResult[1],
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
  try {
    electionUtils.checkVoteLock(pipelineResult, point)
  } catch (err) {
    ctx.throw(400, err.message)
  }
  /*
  if (pipelineResult[0][1]) {
    ctx.throw(500, '没有获得锁')
  }

  if (!pipelineResult[1][1] || Number(pipelineResult[1][1]) < Number(point)) {
    ctx.throw(400, '没有足够的票数')
  }
  */

  const totalVoteKey = storeConstant.TOTAL_ELECTION_HASH_KEY
  const electorVoteKey = electionUtils.generateElectorVoteKey(elector_id)

  const doActions = [
    ['zincrby', totalVoteKey, point, elector_id],
    ['zincrby', electorVoteKey, point, voterData.mobile],
    ['decrby', pointKey, point],
    ['del', lockKey],
  ]

  const actionResult = await redisHandler.pipeline(doActions).exec()
  console.log('vote:', actionResult)
  ctx.body = {
    status: true,
    code: 0,
    data: {
      point,
    },
  }
})

router.get('/position/elector/:mobile', apiMiddleware.authVoter, async (ctx) => {
  const redisHandler = ctx.redis
  let { mobile } = ctx.params
  let voterData = ctx.state.user

  const electorVoteKey = electionUtils.generateElectorVoteKey(mobile)

  let myRank = await redisHandler.zrevrank(electorVoteKey, voterData.mobile)

  ctx.body = {
    status: true,
    code: 0,
    data: electionUtils.parseRank(myRank),
  }
})

module.exports = router
