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

let settingConfig = null
export default {
  loadJsonConfig,
  loadSetting: () => {
    if (!settingConfig) {
      settingConfig = loadJsonConfig(path.join(__dirname, '../config/setting.json'))
    }
    return settingConfig
  }
}
