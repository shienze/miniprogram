const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const userOpenid = wxContext.OPENID
  const { jobId } = event

  if (!userOpenid) {
    return { success: false, message: '无法获取用户ID' }
  }
  if (!jobId) {
    return { success: false, message: '缺少职位ID' }
  }

  try {
    // 检查是否已投递
    const applyRes = await db.collection('applications').where({ jobId, userOpenid }).get()
    if (applyRes.data.length > 0) {
      return { success: false, message: '已投递该职位' }
    }

    // 获取职位信息（包括企业openid）
    const jobRes = await db.collection('jobs').doc(jobId).get()
    if (!jobRes.data) {
      return { success: false, message: '职位不存在' }
    }
    const enterpriseOpenid = jobRes.data.enterpriseId 

    // 获取用户信息
    const userRes = await db.collection('users').where({ openid: userOpenid }).get()
    if (userRes.data.length === 0) {
      return { success: false, message: '用户不存在' }
    }
    const user = userRes.data[0]

    // 获取简历信息
    const resumeRes = await db.collection('resumes').where({ openid: userOpenid }).get()
    if (resumeRes.data.length === 0) {
      return { success: false, message: '简历不存在' }
    }
    const resume = resumeRes.data[0]
    
    // 组装申请数据
    const application = {
      jobId,
      enterpriseOpenid,
      userOpenid,
      resume: {
        resumeFile: resume.resumeFile || '',
        education: resume.education || '',
        workExperience: resume.workExperience || '',
        certificates: resume.certificates || '',
        skills: resume.skills || ''
      },
      userInfo: {
        name: user.name || '',
        school: user.school || '',
        majorCategory: user.majorCategory || '',
        majorName: user.majorName || '',
        grade: user.grade || ''
      },
      applyTime: new Date(),
      status: '投递中'
    }

    // 创建记录
    await db.collection('applications').add({ data: application })

    return { success: true, message: '投递成功' }
  } catch (err) {
    console.error('投递失败:', err)
    return { success: false, message: '投递失败: ' + err.message }
  }
}