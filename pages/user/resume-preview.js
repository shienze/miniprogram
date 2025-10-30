// pages/user/resume-preview.js
Page({
  data: {
    resume: {},
    attachmentPath: '',
    attachmentName: ''
  },

  onLoad: function () {
    // 加载存储的简历（模拟）
    const resume = wx.getStorageSync('resume') || {};
    const attachmentPath = wx.getStorageSync('attachmentPath') || ''; // 假设从管理页存储
    const attachmentName = attachmentPath ? attachmentPath.split('/').pop() : '';
    this.setData({ resume, attachmentPath, attachmentName });
  },

  downloadResume: function () {
    // 模拟下载（实际wx.downloadFile生成PDF）
    wx.showToast({ title: '下载成功（模拟）' });
    // 实际：用canvas生成PDF或后端服务
  },

  backToEdit: function () {
    wx.navigateBack();
  },

  onShareAppMessage: function () {
    return {
      title: '我的简历',
      path: '/pages/user/resume-preview'
    };
  }
});