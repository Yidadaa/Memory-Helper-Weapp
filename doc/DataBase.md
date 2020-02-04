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
  stages: Array, // 学习计划的阶段
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
  createdBy: String,
  times: Number, // 学习次数
  plan: {
    planID: String,
    stage: int, // 学习进行到了哪个阶段，按照艾宾浩斯曲线设置，学习完成时设置为 -1
    nextDate: Date, // 下次学习日期
    finishOneTime: Boolean, // 0. 否 1. 是
    finished: Boolean // 0 / 1
  }
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
  userID: String
}
```

## 更新逻辑
每次用户进入小程序，进入以下流程：
1. 拉取所有`plan.nextDate <= today and plan.finishOneTime === 0 and plan.finished === 0`的卡片;
2. 学习今日卡片，每次掌握了一张卡片，就执行更新逻辑：`plan.stage += 1; plan.finishOneTime = 1, plan.nextDate = today + diffDate`, 并增加对应的`StudyRecord`； 如果学习完成，则将`plan.stage = -1; plan.finished = 1`，对应的卡片状态`Card.status = 1`；
3. 如果某张卡片忘记了，则在本地标记该卡片待完成学习，直到完成学习时`stage -= 1`，卡片的本地学习策略见[卡片生命周期](#卡片生命周期)。

数据库每日凌晨4点执行计划任务：
1. 拉取所有`plan.finishOneTime === 0 and plan.finished === 0`的`StudyPlan`，以`nextDate = today`为基准更新学习计划；
2. 拉取所有`plan.finishOneTime === 1 and plan.finished === 0`的`StudyPlan`，更新为`plan.finishOneTime === 0`。

卡组克隆逻辑：
[TODO]

卡组共享逻辑：
[TODO]

## 卡片生命周期
1. 创建卡组，卡组内所有卡片共享同一学习曲线，新建卡组时应有学习曲线编辑策略；
2. 创建卡片，卡片内选择分组，按照卡组曲线共享学习策略；
3. 卡片开始学习，本地策略如下：
  - 卡片学习过程中没有查看答案，本地标记为学习完成，同时按照更新逻辑更新数据库数据；
  - 卡片学习过程中查看了答案，本地标记为待巩固，巩固次数设置为 2；
  - 卡片巩固逻辑：如果当前学习的待巩固卡片学习完成一次，巩固次数减少一次；否则巩固次数重置为 2；巩固次数归零后，标记为学习完成，但是并不增加线上 stage，按照更新逻辑更新数据库数据；
  - 每次学习完成，在数据库中留下学习记录，标记卡片的当次学习的数据，包括持续时间，巩固次数等。
4. 卡片忘记学习，stage 回退一步；
5. 卡组变更学习曲线，单个卡组在学习过程中变更学习曲线，根据新的学习曲线修改卡组内所有正在学习的卡片的 plan 状态；
6. 卡片限流策略（可选），为了防止卡片堆积时当日学习压力过大，用户可以在设置中设置当天最大学习数 n，则每次随机拉取 n 张卡片作为当日学习任务。