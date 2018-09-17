let Redis = require('ioredis')
let redis = null

export default {
  getConnection: (redisConfig, reload = false) => {
    if (!redis || reload) {
      redis = new Redis(redisConfig)

      redis.on('connect', () => {
        console.log(`connect to redis(${redisConfig.host}) success`)
      })

      redis.on('error', err => {
        console.error(`connect to redis(${redisConfig.host}) failure, reason: ${err.toString()}`)
        redis = null
      })
    }
    return redis
  }
}
