const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  console.log('getResume: openid:', openid); 

  if (!openid) {
    throw new Error('无法获取openid')
  }

  try {
    const resumeRes = await db.collection('resumes').where({ openid }).get()
    console.log('getResume: 查询结果:', resumeRes.data.length); 
    
    if (resumeRes.data.length > 0) {
      return resumeRes.data[0]
    } else {
      const newResume = {
        openid,
        resumeFile: '', 
        education: '',
        workExperience: '',
        certificates: '',
        skills: '',
        createTime: new Date(),
        updateTime: new Date()
      }
      const addRes = await db.collection('resumes').add({ data: newResume })
      console.log('getResume: 创建成功，_id:', addRes._id); 
      newResume._id = addRes._id
      return newResume
    }
  } catch (err) {
    console.error('getResume 操作失败:', err)
    throw err
  }
}