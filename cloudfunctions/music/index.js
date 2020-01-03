// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const count = await db.collection('playlist').count()
  const total = count.total
  return await db.collection('playlist')
  .skip(event.start)
  .limit(event.count)
  .orderBy('createdTime','desc')
  .get()
  .then(res => {
    return {
      ...res,
      total
    }
  })
}