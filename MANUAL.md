# 接口操作手册

## 1 创建投票人

```shell
curl -X POST \
  http://localhost:3000/api/voter/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=18800000001&password=111111'

curl -X POST \
  http://localhost:3000/api/voter/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=18800000002&password=111111'

curl -X POST \
  http://localhost:3000/api/voter/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=18800000003&password=111111'
```

## 2 查看投票人信息
```shell
curl -X GET http://localhost:3000/api/voter/info/18800000001
```

## 3 创建竞选人
```shell
curl -X POST \
  http://localhost:3000/api/elector/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=16600000001&password=111111'

curl -X POST \
  http://localhost:3000/api/elector/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=16600000002&password=111111'
```

## 4 查看所有竞选人

```shell
curl -X GET http://localhost:3000/api/elector/list
```
