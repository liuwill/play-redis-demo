import fs from 'fs'
import path from 'path'

const loadJsonConfig = (configPath) => {
  if (!fs.existsSync(configPath)) {
    return {}
  }
  let content = fs.readFileSync(configPath, 'utf8')
  try {
    return JSON.parse(content)
  } catch (err) {
    return {}
  }
}

const fetchConfigPath = (nodeEnv) => {
  let settingPath = '../config/setting.json'
  if (nodeEnv === 'unit') {
    settingPath = '../config/setting.unit.json'
  }
  return settingPath
}

const buildRedisConfig = (redisConfig, envConfig) => {
  if (envConfig.REDIS_SERVER) {
    redisConfig = {
      host: envConfig.REDIS_SERVER,
      port: envConfig.REDIS_PORT,
      password: envConfig.REDIS_SECRET,
    }
  }
  return redisConfig
}

let settingConfig = null

export default {
  fetchConfigPath,
  loadJsonConfig,
  buildRedisConfig,
  loadSetting: () => {
    let settingPath = fetchConfigPath(process.env.NODE_ENV)

    if (!settingConfig) {
      settingConfig = loadJsonConfig(path.join(__dirname, settingPath))
    }

    return settingConfig
  }
}
