// pages/enterprise/resume-detail.js
Page({
  data: {
    resume: {}
  },

  onLoad: function (options) {
    const id = options.id;
    if (id) {
      this.loadResume(id);
    }
  },

  loadResume: function (id) {
    // 模拟
    const mockResume = {
      name: '张三',
      school: '清华大学',
      major: '计算机',
      content: '<p>教育：本科，GPA 3.8。经验：实习前端开发。</p>',
      attachment: true,
      attachmentName: '简历.pdf'
    };
    this.setData({ resume: mockResume });
  },

  downloadAttachment: function () {
    wx.showToast({ title: '下载成功（模拟）' });
  },

  inviteInterview: function () {
    wx.showToast({ title: '邀请发送' });
  },

  reject: function () {
    wx.showModal({
      title: '拒绝',
      content: '确认拒绝？',
      success: res => {
        if (res.confirm) wx.showToast({ title: '已拒绝' });
      }
    });
  },

  startChat: function () {
    wx.navigateTo({ url: '/pages/enterprise/chat' });
  }
});