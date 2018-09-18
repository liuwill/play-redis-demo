import appServer from '../../app/server'
import supertest from 'supertest'

const app = appServer.createApp()
const server = app.listen()
const request = supertest(server)

describe('PUT /json', function () {
  it('respond with json', function (done) {
    request
      .put('/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        console.log('===========')
        done()
      });
  });

  after(function (done) {
    console.log('finish')
    server.close()
    done()
  })
});
