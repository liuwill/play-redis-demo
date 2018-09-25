# Play Redis Demo
[![Build Status](https://travis-ci.org/liuwill/play-redis-demo.svg?branch=master)](https://travis-ci.org/liuwill/play-redis-demo)
[![codecov](https://codecov.io/gh/liuwill/play-redis-demo/branch/master/graph/badge.svg)](https://codecov.io/gh/liuwill/play-redis-demo)
[![Maintainability](https://api.codeclimate.com/v1/badges/b95b1ad9293439682b75/maintainability)](https://codeclimate.com/github/liuwill/play-redis-demo/maintainability)


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

执行单元测试的时候需要注意，单元测试会先进行删除数据操作，清空`redis`中`db=1`数据库的所有数据。确保测试之前该库中没有重要数据。这个配置是通过设置`NODE_ENV=unit`，然后加载[config/setting.unit.json](config/setting.unit.json)文件中的配置实现的。正常的服务使用`db=0`的库。


## 查看服务

```shell
# 查看页面
http://localhost:3000

# 测试接口，验证服务
curl -X PUT -H "Content-type: application/json" --data '{"name":"liuwill"}' http://localhost:3000/json
```

[查看接口操作手册文档](./MANUAL.md)
