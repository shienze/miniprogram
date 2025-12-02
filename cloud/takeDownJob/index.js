const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) =>{
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { id } = event

  try {
    const jobRes = await db.collection('jobs').doc(id).get()
    if (!jobRes.data || jobRes.data.enterpriseId !== openid) {
      return { success: false, msg: '无权限' }
    }
    await db.collection('jobs').doc(id).update({ data: { status: "已下架" } })
    return { success: true, msg: '下架成功' }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}