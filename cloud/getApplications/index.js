// cloud/getApplications/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const enterpriseOpenid = wxContext.OPENID

  try {
    // 查询所有属于该企业的 applications
    const appsRes = await db.collection('applications')
      .where({ enterpriseOpenid })
      .orderBy('applyTime', 'desc') // 后端初步排序（最新在前）
      .get()

    const applications = appsRes.data || []

    // 收集所有 jobId 去批量查询职位标题（减少多次IO）
    const jobIds = [...new Set(applications.map(a => a.jobId).filter(Boolean))]
    const jobMap = {}
    if (jobIds.length > 0) {
      const jobsPromises = jobIds.map(id => db.collection('jobs').doc(id).get().then(r => ({ id, data: r.data })).catch(() => ({ id, data: null })))
      const jobs = await Promise.all(jobsPromises)
      jobs.forEach(j => { if (j && j.id) jobMap[j.id] = j.data || null })
    }

    const normalized = applications.map(app => {
      const jobDoc = jobMap[app.jobId] || {}
      return {
        ...app,
        jobTitle: (jobDoc && jobDoc.title) || (app.jobTitle ? app.jobTitle : '未知职位'),
        applyTime: app.applyTime ? (new Date(app.applyTime)).toISOString() : null,
        // 兼容：若历史 status 存 '投递中'，前端可显示为 '已投递'
      }
    })

    return {
      success: true,
      data: normalized
    }
  } catch (err) {
    console.error('getApplications error:', err)
    return { success: false, msg: '获取失败: ' + (err.message || err) }
  }
}
