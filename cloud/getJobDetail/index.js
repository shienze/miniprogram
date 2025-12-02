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

    const job = jobRes.data

    if (job.enterpriseId) {
      const enterpriseRes = await db.collection('enterprise_users')
        .where({
          openid: job.enterpriseId  
        })
        .get()
      
      if (enterpriseRes.data && enterpriseRes.data.length > 0) {
        const enterprise = enterpriseRes.data[0]
        // 只返回需要的企业信息字段
        job.enterpriseInfo = {
          avatar: enterprise.avatar,
          company: enterprise.company,
          contact: enterprise.contact,
          email: enterprise.email,
          nickname: enterprise.nickname
        }
      } else {
        job.enterpriseInfo = {}
      }
    } else {
      job.enterpriseInfo = {}
    }

    return { success: true, job }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}