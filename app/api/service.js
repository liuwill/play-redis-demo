import storeConstant from '../constant/store'
import electionUtils from '../utils/election'
import redisModule from '../module/redis'

export default {
  findElectorById: async function (electorId) {
    const redisHandler = redisModule.getConnection()
    const hashKey = storeConstant.ELECTOR_USER_HASH_KEY

    let existElector = await redisHandler.hget(hashKey, electorId)
    if (!existElector) {
      return null
    }

    return JSON.parse(existElector)
  },
  listAll: async function (hashKey, handler) {
    const redisHandler = redisModule.getConnection()

    let rawMap = await redisHandler.hgetall(hashKey)
    return Object.values(rawMap).map(item => {
      let data = JSON.parse(item)
      return handler(data)
    })
  }
}
