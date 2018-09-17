import storeConstant from '../constant/store'
import electionUtils from '../utils/election'

export default {
  authVoter: async function (ctx, next) {
    const redisHandler = ctx.redis

    const fields = ['mobile', 'password']
    let authData = {}
    fields.forEach(key => {
      if (ctx.request.body[key]) {
        authData[key] = ctx.request.body[key]
      } else if (ctx.request.query[key]) {
        authData[key] = ctx.request.query[key]
      }
    })

    if (!authData['mobile'] || !authData['password']) {
      ctx.throw(401, '未经授权的访问')
    }

    const hashKey = storeConstant.VOTE_USER_HASH_KEY

    let existVoter = await redisHandler.hget(hashKey, authData['mobile'])
    if (!existVoter) {
      ctx.throw(404, '用户不存在')
    }

    let voterData = JSON.parse(existVoter)
    if (voterData.mobile !== authData['mobile'] || voterData.password !== authData['password']) {
      ctx.throw(403, '没有权限操作')
    }

    ctx.state.user = voterData
    await next()
  }
}
