// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

const functions = {
  getUserCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    const cardGroups = db.collection('CardGroup').where({
      userID: wxContext.OPENID
    }).get()
  
    return cardGroups
  },

  createCardGroup: async (event) => {
    const wxContext = cloud.getWXContext()
    return db.collection('CardGroup').add({
      data: {
        userID: wxContext.OPENID,
        ...event
      }
    })
  },

  updateCardGroup: async (event) => {
    return db.collection('CardGroup').update({
      data: event
    })
  }
}

exports.main = async (event, context) => {
  const {name, data} = event
  return functions[name](data)
}