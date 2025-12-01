const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const { 
    title, 
    description, 
    requirements, 
    salary, 
    province = '陕西省', 
    city, 
    district, 
    jobType, 
    majorCategory, 
    majorName, 
    certificates = [] 
  } = event

  function getFieldChineseName(fieldName) {
    const nameMap = {
      'title': '职位标题',
      'description': '职位描述',
      'requirements': '职位要求',
      'salary': '薪资范围',
      'city': '工作城市',
      'district': '工作区县',
      'jobType': '工作类型',
      'majorCategory': '专业大类',
      'majorName': '专业名称'
    }
    return nameMap[fieldName] || fieldName
  }

  const requiredFields = [
    { name: 'title', value: title },
    { name: 'description', value: description },
    { name: 'requirements', value: requirements },
    { name: 'salary', value: salary },
    { name: 'city', value: city },
    { name: 'district', value: district },
    { name: 'jobType', value: jobType },
    { name: 'majorCategory', value: majorCategory },
    { name: 'majorName', value: majorName }
  ]

  for (let field of requiredFields) {
    if (!field.value || String(field.value).trim() === '') {
      console.log(`缺少必填字段: ${field.name}, 值: ${field.value}`)
      return { 
        success: false, 
        msg: `请填写${getFieldChineseName(field.name)}` 
      }
    }
  }

  try {
    console.log('查询企业用户信息，集合: enterprise_users, openid:', openid)
    const enterpriseUser = await db.collection('enterprise_users').where({ openid }).get()
    
    if (enterpriseUser.data.length === 0) {
      console.log('未找到企业用户信息')
      return { 
        success: false, 
        msg: '无权限发布职位，请先注册为企业用户' 
      }
    }

    console.log('权限验证通过，开始创建职位记录...')
    
    const enterpriseInfo = enterpriseUser.data[0]
    console.log('企业用户信息:', enterpriseInfo)

    const filteredCertificates = certificates.filter(cert => cert !== '暂不需要')

    const res = await db.collection('jobs').add({
      data: {
        enterpriseId: openid,
        enterpriseInfo: {
          company: enterpriseInfo.company || '未命名企业',
          contact: enterpriseInfo.contact || '未设置',
          email: enterpriseInfo.email || '',
          avatar: enterpriseInfo.avatar || '',
          nickname: enterpriseInfo.nickname || ''
        },
        title: String(title).trim(),
        description: String(description).trim(),
        requirements: String(requirements).trim(),
        salary: String(salary).trim(),
        location: {
          province: String(province).trim(),
          city: String(city).trim(),
          district: String(district).trim()
        },
        jobType: String(jobType).trim(),
        majorRequirements: {
          category: String(majorCategory).trim(),
          name: String(majorName).trim()
        },
        certificates: filteredCertificates,
        status: '已发布',
        applies: 0,
        views: 0,
        createdAt: db.serverDate(),
        updatedAt: db.serverDate()
      }
    })
    
    console.log('职位发布成功，职位ID:', res._id)
    
    return { 
      success: true, 
      msg: '发布成功', 
      jobId: res._id 
    }
    
  } catch (err) {
    console.error('发布职位失败，错误信息:', err)
    return { 
      success: false, 
      msg: `发布失败: ${err.message || '未知错误，请稍后重试'}` 
    }
  }
}