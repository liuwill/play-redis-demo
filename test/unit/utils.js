import chai from 'chai'
import electionUtils from '../../app/utils/election'

const { expect, assert } = chai

describe('utils test', function () {
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
