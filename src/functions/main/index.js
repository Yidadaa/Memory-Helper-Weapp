// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

async function getSummaryOfGroup (group) {
  /**
   * 获取卡组的统计信息
   */
  const total = await db.collection('Card').where({groupID: group._id}).count()
  const finish = await db.collection('Card').where({
    groupID: group._id,
    status: 1
  }).count()
  return {
    ...group,
    total: total.total,
    finish: finish.total
  }
}

const functions = {
  getUserCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    const cardGroups = await db.collection('CardGroup').where({
      userID: wxContext.OPENID,
      isDeleted: false
    }).get()

    const data = await Promise.all(cardGroups.data.map(getSummaryOfGroup))
  
    return {data}
  },

  getCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    const cardGroup = await db.collection('CardGroup').doc(event.id).get()
  
    return {
      data: await getSummaryOfGroup(cardGroup.data)
    }
  },

  createCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    return db.collection('CardGroup').add({
      data: {
        userID: wxContext.OPENID,
        ...event,
        createdAt: new Date(),
        createdBy: wxContext.OPENID,
        isDeleted: false,
        count: 0
      }
    })
  },

  deleteCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    return db.collection('CardGroup').doc(event.id).update({
      data: {
        isDeleted: true
      }
    })
  },

  updateCardGroup: async (event) => {
    return db.collection('CardGroup').update({
      data: event
    })
  },
  
  createCard: async (event) => {
    const wxContext = cloud.getWXContext()
    const {front, back, groupID} = event
    return db.collection('Card').add({
      data: {
        front, back, groupID,
        userID: wxContext.OPENID,
        createdAt: new Date(),
        createdBy: wxContext.OPENID,
        isDeleted: false,
        status: 0,
        times: 0
      }
    })
  },

  getAllCardsOf: async (event) => {
    const wxContext = cloud.getWXContext()
    const cards = db.collection('Card').where({
      groupID: event.id,
      isDeleted: false
    }).get()
  
    return cards
  },

  getCard: async (event) => {
    const card = await db.collection('Card').doc(event.id).get()
    const group = await functions.getCardGroup({id: card.groupID})
    return {
      card: card.data,
      group: group.data
    }
  },

  updateCard: async (event) => {
    return db.collection('Card').doc(event.id).update({
      data: event.data
    })
  },
}

exports.main = async (event, context) => {
  const {name, data} = event
  if (!functions[name]) throw Error(`[ERROR]: cannot find function ${name}`)
  return functions[name](data)
}