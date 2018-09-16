import settingUtils from './setting'
import redisModule from './module/redis'
import rootRouter from './router'

export default {
  initModules: (app) => {
    const setting = settingUtils.loadSetting()

    app.context.redis = redisModule.getConnection(setting.redis)
  },
  installRouters: (app) => {
    app
      .use(rootRouter.routes())
      .use(rootRouter.allowedMethods())
  }
}
