import chai from 'chai'
import path from 'path'
import settingUtils from '../../app/setting'
import redisModule from '../../app/module/redis'

const { expect, assert } = chai

const generateRandom = () => {
  return Math.random().toString(36).substr(2)
}

describe('load json config', function () {
  it('should fetch default config path', function () {
    const filePath = settingUtils.fetchConfigPath()

    expect(filePath).to.have.string('setting.json')
  })

  it('should load empty if file not exists', function () {
    const filename = generateRandom()
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object')
    expect(Object.keys(fileContent)).to.be.empty
  })

  it('should load empty if not json file', function () {
    const filename = path.join(__dirname, './setting.js')
    const fileContent = settingUtils.loadJsonConfig(filename)

    expect(fileContent).to.be.an('object');
    expect(Object.keys(fileContent)).to.be.empty
  })

  it('should load setting', function () {
    const settingConfig = settingUtils.loadSetting()

    expect(settingConfig).to.be.an('object')
  })

  it('should load redis setting from env', function () {
    const envConfig = {
      'REDIS_SERVER': 'test-server',
      'REDIS_PORT': '6379',
      'REDIS_SECRET': '123456',
    }
    const redisConfig = settingUtils.buildRedisConfig({}, envConfig)
    expect(redisConfig).to.deep.include({
      host: envConfig.REDIS_SERVER,
      port: envConfig.REDIS_PORT,
      password: envConfig.REDIS_SECRET,
    })
  })
})

describe('cover redis error', function () {
  it('should load empty if not json file', function () {
    const result = redisModule.handleError(new Error())

    expect(result).to.be.an('undefined')
  })
})
