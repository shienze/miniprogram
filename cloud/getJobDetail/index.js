const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const { id } = event

  try {
    const jobRes = await db.collection('jobs').doc(id).get()
    if (!jobRes.data) {
      return { success: false, msg: '职位不存在' }
    }
    const enterpriseRes = await db.collection('users').where({ openid: jobRes.data.enterpriseId, role: 'enterprise' }).get()
    const enterpriseInfo = enterpriseRes.data[0] || {}
    const job = {
      ...jobRes.data,
      enterpriseInfo: {
        name: enterpriseInfo.company || '', 
        avatar: enterpriseInfo.avatar || '',
        contact: enterpriseInfo.contact || '',
        email: enterpriseInfo.email || '',
        nickname: enterpriseInfo.nickname || ''
      }
    }
    return { success: true, job }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}