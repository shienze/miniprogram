const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1 } = event
  const pageSize = 10

  try {
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data.length === 0) {
      return { success: false, msg: '用户不存在' }
    }
    const user = userRes.data[0]
    const userMajorCategory = user.majorCategory || ''
    const userMajorName = user.majorName || ''

    const jobsRes = await db.collection('jobs')
      .where({
        jobType: "实习", status: "已发布"      
      })
      .get()

    let jobs = jobsRes.data || []

    jobs = jobs.map(job => {
      let baseScore = 10
      const jobMajorCategory = job.majorRequirements?.category || ''
      const jobMajorName = job.majorRequirements?.name || ''

      if (jobMajorName === userMajorName) {
        baseScore = 70
      } else if (jobMajorCategory === userMajorCategory) {
        baseScore = 40
      }

      const random = (Math.random() * 20).toFixed(2)
      const score = baseScore + parseFloat(random)

      return { ...job, score }
    }).sort((a, b) => b.score - a.score)

    const paginatedJobs = jobs.slice((page - 1) * pageSize, page * pageSize)

    return { success: true, msg: '获取成功', jobs: paginatedJobs }

  } catch (err) {
    return { success: false, msg: err.message }
  }
}
