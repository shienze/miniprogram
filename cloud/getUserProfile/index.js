const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  if (!openid) {
    throw new Error('无法获取openid')
  }

  try {
    // 查询用户
    const userRes = await db.collection('users').where({ openid }).get()
    
    if (userRes.data.length > 0) {
      return userRes.data[0]
    } else {
      // 创建新用户，默认值
      const newUser = {
        openid,
        avatar: '', // 初始为空
        nickname: '微信用户',
        name: '', // 默认空
        school: '', 
        major: '',
        grade: '',
        majorCategory: '',
        majorName: '',
        createTime: new Date(),
        updateTime: new Date()
      }
      const addRes = await db.collection('users').add({ data: newUser })
      newUser._id = addRes._id
      return newUser
    }
  } catch (err) {
    console.error('操作失败:', err)
    throw err
  }
}