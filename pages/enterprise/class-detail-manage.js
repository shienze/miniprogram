// pages/enterprise/class-detail-manage.js
Page({
  data: {
    classInfo: {},
    announcement: '<p>本周授课安排: Monday Python, Wednesday Project。</p>',
    members: [],
    activeStats: [],
    loading: false
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    if (id) {
      this.loadClassDetail(id);
      this.loadMembers(id);
      this.loadActiveStats(id);
    }
  },

  loadClassDetail: function (id) {
    // 模拟
    const mockClasses = [
      { id: 1, name: '计算机订单班', professional: '计算机', school: 'XX大专学院', members: 30, preview: '前端开发培训' },
      // ...其他
    ];
    const classInfo = mockClasses.find(c => c.id === id) || {};
    this.setData({ classInfo });
  },

  inputPreview: function (e) {
    this.setData({ 'classInfo.preview': e.detail.value });
  },

  saveInfo: function () {
    this.setData({ loading: true });
    // 模拟保存
    wx.showToast({ title: '简介保存成功' });
    this.setData({ loading: false });
  },

  inputAnnouncement: function (e) {
    this.setData({ announcement: e.detail.value });
  },

  saveAnnouncement: function () {
    this.setData({ loading: true });
    // 模拟保存
    wx.showToast({ title: '公告保存成功' });
    this.setData({ loading: false });
  },

  loadMembers: function (id) {
    // 模拟
    const mockMembers = [
      { id: 1, avatar: '', name: '张三', professional: '计算机', status: '已审批' },
      { id: 2, avatar: '', name: '李四', professional: '计算机', status: '待审批' }
    ];
    this.setData({ members: mockMembers });
  },

  approveMember: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ loading: true });
    let members = this.data.members;
    const index = members.findIndex(m => m.id === id);
    if (index !== -1) {
      members[index].status = '已审批';
      this.setData({ members });
      wx.showToast({ title: '审批通过' });
    }
    this.setData({ loading: false });
  },

  removeMember: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ loading: true });
    wx.showModal({
      title: '移除成员',
      content: '确认移除？',
      success: res => {
        if (res.confirm) {
          let members = this.data.members;
          members = members.filter(m => m.id !== id);
          this.setData({ members });
          wx.showToast({ title: '移除成功' });
        }
      }
    });
    this.setData({ loading: false });
  },

  toLessonManage: function () {
    wx.navigateTo({ url: '/pages/enterprise/lesson-manage-list?id=' + this.data.classInfo.id });
  },

  loadActiveStats: function (id) {
    // 模拟统计
    const mockStats = [
      { id: 1, name: '张三', active: 90, signIns: 5, homeworks: 3 },
      { id: 2, name: '李四', active: 70, signIns: 4, homeworks: 2 }
    ];
    this.setData({ activeStats: mockStats });
  }
});