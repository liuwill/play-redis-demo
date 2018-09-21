import settingUtils from './setting'
import redisModule from './module/redis'
import rootRouter from './router'

export default {
  initModules: (app) => {
    const setting = settingUtils.loadSetting()

    const redisConfig = settingUtils.buildRedisConfig(setting.redis, process.env)
    app.context.redis = redisModule.getConnection(redisConfig)
  },
  installRouters: (app) => {
    app
      .use(rootRouter.routes())
      .use(rootRouter.allowedMethods())
  }
}
