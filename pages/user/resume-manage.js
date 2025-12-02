// pages/user/resume-manage.js

Page({
  data: {
    resumeFile: '', // fileID
    fileName: '', // 显示文件名
    education: '',
    workExperience: '',
    certificates: '',
    skills: '',
    loading: false
  },

  onLoad: function () {
    this.loadResume()
  },

  onShow: function () {
    this.loadResume() // 刷新
  },

  onPullDownRefresh: function () {
    this.loadResume()
    wx.stopPullDownRefresh()
  },

  loadResume: async function () {
    try {
      const res = await wx.cloud.callFunction({ name: 'getResume' })
      const resumeData = res.result
      this.setData({
        resumeFile: resumeData.resumeFile || '',
        fileName: resumeData.resumeFile ? resumeData.resumeFile.split('/').pop() : '', // 提取文件名
        education: resumeData.education || '',
        workExperience: resumeData.workExperience || '',
        certificates: resumeData.certificates || '',
        skills: resumeData.skills || ''
      })
    } catch (err) {
      console.error('加载简历失败:', err)
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  // 上传简历文件
  uploadResume: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['doc', 'docx', 'pdf'], // 只允许 Word 和 PDF
      success: (res) => {
        const file = res.tempFiles[0]
        const filePath = file.path
        const fileName = file.name
        wx.showLoading({ title: '上传中...' })

        // 上传到云存储
        wx.cloud.uploadFile({
          cloudPath: `resumes/${Date.now()}-${fileName}`, // 简化路径（假设 openid 不需）
          filePath,
          success: (uploadRes) => {
            this.setData({ 
              resumeFile: uploadRes.fileID,
              fileName: fileName // 保存文件名
            })
            wx.hideLoading()
            wx.showToast({ title: '上传成功' })
          },
          fail: (err) => {
            console.error('上传失败:', err)
            wx.hideLoading()
            wx.showToast({ title: '上传失败', icon: 'none' })
          }
        })
      },
      fail: (err) => {
        console.error('选择文件失败:', err)
        wx.showToast({ title: '选择失败', icon: 'none' })
      }
    })
  },

  // 预览文件
  previewResume: function () {
    const { resumeFile } = this.data
    if (!resumeFile) {
      wx.showToast({ title: '无文件', icon: 'none' })
      return
    }

    wx.showLoading({ title: '下载中...' })
    wx.cloud.downloadFile({
      fileID: resumeFile,
      success: (res) => {
        const tempFilePath = res.tempFilePath
        wx.openDocument({
          filePath: tempFilePath,
          showMenu: true, // 允许分享
          success: () => {
            wx.hideLoading()
          },
          fail: (err) => {
            console.error('打开失败:', err)
            wx.hideLoading()
            wx.showToast({ title: '打开失败', icon: 'none' })
          }
        })
      },
      fail: (err) => {
        console.error('下载失败:', err)
        wx.hideLoading()
        wx.showToast({ title: '下载失败', icon: 'none' })
      }
    })
  },

  // 输入处理（不变）
  inputEducation: function (e) {
    this.setData({ education: e.detail.value })
  },
  inputWorkExperience: function (e) {
    this.setData({ workExperience: e.detail.value })
  },
  inputCertificates: function (e) {
    this.setData({ certificates: e.detail.value })
  },
  inputSkills: function (e) {
    this.setData({ skills: e.detail.value })
  },

  // 保存（添加日志）
  saveResume: async function () {
    this.setData({ loading: true })
    wx.showLoading({ title: '保存中...' })

    try {
      const res = await wx.cloud.callFunction({
        name: 'updateResume',
        data: {
          resumeFile: this.data.resumeFile,
          education: this.data.education,
          workExperience: this.data.workExperience,
          certificates: this.data.certificates,
          skills: this.data.skills
        }
      })
      console.log('saveResume 返回:', res); // 前端日志
      if (res.result.success) {
        wx.showToast({ title: '保存成功' })
        this.loadResume() 
        wx.navigateBack();
      } else {
        wx.showToast({ title: res.result.message || '保存失败', icon: 'none' })
      }
    } catch (err) {
      console.error('保存失败:', err)
      wx.showToast({ title: '网络错误，请重试', icon: 'none' })
    } finally {
      wx.hideLoading()
      this.setData({ loading: false })
    }
  }
})