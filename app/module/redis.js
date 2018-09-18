let Redis = require('ioredis')
let redis = null
let currentConfig = null

const handleConnect = () => {
  console.log(`connect to redis(${currentConfig.host}) success`)
}

const handleError = (err) => {
  console.error(`connect to redis(${currentConfig.host}) failure, reason: ${err.toString()}`)
}

export default {
  getConnection: (redisConfig, reload = false) => {
    if (!redis || reload) {
      currentConfig = redisConfig
      redis = new Redis(redisConfig)

      redis.on('connect', handleConnect)

      redis.on('error', handleError)
    }
    return redis
  },
  handleConnect,
  handleError,
}
