const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { postId, text } = event

  if (!postId || !text) {
    return { success: false, msg: '缺少postId或评论内容' }
  }

  // 验证评论内容长度
  if (text.trim().length === 0) {
    return { success: false, msg: '评论内容不能为空' }
  }

  if (text.length > 500) {
    return { success: false, msg: '评论内容不能超过500字' }
  }

  try {
    // 获取用户信息（如果需要存储用户基本信息）
    const userRes = await db.collection('users').where({ _openid: openid }).get()
    const userInfo = userRes.data[0] || {}
    
    await db.collection('comments').add({
      data: {
        postId,
        authorId: openid,
        author: userInfo.nickName || '匿名用户', // 存储作者昵称
        avatar: userInfo.avatarUrl || '', // 存储头像
        text: text.trim(),
        time: db.serverDate()
      }
    })
    
    await db.collection('posts').doc(postId).update({ 
      data: { comments: _.inc(1) } 
    })
    
    return { success: true }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}