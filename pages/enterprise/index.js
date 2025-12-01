// pages/enterprise/index.js
Page({
  data: {},

  onLoad: function () {
    // 可加载概览数据，如果需要
  },

  toPublishJob: function () {
    wx.navigateTo({ url: '/pages/enterprise/job-publish' });
  },

  toJobManage: function () {
    wx.navigateTo({ url: '/pages/enterprise/job-manage' }); 
  },

  toClassManage: function () {
    wx.navigateTo({ url: '/pages/enterprise/class-manage' }); 
  },

  toResumeFilter: function () {
    wx.navigateTo({ url: '/pages/enterprise/resume-filter' });
  },

  toDataAnalysis: function () {
    wx.navigateTo({ url: '/pages/enterprise/data-analysis' });
  },

  toProfileEdit: function () {
    wx.navigateTo({ url: '/pages/enterprise/profile-edit' });
  },

  toSettings: function () {
    wx.navigateTo({ url: '/pages/enterprise/profile' }); 
  }
});