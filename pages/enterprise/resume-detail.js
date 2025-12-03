// pages/enterprise/resume-detail.js
Page({
  data: {
    applicationId: '',
    application: null,
    userInfo: {},
    resume: {},
    jobTitle: '',
    status: '',
    loading: true,
    previewing: false,
  },

  onLoad(options) {
    const applicationId = options.id || options.applicationId || ''
    if (!applicationId) {
      wx.showToast({ title: '未收到简历ID', icon: 'none' })
      return
    }
    this.setData({ applicationId })
    this.loadApplication(applicationId)
  },

  async loadApplication(applicationId) {
    this.setData({ loading: true })
    try {
      const res = await wx.cloud.callFunction({ name: 'getApplications', data: {} })
      if (!res || !res.result || !res.result.success) {
        wx.showToast({ title: res.result && res.result.msg ? res.result.msg : '获取失败', icon: 'none' })
        this.setData({ loading: false })
        return
      }
      const apps = res.result.data || []
      // 查找目标 application（_id）
      const target = apps.find(a => a._id === applicationId || a.id === applicationId)
      if (!target) {
        wx.showToast({ title: '未找到对应简历', icon: 'none' })
        this.setData({ loading: false })
        return
      }
      // 取用户信息与简历信息
      const userInfo = target.userInfo || {}
      const resume = target.resume || {}
      const jobTitle = target.jobTitle || (target.jobTitle === undefined ? '' : target.jobTitle)
      const status = target.status || ''
      this.setData({
        application: target,
        userInfo,
        resume,
        jobTitle,
        status,
        loading: false
      })
    } catch (err) {
      console.error('loadApplication error', err)
      wx.showToast({ title: '获取失败', icon: 'none' })
      this.setData({ loading: false })
    }
  },

  // 预览简历文件
  previewResumeFile() {
    const { resume } = this.data
    const fileId = (resume && (resume.resumeFile || resume.file)) || ''
    if (!fileId) {
      wx.showToast({ title: '该用户未上传简历文件', icon: 'none' })
      return
    }
    this.setData({ previewing: true })
    if (typeof fileId === 'string' && fileId.startsWith('cloud://')) {
      wx.cloud.downloadFile({
        fileID: fileId,
        success: res => {
          const tempFilePath = res.tempFilePath
          wx.openDocument({
            filePath: tempFilePath,
            showMenu: true,
            success: () => { this.setData({ previewing: false }) },
            fail: (e) => {
              console.error('openDocument fail', e)
              wx.showToast({ title: '打开文件失败', icon: 'none' })
              this.setData({ previewing: false })
            }
          })
        },
        fail: err => {
          console.error('downloadFile fail', err)
          wx.showToast({ title: '下载文件失败', icon: 'none' })
          this.setData({ previewing: false })
        }
      })
    } else {
      wx.downloadFile({
        url: fileId,
        success: res => {
          if (res.statusCode === 200) {
            wx.openDocument({
              filePath: res.tempFilePath,
              showMenu: true,
              success: () => { this.setData({ previewing: false }) },
              fail: () => {
                wx.showToast({ title: '打开文件失败', icon: 'none' })
                this.setData({ previewing: false })
              }
            })
          } else {
            wx.showToast({ title: '文件下载失败', icon: 'none' })
            this.setData({ previewing: false })
          }
        },
        fail: () => {
          wx.showToast({ title: '文件下载失败', icon: 'none' })
          this.setData({ previewing: false })
        }
      })
    }
  },

  goChat() {
    const { application } = this.data
    if (!application) return
    const userOpenid = application.userOpenid || (application.userInfo && application.userInfo.openid) || ''
    const applicationId = this.data.applicationId
    // 跳转并传参（enterprise/chat 页面接收）
    wx.navigateTo({
      url: `/pages/enterprise/chat?userOpenid=${userOpenid}&applicationId=${applicationId}`
    })
  },

  rejectApplication() {
    const applicationId = this.data.applicationId
    const currentStatus = this.data.application?.status

    if (!applicationId) {
      wx.showToast({ title: "缺少投递记录ID", icon: "none" })
      return
    }

    if (currentStatus === "已拒绝") {
      wx.showToast({ title: "该简历已被拒绝", icon: "none" })
      return
    }

    wx.showModal({
      title: "确认",
      content: "确认拒绝该简历？",
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: "提交中..." })

          wx.cloud.callFunction({
            name: "changeApplicationStatus",
            data: { applicationId },

            success: (res) => {
              if (res.result && res.result.success) {
                wx.showToast({ title: "已拒绝", icon: "success" })

                this.setData({
                  application: {
                    ...this.data.application,
                    status: "已拒绝",
                  },
                  statusButtonColor: "gray"
                })
              } else {
                wx.showToast({
                  title: res.result?.msg || "操作失败",
                  icon: "none"
                })
              }
            },

            fail: () => {
              wx.showToast({ title: "网络错误", icon: "none" })
            },

            complete: () => wx.hideLoading()
          })
        }
      }
    })
  },

  goBack() {
    wx.navigateBack()
  }
})
