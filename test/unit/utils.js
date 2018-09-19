import chai from 'chai'
import electionUtils from '../../app/utils/election'
import serverUtils from '../../app/utils/server'

const { expect, assert } = chai

describe('utils test', function () {
  describe('server utils', function () {
    it('parse error status code from Error', function () {
      const randomStatus = Math.round(Math.random() * 1000)
      const nullStatus = serverUtils.parseErrorCode()
      const emptyStatus = serverUtils.parseErrorCode({})
      const simpleStatus = serverUtils.parseErrorCode({ status: randomStatus })

      expect(nullStatus).to.equal(500)
      expect(emptyStatus).to.equal(500)
      expect(simpleStatus).to.equal(randomStatus)
    })
  })

  describe('election utils', function () {
    it('return origin when pick param not object', function () {
      const source = '2'
      const target = electionUtils.pickField(source)

      expect(target).to.equal(source)
    })

    it('throw lock error', function () {
      expect(() => {
        electionUtils.checkVoteLock()
      }).to.throw()
    })

    it('parse rank from cached', function () {
      const notInRank = electionUtils.parseRank(null)
      expect(notInRank).to.equal(0)
    })
  })
})
