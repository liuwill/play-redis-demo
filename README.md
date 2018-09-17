# Play Redis Demo

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

# 启动服务
yarn start

```

## 接口测试

```shell

# 测试接口，验证服务
curl -X PUT -H "Content-type: application/json" --data '{"name":"liuwill"}' http://localhost:3000/json
```

[查看操作手册文档](./MANUAL.md)
