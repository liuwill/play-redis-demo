import mockServer from './mock'
import querystring from 'querystring'

const request = mockServer.createRequest()

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

  it('list voter', function (done) {
    request
      .get('/api/voter/list')
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

  it('create elector', function (done) {
    request
      .post('/api/elector/create')
      .send(mockServer.electors['16600000001'])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('list electors', function (done) {
    request
      .get('/api/elector/list')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('show elector info', function (done) {
    request
      .get('/api/elector/info/16600000001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('do vote action', function (done) {
    request
      .post('/api/voter/do_vote')
      .send(Object.assign({
        elector_id: '16600000001',
        point: 1
      }, mockServer.voters['18800000001']))
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('get voter position', function (done) {
    const query = querystring.stringify(mockServer.voters['18800000001'])
    request
      .get('/api/voter/position/elector/16600000001' + `?${query}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('ranking electors', function (done) {
    request
      .get('/api/elector/ranking')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('get electors ranking position', function (done) {
    request
      .get('/api/elector/position/16600000001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  it('show electors voter ranking', function (done) {
    request
      .get('/api/elector/voter/ranking?elector_id=16600000001')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err)
        done()
      });
  });

  describe('test elector throws', function () {
    it('create elector missing password', function (done) {
      request
        .post('/api/elector/create')
        .send({ mobile: 11111111111})
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('create elector missing mobile', function (done) {
      request
        .post('/api/elector/create')
        .send({ password: 11111111111, mobile: 188})
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('elector not exist', function (done) {
      request
        .get('/api/elector/info/17700000001')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('double create elector', function (done) {
      request
        .post('/api/elector/create')
        .send(mockServer.electors['16600000001'])
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });
  })

  describe('test voter throws', function () {
    it('double create voter', function (done) {
      request
        .post('/api/voter/create')
        .send(mockServer.voters['18800000001'])
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('create voter missing password', function (done) {
      request
        .post('/api/voter/create')
        .send({ mobile: 11111111111})
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('create voter missing mobile', function (done) {
      request
        .post('/api/voter/create')
        .send({ password: 11111111111, mobile: 188})
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('voter not exist', function (done) {
      request
        .get('/api/voter/info/17700000001')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('do not exist elector vote fail', function (done) {
      request
        .post('/api/voter/do_vote')
        .send(Object.assign({
          elector_id: '17700000001',
          point: 1000
        }, mockServer.voters['18800000001']))
        .set('Accept', 'application/json')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('not enough vote fail', function (done) {
      request
        .post('/api/voter/do_vote')
        .send(Object.assign({
          elector_id: '16600000001',
          point: 1000
        }, mockServer.voters['18800000001']))
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('missing point vote fail', function (done) {
      request
        .post('/api/voter/do_vote')
        .send(Object.assign({
          elector_id: '16600000001',
        }, mockServer.voters['18800000001']))
        .set('Accept', 'application/json')
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });
  })

  describe('test voter auth', function () {
    it('without mobile', function (done) {
      request
        .post('/api/voter/do_vote')
        .set('Accept', 'application/json')
        .expect(401)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('user not exist', function (done) {
      request
        .post('/api/voter/do_vote')
        .send({ mobile: '17700000001', password: '111111' })
        .set('Accept', 'application/json')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });

    it('password error', function (done) {
      request
        .post('/api/voter/do_vote')
        .send({ mobile: '18800000001', password: '222222' })
        .set('Accept', 'application/json')
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err)
          done()
        });
    });
  })
});
