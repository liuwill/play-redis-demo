import settingUtils from './setting'
import redisModule from './module/redis'
const setting = settingUtils.loadSetting()

redisModule.getConnection(setting.redis)
