import appServer from '../../app/server'
import supertest from 'supertest'

import redisModule from '../../app/module/redis'

const app = appServer.createApp()
const server = app.listen()
const request = supertest(server)

const redisHandler = redisModule.getConnection()
redisHandler.flushdb().then((result) => {
  console.log('clear redis data', result)
})

const voters = {
  '18800000001': { mobile: '18800000001', password: '1111111' },
}

const electors = {
  '16600000001': { mobile: '16600000001', password: '1111111' },
}

export default {
  createRequest: () => {
    return request
  },
  server,
  voters,
  electors,
}
