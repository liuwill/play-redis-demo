import appServer from '../../app/server'
import supertest from 'supertest'

import redisModule from '../../app/module/redis'

const app = appServer.createApp()
const server = app.listen()
const request = supertest(server)

before(function(done) {
  const redisHandler = redisModule.getConnection()
  redisHandler.flushall().then(() => {
    done()
  })
})

const voters = {
  '18800000001': { mobile: '18800000001', password: '1111111' },
}

export default {
  request,
  server,
  voters,
}
