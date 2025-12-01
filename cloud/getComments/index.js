const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { postId, page = 1 } = event
  const pageSize = 10

  if (!postId) {
    return { success: false, msg: '缺少postId' }
  }

  try {
    const res = await db.collection('comments')
      .where({ postId })
      .orderBy('time', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get()
    
    // 获取评论总数用于分页
    const countRes = await db.collection('comments')
      .where({ postId })
      .count()
    
    return { 
      success: true, 
      comments: res.data,
      total: countRes.total,
      hasMore: (page * pageSize) < countRes.total
    }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}