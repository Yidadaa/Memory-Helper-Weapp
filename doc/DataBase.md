# 数据库设计
主要数据类：用户User、卡组CardGroup、卡片Card、记录Record

## User
```js
{
  id: String,
  avatarUrl: String,
  nickName: String,
  createdAt: Date
}
```

## CardGroup
```js
{
  id: String,
  title: String,
  description: String,
  createdAt: Date,
  createdBy: String,
  icon: String, // 图标名称
  color: String, // 颜色主题
}
```

## Card
```js
{
  id: String,
  groupID: String,
  front: String,
  back: String,
  status: Number, // 0. 未掌握 1. 已掌握
  createdAt: Date,
  createdBy: String
}
```

## Record
```js
{
  id: String,
  type: String, // user: 用户变更记录, card: 卡片变更记录, cardgroup: 卡组变更记录
  action: String, // add: 增加, del: 删除, update: 更改
  userID: String,
  cardID: String,
  groupID: String,
  from: Object<User | Card | CardGroup>, // 从from变更到to
  to: Object<User | Card | CardGroup>
}
```

## StudyRecord
```js
{
  id: String,
  userID: String,
  cardID: String,
  date: Date,
  times: Number,
  status: Number
}
```

## StudyPlan
```js
{
  id: String,
  userID: String,
  cardID: String,
  stage: int, // 学习进行到了哪个阶段，按照艾宾浩斯曲线设置
  nextDate: Date, // 下次学习日期
  finishOneTime: Boolean, // 0. 否 1. 是
  finished: Boolean // 0 / 1
}
```

## 更新逻辑
每次用户进入小程序，进入以下流程：
1. 拉取`StudyPlan`中所有`nextDate <= today and finishOneTime === 0 and finished === 0`的卡片;
2. 学习今日卡片，每次掌握了一张卡片，就执行更新逻辑：`stage += 1; finishOneTime = 1, nextDate = today + diffDate`, 并增加对应的`StudyRecord`； 如果学习完成，则将`stage = -1; finished = 1`，对应的卡片状态`Card.status = 1`；
3. 如果某张卡片忘记了，则在本地标记该卡片待完成学习，直到完成学习时`stage -= 1`。

数据库每日凌晨4点执行计划任务：
1. 拉取所有`finishOneTime === 0 and finished === 0`的`StudyPlan`，以`nextDate = today`为基准更新学习计划；
2. 拉取所有`finishOneTime === 1 and finished === 0`的`StudyPlan`，更新为`finishOneTime === 0`。

卡组克隆逻辑：


卡组共享逻辑：


