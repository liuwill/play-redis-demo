import mockServer from './mock'

const request = mockServer.createRequest()

describe('router', function () {
  it('PUT /json respond with json', function (done) {
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

  it('GET /health check health', function (done) {
    request
      .get('/health')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('GET /election.html', function (done) {
    request
      .get('/election.html')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('GET /', function (done) {
    request
      .get('/')
      .expect('Content-Type', /html/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });
});
