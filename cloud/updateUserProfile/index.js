const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('接收到数据:', event); // 日志：查看传入数据
  console.log('openid:', openid); // 日志：查看 openid

  if (!openid) {
    return { success: false, message: '无法获取openid' }
  }

  const { nickname, phoneNumber, emailAddress, name, school, majorCategory, majorName, major, grade } = event

  // 放松验证：允许部分字段空（云函数不强制，前端已验）
  if (!name || !school || !majorCategory || !majorName || !major) {
    console.log('必填字段缺失');
    return { success: false, message: '必填字段缺失' }
  }

  try {
    // 检查用户是否存在
    const userRes = await db.collection('users').where({ openid }).get()
    console.log('查询用户结果:', userRes); // 日志：查看是否找到用户
    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' }
    }

    // 更新
    const updateRes = await db.collection('users').where({ openid }).update({
      data: {
        nickname,
        phoneNumber,
        emailAddress,
        name,
        school,
        majorCategory,
        majorName,
        major,
        grade,
        updateTime: new Date()
      }
    })
    console.log('更新结果:', updateRes); // 日志：查看 stats.updated

    if (updateRes.stats.updated === 0) {
      return { success: false, message: '未找到匹配用户或无数据变化' }
    }

    return { success: true, message: '资料更新成功' }
  } catch (err) {
    console.error('更新失败:', err)
    return { success: false, message: '更新失败: ' + err.message }
  }
}