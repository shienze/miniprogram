Page({
  data: {
    role: 'user', // 默认角色
    loading: false,
    authDone: false,
    nickname: '',
    avatar: '',
    phoneNumber : '',
    emailAddress : '',
    
    // 学生字段
    name: '',
    school: '',
    schoolKeyword: '', 
    showSchoolList: false, 
    majorCategory: '', 
    majorName: '', 
    majorCategoryKeyword: '', 
    majorNameKeyword: '', 
    showMajorCategoryList: false, 
    showMajorNameList: false, 
    gradeIndex: 0,
    gradeOptions: ['大一', '大二', '大三', '大四', '大五', '毕业生'],
    
    // 企业字段
    company: '',
    contact: '',
    email: '',
    
    // 院校数据
    allSchools: [
      '西安交通大学', '西北工业大学', '西安电子科技大学', '陕西师范大学', '西北大学',
      '西安理工大学', '西安建筑科技大学', '陕西科技大学', '西安邮电大学', '西安科技大学',
      '西安工业大学', '西安工程大学', '西安外国语大学', '西北政法大学', '西安石油大学',
      '西安财经大学', '西安美术学院', '西安音乐学院', '西安体育学院', '长安大学',
      '陕西中医药大学', '延安大学', '陕西理工大学', '宝鸡文理学院', '咸阳师范学院',
      '渭南师范学院', '榆林学院', '商洛学院', '安康学院', '西安医学院',
      '西安文理学院', '西安航空学院', '陕西工业职业技术学院', '杨凌职业技术学院',
      '陕西国防工业职业技术学院', '西安航空职业技术学院', '陕西铁路工程职业技术学院',
      '陕西职业技术学院', '宝鸡职业技术学院', '咸阳职业技术学院', '渭南职业技术学院',
      '延安职业技术学院', '汉中职业技术学院', '安康职业技术学院', '商洛职业技术学院',
      '榆林职业技术学院', '西安铁路职业技术学院', '西安电力高等专科学校',
      '西安医学高等专科学校', '陕西能源职业技术学院', '陕西财经职业技术学院',
      '陕西交通职业技术学院', '陕西邮电职业技术学院'
    ],
    filteredSchools: [], // 筛选后的院校列表
    
    // 专业数据
    majorCategories: [
      '智能制造与高端装备类',
      '新能源汽车与智能网联类', 
      '电子信息与信息技术类',
      '建筑工程与土木工程类',
      '现代服务业技术类'
    ],
    filteredMajorCategories: [], // 筛选后的专业大类列表
    majorData: {
      '智能制造与高端装备类': ['机电一体化技术', '机械制造与自动化', '工业机器人技术', '智能控制技术', '数控技术', '模具设计与制造'],
      '新能源汽车与智能网联类': ['新能源汽车技术', '汽车检测与维修技术', '智能网联汽车技术', '汽车智能技术'],
      '电子信息与信息技术类': ['电子信息工程技术', '物联网应用技术', '现代通信技术', '软件技术', '计算机网络技术', '大数据技术'],
      '建筑工程与土木工程类': ['建筑工程技术', '工程造价', '建设工程管理', '建筑设备工程技术', '建筑电气工程技术', '供热通风与空调工程技术'],
      '现代服务业技术类': ['电子商务', '现代物流管理', '供应链运营', '烹饪工艺与营养', '酒店管理与数字化运营']
    },
    filteredMajorNames: [], // 筛选后的专业名称列表
    currentMajorNames: [] // 当前专业大类下的专业名称
  },

  onLoad: function (options) {
    console.log('注册页面加载')
    if (options.role) {
      this.setData({
        role: options.role
      })
    }
  },

  handleRoleChange: function (e) {
    this.setData({
      role: e.detail.value
    })
    console.log('切换角色为:', e.detail.value)
  },

  handleWechatAuth: function () {
    console.log('开始微信认证')
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        console.log('微信认证成功:', res)
        const userInfo = res.userInfo
        this.setData({
          authDone: true,
          nickname: userInfo.nickName,
          avatar: userInfo.avatarUrl
        })
        wx.showToast({
          title: '微信认证成功',
          icon: 'success'
        })
      },
      fail: (err) => {
        console.error('微信授权失败:', err)
        wx.showToast({
          title: '授权失败，请重试',
          icon: 'none'
        })
      }
    })
  },

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  onSchoolSearch: function (e) {
    const keyword = e.detail.value
    this.setData({
      schoolKeyword: keyword
    })
    
    if (!keyword.trim()) {
      this.setData({
        filteredSchools: [],
        showSchoolList: false
      })
      return
    }
    
    const keywordLower = keyword.toLowerCase()
    const filtered = this.data.allSchools.filter(school => 
      school.toLowerCase().includes(keywordLower)
    )
    
    this.setData({
      filteredSchools: filtered,
      showSchoolList: true
    })
  },

  selectSchool: function (e) {
    const school = e.currentTarget.dataset.school
    this.setData({
      school: school,
      schoolKeyword: school,
      showSchoolList: false
    })
  },

  clearSchool: function () {
    this.setData({
      school: '',
      schoolKeyword: '',
      showSchoolList: false
    })
  },


  selectMajorCategory: function (e) {
    const category = e.currentTarget.dataset.category
    const majorNames = this.data.majorData[category] || []
    this.setData({
      majorCategory: category,
      currentMajorNames: majorNames,
      majorName: '',
      majorNameKeyword: '',
      filteredMajorNames: majorNames, 
      showMajorNameList: false
    })
    console.log('选择专业大类:', category)
  },

  clearMajorCategory: function () {
    this.setData({
      majorCategory: '',
      currentMajorNames: [],
      majorName: '',
      majorNameKeyword: '',
      filteredMajorNames: []
    })
  },
  

  onMajorNameSearch: function (e) {
    const keyword = e.detail.value
    this.setData({
      majorNameKeyword: keyword
    })
    
    if (!keyword.trim()) {
      // 搜索框为空时，显示该大类下的所有专业
      this.setData({
        filteredMajorNames: this.data.currentMajorNames
      })
      return
    }
    
    const keywordLower = keyword.toLowerCase()
    const filtered = this.data.currentMajorNames.filter(major =>
      major.toLowerCase().includes(keywordLower)
    )
    
    this.setData({
      filteredMajorNames: filtered
    })
  },

  selectMajorName: function (e) {
    const majorName = e.currentTarget.dataset.major
    this.setData({
      majorName: majorName
    })
    console.log('选择专业名称:', majorName)
  },

  clearMajorName: function () {
    this.setData({
      majorName: ''
    })
  },

  onMajorCategoryChange: function (e) {
    const index = parseInt(e.detail.value)
    const category = this.data.majorCategories[index]
    const majorNames = this.data.majorData[category] || []
    
    this.setData({
      majorCategoryIndex: index,
      majorCategory: category,
      currentMajorNames: majorNames,
      majorName: '', // 清空之前的选择
      majorNameIndex: 0
    })
  },
  
  onMajorNameChange: function (e) {
    const index = parseInt(e.detail.value)
    const majorName = this.data.currentMajorNames[index]
    
    this.setData({
      majorNameIndex: index,
      majorName: majorName
    })
  },

  changeGrade: function (e) {
    this.setData({
      gradeIndex: parseInt(e.detail.value)
    })
    console.log('选择年级:', this.data.gradeOptions[this.data.gradeIndex])
  },

  inputCompany: function (e) {
    this.setData({
      company: e.detail.value
    })
  },

  inputContact: function (e) {
    this.setData({
      contact: e.detail.value
    })
  },

  inputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

  hideAllLists: function () {
    this.setData({
      showSchoolList: false,
      showMajorCategoryList: false,
      showMajorNameList: false
    })
  },

  submitRegister: function () {
    console.log('=== 提交注册 ===')
    
    if (!this.data.authDone) {
      wx.showToast({
        title: '请先进行微信认证',
        icon: 'none'
      })
      return
    }

    if (this.data.role === 'user') {
      if (!this.data.name || !this.data.school || !this.data.majorCategory || !this.data.majorName) {
        wx.showToast({
          title: '请填写姓名、学校、专业大类和专业名称',
          icon: 'none'
        })
        return
      }
    }
    else if (this.data.role === 'enterprise') {
      if (!this.data.company || !this.data.contact || !this.data.email) {
        wx.showToast({
          title: '请填写企业名称、联系人和邮箱',
          icon: 'none'
        })
        return
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(this.data.email)) {
        wx.showToast({
          title: '请输入有效的邮箱地址',
          icon: 'none'
        })
        return
      }
    }

    this.setData({
      loading: true
    })

    wx.showLoading({
      title: '注册中...',
      mask: true
    })

    const major = `${this.data.majorCategory} - ${this.data.majorName}`
    
    console.log('提交的注册数据:', {
      role: this.data.role,
      nickname: this.data.nickname,
      avatar: this.data.avatar,
      name: this.data.name,
      school: this.data.school,
      major: major,
      majorCategory: this.data.majorCategory,
      majorName: this.data.majorName,
      grade: this.data.gradeOptions[this.data.gradeIndex],
      company: this.data.company,
      contact: this.data.contact,
      email: this.data.email
    })

    wx.cloud.callFunction({
      name: 'register',
      data: {
        role: this.data.role,
        nickname: this.data.nickname,
        avatar: this.data.avatar,
        name: this.data.name,
        school: this.data.school,
        major: major,
        majorCategory: this.data.majorCategory,
        majorName: this.data.majorName,
        grade: this.data.gradeOptions[this.data.gradeIndex],
        company: this.data.company,
        contact: this.data.contact,
        email: this.data.email
      },
      success: res => {
        console.log('注册云函数返回:', res)
        wx.hideLoading()

        if (res.result && res.result.success) {
          wx.showToast({
            title: '注册成功',
            icon: 'success',
            duration: 2000,
            success: () => {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/common/login?fromRegister=true'
                })
              }, 1500)
            }
          })
        } else {
          if (res.result && res.result.code === 'ROLE_ALREADY_EXISTS') {
            wx.showModal({
              title: '提示',
              content: res.result.msg,
              confirmText: '去登录',
              cancelText: '取消',
              success: (modalRes) => {
                if (modalRes.confirm) {
                  wx.redirectTo({
                    url: '/pages/common/login'
                  })
                }
              }
            })
          } else {
            wx.showToast({
              title: res.result ? res.result.msg : '注册失败',
              icon: 'none',
              duration: 3000
            })
          }
        }
      },
      fail: err => {
        console.error('注册失败:', err)
        wx.hideLoading()
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none',
          duration: 3000
        })
      },
      complete: () => {
        this.setData({
          loading: false
        })
      }
    })
  },

  toLogin: function () {
    wx.redirectTo({
      url: '/pages/common/login'
    })
  },

  resetForm: function () {
    this.setData({
      authDone: false,
      nickname: '',
      avatar: '',
      name: '',
      school: '',
      schoolKeyword: '',
      showSchoolList: false,
      majorCategory: '',
      majorName: '',
      majorCategoryKeyword: '',
      majorNameKeyword: '',
      showMajorCategoryList: false,
      showMajorNameList: false,
      gradeIndex: 0,
      company: '',
      contact: '',
      email: '',
      filteredSchools: [],
      filteredMajorCategories: [],
      filteredMajorNames: [],
      currentMajorNames: []
    })
    wx.showToast({
      title: '表单已重置',
      icon: 'success'
    })
  }
})