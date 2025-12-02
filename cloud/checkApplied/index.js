const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userOpenid = wxContext.OPENID
  const { jobId } = event

  if (!userOpenid || !jobId) {
    return { success: false, message: '缺少参数' }
  }

  try {
    const applyRes = await db.collection('applications').where({ jobId, userOpenid }).get()
    return { success: true, applied: applyRes.data.length > 0 }
  } catch (err) {
    console.error('检查失败:', err)
    return { success: false, message: '检查失败' }
  }
}