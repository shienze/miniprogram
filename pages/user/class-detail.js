// pages/user/class-detail.js
Page({
  data: {
    classInfo: {},
    announcement: '<p>欢迎加入订单班，本周授课主题: Python基础。</p>',
    members: [],
    loading: false
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    if (id) {
      this.loadClassDetail(id);
      this.loadMembers(id);
    }
  },

  loadClassDetail: function (id) {
    // 模拟
    const mockClasses = [
      { id: 1, name: '计算机订单班', enterprise: '腾讯合作', professional: '计算机', members: 30, description: '<p>专注前端开发培训，提供实习机会。</p>' },
      // ...其他
    ];
    const classInfo = mockClasses.find(c => c.id === id) || {};
    this.setData({ classInfo });
  },

  loadMembers: function (id) {
    // 模拟
    const mockMembers = [
      { id: 1, avatar: '', name: '张三', professional: '计算机' },
      { id: 2, avatar: '', name: '李四', professional: '计算机' }
    ];
    this.setData({ members: mockMembers });
  },

  signIn: function () {
    this.setData({ loading: true });
    // 模拟签到
    wx.showToast({ title: '签到成功' });
    this.setData({ loading: false });
  },

  toDiscussion: function () {
    wx.showToast({ title: '跳转讨论区' });
    // wx.navigateTo({ url: '/pages/user/class-discussion?id=' + this.data.classInfo.id });
  },

  toLessons: function () {
    wx.navigateTo({ url: '/pages/user/lesson-list?id=' + this.data.classInfo.id });
  },

  exitClass: function () {
    this.setData({ loading: true });
    wx.showModal({
      title: '退出班级',
      content: '确认退出？',
      success: res => {
        if (res.confirm) {
          // 模拟退出
          let myClasses = wx.getStorageSync('myClasses') || [];
          myClasses = myClasses.filter(c => c !== this.data.classInfo.id);
          wx.setStorageSync('myClasses', myClasses);
          wx.showToast({ title: '退出成功' });
          wx.navigateBack();
        }
      }
    });
    this.setData({ loading: false });
  }
});