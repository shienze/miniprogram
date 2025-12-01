// pages/enterprise/resume-filter.js
Page({
  data: {
    schoolOptions: ['全部', '清华大学', '北京大学'],
    schoolIndex: 0,
    majorOptions: ['全部', '计算机', '工商管理'],
    majorIndex: 0,
    resumes: []
  },

  onLoad: function () {
    this.loadResumes();
  },

  loadResumes: function () {
    // 模拟
    const mockResumes = [
      { id: 1, name: '张三', school: '清华大学', major: '计算机', match: 90 },
      { id: 2, name: '李四', school: '北京大学', major: '工商管理', match: 85 }
    ];
    this.setData({ resumes: mockResumes });
  },

  changeSchool: function (e) {
    this.setData({ schoolIndex: e.detail.value });
  },

  changeMajor: function (e) {
    this.setData({ majorIndex: e.detail.value });
  },

  applyFilter: function () {
    this.loadResumes(); // 模拟过滤
    wx.showToast({ title: '筛选成功' });
  },

  toResumeDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/resume-detail?id=' + id });
  }
});