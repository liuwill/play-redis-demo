import Router from 'koa-router'
import validator from 'validator'

import storeConstant from '../../constant/store'
import electionUtils from '../../utils/election'

const chance = require('chance').Chance()

const router = new Router()

router.get('/list', async (ctx) => {
  const redisHandler = ctx.redis

  const hashKey = storeConstant.ELECTOR_USER_HASH_KEY
  let rawElectorMap = await redisHandler.hgetall(hashKey)
  let electorList = Object.values(rawElectorMap).map(item => {
    let data = JSON.parse(item)
    return electionUtils.buildElectorData(data)
  })

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

router.get('/ranking', async (ctx) => {
  const redisHandler = ctx.redis

  const hashKey = storeConstant.ELECTOR_USER_HASH_KEY
  const totalVoteKey = storeConstant.TOTAL_ELECTION_HASH_KEY

  const pipelineAction = [
    ['hgetall', hashKey],
    ['zrevrange', totalVoteKey, 0, -1, 'WITHSCORES'],
  ]
  const pipelineResult = await redisHandler.pipeline(pipelineAction).exec()
  let electorMap = pipelineResult[0][1]
  let rawRankData = pipelineResult[1][1]
  let rankList = []
  for (let i = 0; i < rawRankData.length; i += 2) {
    const mobile = rawRankData[i]
    const data = JSON.parse(electorMap[mobile])
    rankList.push(Object.assign({
      mobile,
      point: rawRankData[i + 1],
    }, electionUtils.buildElectorData(data)))
  }

  ctx.body = {
    status: true,
    code: 0,
    data: rankList,
  }
})

router.get('/position/:mobile', async (ctx) => {
  const redisHandler = ctx.redis
  let { mobile } = ctx.params

  const totalVoteKey = storeConstant.TOTAL_ELECTION_HASH_KEY

  let myRank = await redisHandler.zrevrank(totalVoteKey, mobile)

  ctx.body = {
    status: true,
    code: 0,
    data: electionUtils.parseRank(myRank),
  }
})

router.get('/voter/ranking', async (ctx) => {
  const redisHandler = ctx.redis
  let { elector_id } = ctx.request.query

  const electorVoteKey = electionUtils.generateElectorVoteKey(elector_id)

  let rawRankData = await redisHandler.zrevrange(electorVoteKey, 0, -1, 'WITHSCORES')
  let rankList = []
  for (let i = 0; i < rawRankData.length; i += 2) {
    const mobile = rawRankData[i]
    rankList.push({
      mobile,
      point: rawRankData[i + 1],
    })
  }

  ctx.body = {
    status: true,
    code: 0,
    data: rankList,
  }
})

module.exports = router
