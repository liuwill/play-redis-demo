import mockServer from './mock'

const request = mockServer.request

describe('Election And Vote', function () {
  it('create voter', function (done) {
    request
      .post('/api/voter/create')
      .send(mockServer.voters['18800000001'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('get voter', function (done) {
    request
      .get('/api/voter/info/18800000001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('collect voter', function (done) {
    request
      .post('/api/voter/collect')
      .send(mockServer.voters['18800000001'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });
});
