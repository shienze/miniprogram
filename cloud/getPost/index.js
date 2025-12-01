const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  
  if (!id) {
    return { success: false, msg: '缺少ID' }
  }

  try {
    // 获取帖子详情
    const postRes = await db.collection('posts').doc(id).get()
    const post = postRes.data
    
    if (!post) {
      return { success: false, msg: '帖子不存在' }
    }
    
    // 检查当前用户是否已点赞
    const likeRes = await db.collection('likes')
      .where({
        postId: id,
        userId: openid
      })
      .get()
    
    const isLiked = likeRes.data.length > 0
    
    return { 
      success: true, 
      post: {
        ...post,
        isLiked: isLiked
      }
    }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}