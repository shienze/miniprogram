const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { postId } = event

  if (!postId) {
    return { success: false, msg: '缺少postId' }
  }

  try {
    const likeRes = await db.collection('likes').where({ postId, userId: openid }).get()
    if (likeRes.data.length > 0) {
      // 取消点赞
      await db.collection('likes').doc(likeRes.data[0]._id).remove()
      await db.collection('posts').doc(postId).update({ data: { likes: _.inc(-1) } })
      return { success: true, likes: -1 }
    } else {
      // 点赞
      await db.collection('likes').add({ data: { postId, userId: openid } })
      await db.collection('posts').doc(postId).update({ data: { likes: _.inc(1) } })
      return { success: true, likes: 1 }
    }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}