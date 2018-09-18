import mockServer from './mock'

const request = mockServer.request

describe('PUT /json', function () {
  it('respond with json', function (done) {
    request
      .put('/json')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });
});
