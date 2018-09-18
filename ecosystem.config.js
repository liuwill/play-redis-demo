module.exports = {
  apps: [{
    name: 'play-redis-demo',
    script: './index.js',
    instances: 2,
    exec_mode: 'cluster'
  }]
}
