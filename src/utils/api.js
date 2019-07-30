/**
 * @file: 数据库交互
 */

const db = wx.cloud.database()

const names = [
  'getUserCardGroup',
  'createCardGroup',
  'updateCardGroup',
  'getCardGroup',
  'deleteCardGroup',
  'createCard',
  'getCard',
  'getAllCardsOf',
  'updateCard'
]

let functions = {}

names.forEach(v => {
  functions[v] = data => new Promise((resolve, reject) => {
    wx.cloud.callFunction({
      name: 'main',
      data: {
        name: v,
        data
      }
    }).then(res => resolve(res.result))
  })
})

module.exports = functions