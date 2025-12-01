// pages/enterprise/lesson-manage-detail.js
Page({
  data: {
    lesson: {},
    submissions: [],
    stats: { viewRate: 0, completionRate: 0 },
    loading: false
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    if (id) {
      this.loadLesson(id);
      this.loadSubmissions(id);
      this.loadStats(id);
    }
  },

  loadLesson: function (id) {
    // 模拟
    const mockLessons = [
      { id: 1, title: 'Python基础', time: '2023-10-01', type: '视频', preview: '变量和循环', certAssoc: '计算机二级', fileName: 'video.mp4' },
      // ...其他
    ];
    const lesson = mockLessons.find(l => l.id === id) || {};
    this.setData({ lesson });
  },

  inputPreview: function (e) {
    this.setData({ 'lesson.preview': e.detail.value });
  },

  inputCertAssoc: function (e) {
    this.setData({ 'lesson.certAssoc': e.detail.value });
  },

  saveInfo: function () {
    this.setData({ loading: true });
    // 模拟保存
    wx.showToast({ title: '信息保存成功' });
    this.setData({ loading: false });
  },

  uploadFile: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: res => {
        const file = res.tempFiles[0];
        this.setData({ 'lesson.fileName': file.name });
        wx.showToast({ title: '文件替换成功 (模拟)' });
      }
    });
  },

  loadSubmissions: function (id) {
    // 模拟作业提交
    const mockSubmissions = [
      { id: 1, studentName: '张三', time: '2023-10-02', attachment: 'homework.doc', feedback: '' },
      { id: 2, studentName: '李四', time: '2023-10-03', attachment: 'report.pdf', feedback: '优秀，继续努力' }
    ];
    this.setData({ submissions: mockSubmissions });
  },

  inputFeedback: function (e) {
    const id = parseInt(e.currentTarget.dataset.id);
    let submissions = this.data.submissions;
    const index = submissions.findIndex(s => s.id === id);
    if (index !== -1) {
      submissions[index].feedback = e.detail.value;
      this.setData({ submissions });
    }
  },

  saveFeedback: function (e) {
    const id = parseInt(e.currentTarget.dataset.id);
    this.setData({ loading: true });
    // 模拟保存
    wx.showToast({ title: '反馈保存成功' });
    this.setData({ loading: false });
  },

  loadStats: function (id) {
    // 模拟统计
    this.setData({ stats: { viewRate: 80, completionRate: 60 } });
  }
});