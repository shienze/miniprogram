const cloud = require('wx-server-sdk')
cloud.init({
  env: process.env.ENV_ID || cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  console.log('=== 注册开始 ===')
  console.log('openid:', openid)
  console.log('注册数据:', event)

  try {
    const collectionName = event.role === 'user' ? 'users' : 'enterprise_users'
    
    const userData = {
      openid: openid,
      nickname: event.nickname || '',
      avatar: event.avatar || '',
      updateTime: db.serverDate(),
      createTime: db.serverDate()
    }

    if (event.role === 'user') {
      userData.name = event.name || ''
      userData.school = event.school || ''
      
      if (event.majorCategory && event.majorName) {
        userData.majorCategory = event.majorCategory
        userData.majorName = event.majorName
        userData.major = `${event.majorCategory} - ${event.majorName}` 
      } else if (event.major) {
        userData.major = event.major
      } else {
        userData.major = ''
      }
      
      userData.grade = event.grade || ''

      console.log('学生专业信息:', {
        majorCategory: event.majorCategory,
        majorName: event.majorName,
        major: event.major,
        finalMajor: userData.major
      })
      
    } else if (event.role === 'enterprise') {
      userData.company = event.company || ''
      userData.contact = event.contact || ''
      userData.email = event.email || ''
    }

    const userRes = await db.collection(collectionName)
      .where({
        openid: openid
      })
      .get()
    
    console.log(`查询${collectionName}结果:`, userRes.data.length, '条记录')

    if (userRes.data.length > 0) {
      console.log('该角色账号已存在')
      return {
        success: false,
        msg: `您已经注册过${event.role === 'user' ? '学生' : '企业'}账号，请直接登录`,
        code: 'ROLE_ALREADY_EXISTS'
      }
    }

    console.log('创建新用户...')
    console.log('用户数据:', userData)
    
    const addResult = await db.collection(collectionName).add({
      data: userData
    })
    
    console.log('注册成功，文档ID:', addResult._id)
    
    return {
      success: true,
      msg: '注册成功',
      userId: addResult._id
    }

  } catch (err) {
    console.error('=== 注册失败 ===')
    console.error('错误信息:', err)
    return {
      success: false,
      msg: '注册失败: ' + err.message
    }
  }
}