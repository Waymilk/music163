// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

const rp = require('request-promise');

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

// 云函数入口函数
exports.main = async (event, context) => {
  // const list = await playlistCollection.get()
  const MAX_LIMIT = 10
  let count = await playlistCollection.count()
  let total = count.total
  let batchTimes = Math.ceil(total / MAX_LIMIT)
  let tasks = []
  for(let i = 0; i < batchTimes; i++){
    let promise = playlistCollection.skip(i*MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  let list = {
    data:[]
  }
  if(tasks.length){
    list = (await Promise.all(tasks)).reduce((acc,cur) => {
      return {
        data:acc.data.concat(cur.data)
      }
    })
  }
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })

  const realData = []

  for (i in playlist){
    let flag = true
    for(j in list.data){
      if (playlist[i].id === list.data[j].id){
        flag = false
        break
      }
    }
    flag && realData.push(playlist[i])
  }
  for (i in realData){
    await playlistCollection.add({
      data:{
        ...realData[i],
        createdTime:db.serverDate()
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.error(err)
    })
  }
}