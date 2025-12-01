const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const appid = wxContext.APPID
  const { title, content, tags = [], attachment = '' } = event

  // 参数验证
  if (!title || !content) {
    return { success: false, msg: '缺少标题或内容' }
  }

  // 数据长度验证
  if (title.length > 100) {
    return { success: false, msg: '标题长度不能超过100个字符' }
  }

  if (content.length > 5000) {
    return { success: false, msg: '内容长度不能超过5000个字符' }
  }

  // 标签验证
  if (!Array.isArray(tags)) {
    return { success: false, msg: '标签格式不正确' }
  }

  if (tags.length > 10) {
    return { success: false, msg: '标签数量不能超过10个' }
  }

  // 验证每个标签的长度
  const invalidTag = tags.find(tag => typeof tag !== 'string' || tag.length > 20)
  if (invalidTag) {
    return { success: false, msg: '标签格式不正确或长度超过20个字符' }
  }

  // 附件验证
  if (attachment && typeof attachment !== 'string') {
    return { success: false, msg: '附件格式不正确' }
  }

  try {
    const postData = {
      authorId: openid,
      authorAppId: appid, // 记录APPID
      title: title.trim(), // 去除首尾空格
      content: content.trim(),
      tags: tags.map(tag => tag.trim()).filter(tag => tag), // 清理标签
      attachment: attachment.trim(),
      likes: 0,
      comments: 0,
      viewCount: 0, // 添加浏览计数
      status: 'published', // 添加状态字段
      time: db.serverDate(),
      updateTime: db.serverDate() // 添加更新时间
    }

    const res = await db.collection('posts').add({
      data: postData
    })

    return { 
      success: true, 
      postId: res._id,
      msg: '发布成功'
    }
  } catch (err) {
    console.error('发布文章失败:', err)
    return { 
      success: false, 
      msg: '发布失败，请稍后重试',
      error: err.message 
    }
  }
}