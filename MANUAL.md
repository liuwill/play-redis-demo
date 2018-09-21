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

curl -X POST \
  http://localhost:3000/api/elector/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=16600000003&password=111111'

curl -X POST \
  http://localhost:3000/api/elector/create \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=16600000004&password=111111'
```

## 4 查看所有竞选人

```shell
curl -X GET http://localhost:3000/api/elector/list
```

## 5 投票人收集投票额度

```shell
curl -X POST \
  http://localhost:3000/api/voter/collect \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=18800000001&password=111111'
```

## 6 投票人进行投票动作

```shell
curl -X POST \
  http://localhost:3000/api/voter/do_vote \
  -H 'Content-Type: application/x-www-form-urlencoded' \
  -d 'mobile=18800000001&password=111111&elector_id=16600000001&point=12'
```

## 7 查看总的投票排名

```shell
curl -X GET http://localhost:3000/api/elector/ranking
```

## 8 查看单个竞选人的名次

```shell
curl -X GET http://localhost:3000/api/elector/position/16600000002
```

## 9 查看投某个竞选人的投票人排行榜

```shell
curl -X GET http://localhost:3000/api/elector/voter/ranking?elector_id=16600000002
```

## 10 单个投票人为某个竞选人的投票排名

```shell
curl -X GET http://localhost:3000/api/voter/position/elector/16600000002?mobile=18800000001&password=111111
```
