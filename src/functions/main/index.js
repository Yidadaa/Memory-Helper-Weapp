// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const functions = {
  getUserCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    const cardGroups = db.collection('CardGroup').where({
      userID: wxContext.OPENID,
      isDeleted: false
    }).get()
  
    return cardGroups
  },

  getCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    const cardGroup = db.collection('CardGroup').doc(event.id).get()
  
    return cardGroup
  },

  createCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    return db.collection('CardGroup').add({
      data: {
        userID: wxContext.OPENID,
        ...event,
        createdAt: new Date(),
        createdBy: wxContext.OPENID,
        isDeleted: false
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
    return db.collection('Card').add({
      data: {
        userID: wxContext.OPENID,
        ...event,
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
}

exports.main = async (event, context) => {
  const {name, data} = event
  if (!functions[name]) throw Error(`[ERROR]: cannot find function ${name}`)
  return functions[name](data)
}