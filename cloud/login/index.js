const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.ENV_ID || cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { role, userInfo } = event
  
  console.log('=== 登录开始 ===')
  console.log('openid:', openid)
  console.log('role:', role)

  try {
    // 根据角色选择对应的表
    const collectionName = role === 'user' ? 'users' : 'enterprise_users'
    
    // 查询该openid在对应角色的表中是否存在
    const userRes = await db.collection(collectionName)
      .where({
        openid: openid
      })
      .get()
    
    console.log(`查询${collectionName}结果:`, userRes.data.length, '条记录')

    if (userRes.data.length === 0) {
      console.log('该角色账号未注册')
      return {
        success: false,
        msg: `${role === 'user' ? '学生' : '企业'}账号未注册，请先注册`,
        code: 'USER_NOT_REGISTERED'
      }
    }

    // 获取用户信息
    const user = userRes.data[0]
    console.log('用户信息:', user)

    // 更新用户信息（如果需要）
    const updateData = {}
    let needUpdate = false
    
    if (userInfo && userInfo.nickName && user.nickname !== userInfo.nickName) {
      updateData.nickname = userInfo.nickName
      updateData.avatar = userInfo.avatarUrl
      updateData.updateTime = db.serverDate()
      needUpdate = true
    }
    
    if (needUpdate) {
      await db.collection(collectionName)
        .doc(user._id)
        .update({
          data: updateData
        })
    }

    // 返回登录成功
    return {
      success: true,
      token: openid + '_' + role,  // 区分不同角色的token
      userInfo: {
        _id: user._id,
        openid: user.openid,
        role: role,
        nickname: user.nickname,
        avatar: user.avatar,
        ...(role === 'user' ? {
          name: user.name,
          school: user.school,
          major: user.major,
          grade: user.grade
        } : {
          company: user.company,
          contact: user.contact,
          email: user.email
        })
      }
    }

  } catch (err) {
    console.error('登录错误:', err)
    return {
      success: false,
      msg: '登录失败: ' + err.message,
      code: 'LOGIN_ERROR'
    }
  }
}