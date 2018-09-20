# Play Redis Demo
[![Build Status](https://travis-ci.org/liuwill/play-redis-demo.svg?branch=master)](https://travis-ci.org/liuwill/play-redis-demo)
[![codecov](https://codecov.io/gh/liuwill/play-redis-demo/branch/master/graph/badge.svg)](https://codecov.io/gh/liuwill/play-redis-demo)


## requirements

- node >= 10.60
- yarn
- redis

## start

```shell
nvm use

# 安装依赖
yarn install

# 启动redis，也可以自己安装
docker-compose up -d

# 修改配置文件 config/setting.json
{
  "redis": {
    "host": "some-redis",
    "port": "6379"
  }
}

# 测试
yarn run check

# 启动服务
yarn start

```

## 查看服务

```shell
# 查看页面
http://localhost:3000

# 测试接口，验证服务
curl -X PUT -H "Content-type: application/json" --data '{"name":"liuwill"}' http://localhost:3000/json
```

[查看接口操作手册文档](./MANUAL.md)
