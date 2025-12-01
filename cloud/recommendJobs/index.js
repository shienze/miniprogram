const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { page = 1 } = event
  const pageSize = 10

  try {
    // 获取用户专业
    const userRes = await db.collection('users').where({ openid }).get()
    if (userRes.data.length === 0) {
      return { success: false, msg: '用户不存在' }
    }
    const user = userRes.data[0]
    const userMajorCategory = user.majorCategory || ''
    const userMajorName = user.major || ''

    // 获取所有职位
    const jobsRes = await db.collection('jobs').get() // 假设职位不多，全载排序；生产用skip/limit
    let jobs = jobsRes.data || []

    // 计算分数并排序
    jobs = jobs.map(job => {
      let baseScore = 10
      const jobMajorCategory = job.majorRequirements.category || ''
      const jobMajorName = job.majorRequirements.name || ''

      if (jobMajorName === userMajorName) {
        baseScore = 70
      } else if (jobMajorCategory === userMajorCategory) {
        baseScore = 40
      }

      const random = (Math.random() * 30).toFixed(2) // 0-30随机，小数2位
      const score = baseScore + parseFloat(random)

      return { ...job, score }
    }).sort((a, b) => b.score - a.score) // 降序

    // 分页
    const paginatedJobs = jobs.slice((page - 1) * pageSize, page * pageSize)

    return { success: true, msg: '获取成功', jobs: paginatedJobs }
  } catch (err) {
    return { success: false, msg: err.message }
  }
}