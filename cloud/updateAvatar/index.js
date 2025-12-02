const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 添加 env，确保动态环境
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const avatarUrl = event.avatarUrl

  if (!avatarUrl) {
    return {
      success: false,
      message: "avatarUrl 不能为空"
    }
  }

  try {
    // 检查用户是否存在
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' }
    }

    // 更新
    await db.collection('users').where({ openid }).update({
      data: {
        avatar: avatarUrl,
        updateTime: new Date()
      }
    })

    return {
      success: true,
      message: "头像已更新",
      avatar: avatarUrl
    }
  } catch (err) {
    console.error('更新失败:', err)
    return { success: false, message: '更新失败: ' + err.message }
  }
}