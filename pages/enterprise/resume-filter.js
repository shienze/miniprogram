// pages/enterprise/resume-filter.js
Page({
  data: {
    rawApplications: [], 
    filteredApplications: [], 
    loading: false,
    schoolKeyword: '',
    majorKeyword: '',
    showSchoolList: false,
    showMajorList: false,
    allSchools: [
      '西安交通大学','西北工业大学','西安电子科技大学','陕西师范大学','西北大学','西安理工大学','西安建筑科技大学','陕西科技大学','西安邮电大学','西安科技大学','西安工业大学','西安工程大学','西安外国语大学','西北政法大学','西安石油大学','西安财经大学','西安美术学院','西安音乐学院','西安体育学院','长安大学','陕西中医药大学','延安大学','陕西理工大学','宝鸡文理学院','咸阳师范学院','渭南师范学院','榆林学院','商洛学院','安康学院','西安医学院','西安文理学院','西安航空学院','陕西工业职业技术学院','杨凌职业技术学院','陕西国防工业职业技术学院','西安航空职业技术学院','陕西铁路工程职业技术学院','陕西职业技术学院','宝鸡职业技术学院','咸阳职业技术学院','渭南职业技术学院','延安职业技术学院','汉中职业技术学院','安康职业技术学院','商洛职业技术学院','榆林职业技术学院','西安铁路职业技术学院','西安电力高等专科学校','西安医学高等专科学校','陕西能源职业技术学院','陕西财经职业技术学院','陕西交通职业技术学院','陕西邮电职业技术学院'
    ],
    majorData: {
      '智能制造与高端装备类': ['机电一体化技术', '机械制造与自动化', '工业机器人技术', '智能控制技术', '数控技术', '模具设计与制造'],
      '新能源汽车与智能网联类': ['新能源汽车技术', '汽车检测与维修技术', '智能网联汽车技术', '汽车智能技术'],
      '电子信息与信息技术类': ['电子信息工程技术', '物联网应用技术', '现代通信技术', '软件技术', '计算机网络技术', '大数据技术'],
      '建筑工程与土木工程类': ['建筑工程技术', '工程造价', '建设工程管理', '建筑设备工程技术', '建筑电气工程技术', '供热通风与空调工程技术'],
      '现代服务业技术类': ['电子商务', '现代物流管理', '供应链运营', '烹饪工艺与营养', '酒店管理与数字化运营']
    },
    filteredSchools: [],
    filteredMajors: [],
  },

  onLoad() {
    this.fetchApplications()
  },

  fetchApplications() {
    this.setData({ loading: true })
    wx.showLoading({ title: '加载中...' })
    wx.cloud.callFunction({
      name: 'getApplications',
      data: {},
      success: (res) => {
        if (res.result && res.result.success) {
          let apps = res.result.data || []
          apps = apps.map(a => {
            return {
              ...a,
              _localApplyTime: a.applyTime ? new Date(a.applyTime) : new Date(0),
              _displayStatus: (a.status === '投递中' || a.status === '已投递' || a.status === '投递中') ? '已投递' : (a.status || '')
            }
          })
          apps.sort((x, y) => {
            return (y._localApplyTime || 0) - (x._localApplyTime || 0)
          })
          this.setData({
            rawApplications: apps,
            filteredApplications: apps
          })
        } else {
          wx.showToast({ title: (res.result && res.result.msg) ? res.result.msg : '获取失败', icon: 'none' })
        }
      },
      fail: (err) => {
        console.error('getApplications failed', err)
        wx.showToast({ title: '网络错误，请重试', icon: 'none' })
      },
      complete: () => {
        this.setData({ loading: false })
        wx.hideLoading()
      }
    })
  },

  applyLocalFilters() {
    const schoolKeyword = (this.data.schoolKeyword || '').trim().toLowerCase()
    const majorKeyword = (this.data.majorKeyword || '').trim().toLowerCase()

    let filtered = this.data.rawApplications.filter(app => {
      const school = (app.userInfo && app.userInfo.school) ? app.userInfo.school.toLowerCase() : ''
      const majorCategory = (app.userInfo && app.userInfo.majorCategory) ? app.userInfo.majorCategory.toLowerCase() : ''
      const majorName = (app.userInfo && app.userInfo.majorName) ? app.userInfo.majorName.toLowerCase() : ''
      const major = `${majorCategory} - ${majorName}`.toLowerCase()

      let passSchool = true
      let passMajor = true
      if (schoolKeyword) passSchool = school.includes(schoolKeyword)
      if (majorKeyword) passMajor = major.includes(majorKeyword) || majorCategory.includes(majorKeyword) || majorName.includes(majorKeyword)
      return passSchool && passMajor
    })

    this.setData({ filteredApplications: filtered })
  },

  onSchoolInput(e) {
    const v = e.detail.value
    this.setData({ schoolKeyword: v })
    if (!v.trim()) {
      this.setData({ filteredSchools: [], showSchoolList: false })
    } else {
      const kw = v.toLowerCase()
      const filtered = this.data.allSchools.filter(s => s.toLowerCase().includes(kw))
      this.setData({ filteredSchools: filtered.slice(0, 10), showSchoolList: true })
    }
    this.applyLocalFilters()
  },

  selectSchoolFromList(e) {
    const school = e.currentTarget.dataset.school
    this.setData({ schoolKeyword: school, showSchoolList: false })
    this.applyLocalFilters()
  },

  clearSchool() {
    this.setData({ schoolKeyword: '' })
    this.applyLocalFilters()
  },

  onMajorInput(e) {
    const v = e.detail.value
    this.setData({ majorKeyword: v })
    if (!v.trim()) {
      this.setData({ filteredMajors: [], showMajorList: false })
    } else {
      const kw = v.toLowerCase()
      const candidates = []
      for (let cat in this.data.majorData) {
        const names = this.data.majorData[cat] || []
        names.forEach(n => {
          candidates.push(`${cat} - ${n}`)
        })
      }
      const filtered = candidates.filter(m => m.toLowerCase().includes(kw))
      this.setData({ filteredMajors: filtered.slice(0, 10), showMajorList: true })
    }
    this.applyLocalFilters()
  },

  selectMajorFromList(e) {
    const major = e.currentTarget.dataset.major
    this.setData({ majorKeyword: major, showMajorList: false })
    this.applyLocalFilters()
  },

  clearMajor() {
    this.setData({ majorKeyword: '' })
    this.applyLocalFilters()
  },

  viewResume(e) {
    const applicationId = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/enterprise/resume-detail?applicationId=${applicationId}` })
  },

  rejectApplication(e) {
    const applicationId = e.currentTarget.dataset.id
    const currentStatus = e.currentTarget.dataset.status 

    if (!applicationId) {
      wx.showToast({ title: '缺少投递记录ID', icon: 'none' })
      return
    }

    if (currentStatus === '已拒绝') {
      wx.showToast({ title: '该简历已被拒绝', icon: 'none' })
      return
    }

    wx.showModal({
      title: '确认',
      content: '确认拒绝该简历？。',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '提交中...' })
          wx.cloud.callFunction({
            name: 'changeApplicationStatus',
            data: { applicationId },
            success: (res) => {
              if (res.result && res.result.success) {
                wx.showToast({ title: '已拒绝', icon: 'success' })
                const rawApps = this.data.rawApplications.map(a => {
                  if (a._id === applicationId) {
                    return { ...a, status: '已拒绝', _displayStatus: '已拒绝' }
                  }
                  return a
                })
                this.setData({ rawApplications: rawApps }, () => {
                  this.applyLocalFilters()
                })
              } else {
                wx.showToast({ title: (res.result && res.result.msg) ? res.result.msg : '操作失败', icon: 'none' })
              }
            },
            fail: (err) => {
              console.error('changeApplicationStatus fail', err)
              wx.showToast({ title: '网络错误', icon: 'none' })
            },
            complete: () => { wx.hideLoading() }
          })
        }
      }
    })
  }
})
