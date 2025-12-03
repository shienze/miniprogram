// cloud/getApplications/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const enterpriseOpenid = wxContext.OPENID

  try {
    const appsRes = await db.collection('applications')
      .where({ enterpriseOpenid })
      .orderBy('applyTime', 'desc')
      .get()

    const applications = appsRes.data || []

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
