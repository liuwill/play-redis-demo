import chai from 'chai'
import path from 'path'
import electionUtils from '../../app/utils/election'

const { expect, assert } = chai

describe('utils test', function () {
  describe('election utils', function () {
    it('return origin when pick param not object', function () {
      const source = '2'
      const target = electionUtils.pickField(source)

      expect(target).to.equal(source)
    })
  })
})
