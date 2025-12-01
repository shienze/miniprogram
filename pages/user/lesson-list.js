// pages/user/lesson-list.js
Page({
  data: {
    typeOptions: ['全部', '视频', '文档', '作业', '资料'],
    typeIndex: 0,
    lessons: [],
    page: 1,
    loadingMore: false,
    classId: null
  },

  onLoad: function (options) {
    this.data.classId = parseInt(options.id);
    this.loadLessons();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, lessons: [] });
    this.loadLessons();
    wx.stopPullDownRefresh();
  },

  changeType: function (e) {
    this.setData({ typeIndex: e.detail.value });
  },

  applyFilter: function () {
    this.setData({ page: 1, lessons: [] });
    this.loadLessons();
  },

  loadLessons: function () {
    this.setData({ loadingMore: true });
    
    // 直接使用模拟数据，不调用API
    let mockLessons = [
      { id: 1, title: 'Python基础视频', time: '2023-10-01', type: '视频', progress: 50, preview: '介绍Python变量和循环', certTip: '有助于计算机二级考取' },
      { id: 2, title: '财务报表文档', time: '2023-10-02', type: '文档', progress: 100, preview: '会计报表模板', certTip: '会计从业资格证备考资料' },
      { id: 3, title: '前端作业', time: '2023-10-03', type: '作业', progress: 0, preview: '完成HTML页面', certTip: '' }
    ];
    
    // 过滤类型
    if (this.data.typeIndex !== 0) {
      mockLessons = mockLessons.filter(l => l.type === this.data.typeOptions[this.data.typeIndex]);
    }
    
    // 设置数据
    this.setData({
      lessons: mockLessons,
      loadingMore: false
    });
    
    console.log('模拟课程数据加载成功:', mockLessons);
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadLessons();
    }
  },

  toLessonDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/lesson-detail?id=' + id });
  },

  downloadLesson: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '下载成功 (模拟)', icon: 'success' });
    // 实际wx.downloadFile
  },

  submitHomework: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        wx.showToast({ title: '作业提交成功 (模拟)', icon: 'success' });
      }
    });
  }
});