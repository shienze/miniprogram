// pages/enterprise/settings.js
Page({
  data: {
    settings: {
      notify: true,
      privacy: true
    }
  },

  onLoad: function () {
    const storedSettings = wx.getStorageSync('enterpriseSettings') || this.data.settings;
    this.setData({ settings: storedSettings });
  },

  toggleNotify: function (e) {
    this.setData({ 'settings.notify': e.detail.value });
    this.saveSettings();
  },

  togglePrivacy: function (e) {
    this.setData({ 'settings.privacy': e.detail.value });
    this.saveSettings();
  },

  saveSettings: function () {
    wx.setStorageSync('enterpriseSettings', this.data.settings);
    wx.showToast({ title: '设置保存成功' });
  },

  toHelp: function () {
    wx.showToast({ title: '帮助中心开发中' });
  },

  logout: function () {
    wx.showModal({
      title: '退出登录',
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