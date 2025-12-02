// cloud/changeApplicationStatus/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const enterpriseOpenid = wxContext.OPENID
  const { applicationId } = event

  if (!applicationId) {
    return { success: false, msg: '缺少 applicationId' }
  }

  try {
    const appDoc = await db.collection('applications').doc(applicationId).get()
    if (!appDoc || !appDoc.data) {
      return { success: false, msg: '未找到该投递记录' }
    }
    const app = appDoc.data
    if (app.enterpriseOpenid !== enterpriseOpenid) {
      return { success: false, msg: '无权限操作该投递记录' }
    }

    const currentStatus = (app.status || '').trim()
    if (currentStatus === '已拒绝') {
      return { success: false, msg: '该简历已被拒绝' }
    }

    await db.collection('applications').doc(applicationId).update({
      data: {
        status: '已拒绝',
        updatedAt: db.serverDate()
      }
    })

    return { success: true, msg: '更新成功' }
  } catch (err) {
    console.error('changeApplicationStatus error:', err)
    return { success: false, msg: '更新失败: ' + (err.message || err) }
  }
}
