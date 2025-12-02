const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) =>{
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  try {
    const res = await db.collection('jobs').where({ status: "已发布", enterpriseId: openid }).orderBy('createdAt', 'desc').get()
    return { success: true, jobs: res.data, count: res.data.length,
      openid: openid }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}