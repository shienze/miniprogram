// pages/enterprise/profile.js
Page({
  data: {
    company: {}
  },

  onLoad: function () {
    this.loadCompanyInfo();
  },

  loadCompanyInfo: function () {
    // 模拟
    this.setData({
      company: { name: 'XX科技', avatar: '/images/company.png', status: '已认证' }
    });
  },

  toEditInfo: function () {
    wx.navigateTo({ url: '/pages/enterprise/profile-edit' });
  },

  toCertify: function () {
    wx.navigateTo({ url: '/pages/common/register?role=enterprise' }); // 复用注册认证
  },

  toSettings: function () {
    wx.navigateTo({ url: '/pages/enterprise/settings' });
  },

  logout: function () {
    wx.showModal({
      title: '退出',
      content: '确认退出？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('role');
          wx.reLaunch({ url: '/pages/common/welcome' });
        }
      }
    });
  }
});