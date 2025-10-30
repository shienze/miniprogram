// pages/user/resume-manage.js
Page({
  data: {
    resume: { // 模拟初始数据
      name: '',
      phone: '',
      email: '',
      education: '',
      experience: '',
      skills: ''
    },
    attachmentPath: '',
    attachmentName: '',
    aiSuggestion: '',
    loading: false
  },

  onLoad: function () {
    // 加载已存简历（模拟）
    const storedResume = wx.getStorageSync('resume') || this.data.resume;
    this.setData({ resume: storedResume });
  },

  uploadAttachment: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['pdf', 'doc', 'docx'],
      success: res => {
        const file = res.tempFiles[0];
        this.setData({
          attachmentPath: file.path,
          attachmentName: file.name
        });
        // 模拟上传
        wx.showToast({ title: '附件选择成功' });
      }
    });
  },

  aiOptimize: function () {
    // 模拟AI优化
    const suggestion = '建议：添加量化成就，如“领导团队完成项目，提升效率20%”；优化关键词匹配职位描述。';
    this.setData({ aiSuggestion: suggestion });
    wx.showToast({ title: 'AI优化完成' });
    // 实际：wx.request到AI API
  },

  saveResume: function (e) {
    this.setData({ loading: true });
    const formData = e.detail.value;
    wx.setStorageSync('resume', formData);
    // 模拟保存附件（实际uploadFile）
    wx.showToast({ title: '保存成功' });
    wx.navigateTo({ url: '/pages/user/resume-preview' });
    this.setData({ loading: false });
  }
});