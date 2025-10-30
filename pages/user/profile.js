// pages/user/profile.js
Page({
  data: {
    user: {} // 用户信息
  },

  onLoad: function () {
    this.loadUserInfo();
  },

  onShow: function () {
    // tabbar页每次显示刷新（防止从其他页返回数据不更新）
    this.loadUserInfo();
  },

  loadUserInfo: function () {
    // 模拟加载用户信息（实际从后端或storage）
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.navigateTo({ url: '/pages/common/login' });
      return;
    }
    
    // 模拟用户数据（可从登录时存储）
    const mockUser = {
      name: '张三',
      school: '清华大学 · 计算机科学',
      avatar: '/images/avatar-sample.png' // 可选
    };
    // 实际：wx.request获取用户信息
    this.setData({ user: mockUser });
  },

  toResumeManage: function () {
    wx.navigateTo({ url: '/pages/user/resume-manage' });
  },

  toApplyTrack: function () {
    wx.navigateTo({ url: '/pages/user/apply-track' });
  },

  toSkillGrowth: function () {
    wx.showToast({ title: '技能成长页面开发中', icon: 'none' });
    // wx.navigateTo({ url: '/pages/user/skill-growth' });
  },

  toProfileEdit: function () {
    wx.navigateTo({ url: '/pages/user/profile-edit' }); // 可新建编辑页
  },

  toSwitchRole: function () {
    wx.navigateTo({ url: '/pages/common/switch-role' });
  },

  toSettings: function () {
    wx.navigateTo({ url: '/pages/user/settings' }); // 可新建设置页
  },

  logout: function () {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('role');
          wx.removeStorageSync('resume');
          wx.removeStorageSync('appliedJobs');
          wx.showToast({ title: '已退出' });
          wx.reLaunch({ url: '/pages/common/welcome' });
        }
      }
    });
  }
});