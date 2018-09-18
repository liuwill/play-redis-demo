import chai from 'chai'
import path from 'path'
import settingUtils from '../../app/setting'

const { expect, assert } = chai

describe('load json config', function () {
  it('should load empty if file not exists', function () {
    const filename = Math.random().toString(36).substr(2)
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object');
    expect(Object.keys(fileContent)).to.be.empty
  })

  it('should load empty if not json file', function () {
    const filename = path.join(__dirname, './setting.js')
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object');
    expect(Object.keys(fileContent)).to.be.empty
  })
})
