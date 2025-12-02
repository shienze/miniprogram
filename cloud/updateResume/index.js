const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('updateResume: openid:', openid); // 日志
  console.log('updateResume: 接收数据:', event); // 日志

  if (!openid) {
    return { success: false, message: '无法获取openid' }
  }

  const { resumeFile, education, workExperience, certificates, skills } = event

  try {
    // 检查是否存在
    const resumeRes = await db.collection('resumes').where({ openid }).get()
    console.log('updateResume: 查询结果:', resumeRes.data.length); // 日志

    if (resumeRes.data.length === 0) {
      // 创建新
      const addRes = await db.collection('resumes').add({
        data: {
          openid,
          resumeFile: resumeFile || '',
          education: education || '',
          workExperience: workExperience || '',
          certificates: certificates || '',
          skills: skills || '',
          createTime: new Date(),
          updateTime: new Date()
        }
      })
      console.log('updateResume: 创建成功，_id:', addRes._id); // 日志
    } else {
      // 更新
      const updateRes = await db.collection('resumes').where({ openid }).update({
        data: {
          resumeFile: resumeFile || '',
          education: education || '',
          workExperience: workExperience || '',
          certificates: certificates || '',
          skills: skills || '',
          updateTime: new Date()
        }
      })
      console.log('updateResume: 更新结果:', updateRes); // 日志
      if (updateRes.stats.updated === 0) {
        return { success: false, message: '未找到匹配记录或无变化' }
      }
    }

    return { success: true, message: '简历更新成功' }
  } catch (err) {
    console.error('updateResume 更新失败:', err)
    return { success: false, message: '更新失败: ' + err.message }
  }
}