// pages/user/lesson-detail.js
Page({
  data: {
    lesson: {},
    notes: '',
    homeworkNote: '',
    homeworkAttachment: '',
    newFeedback: '',
    feedbacks: [],
    loading: false
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    if (id) {
      this.loadLesson(id);
      this.loadFeedbacks(id);
    }
  },

  loadLesson: function (id) {
    // 模拟
    const mockLessons = [
      { id: 1, title: 'Python基础视频', time: '2023-10-01', type: '视频', progress: 50, preview: '介绍Python变量', certTip: '有助于计算机二级考取', url: 'http://example.com/video.mp4' },
      { id: 2, title: '财务报表文档', time: '2023-10-02', type: '文档', progress: 100, preview: '报表模板', certTip: '会计从业资格证资料', content: '<p>财务报表示例</p>' },
      { id: 3, title: '前端作业', time: '2023-10-03', type: '作业', progress: 0, preview: 'HTML页面', certTip: '' }
    ];
    const lesson = mockLessons.find(l => l.id === id) || {};
    this.setData({ lesson });
    // 加载笔记
    this.setData({ notes: wx.getStorageSync('lessonNotes_' + id) || '' });
  },

  loadFeedbacks: function (id) {
    // 模拟
    const mockFeedbacks = [
      { id: 1, author: '老师', text: '内容清晰，建议多练习', time: '10:30' },
      { id: 2, author: '同学A', text: '视频很实用', time: '11:00' }
    ];
    this.setData({ feedbacks: mockFeedbacks });
  },

  inputNotes: function (e) {
    this.setData({ notes: e.detail.value });
  },

  saveNotes: function () {
    wx.setStorageSync('lessonNotes_' + this.data.lesson.id, this.data.notes);
    wx.showToast({ title: '笔记保存成功' });
  },

  inputHomeworkNote: function (e) {
    this.setData({ homeworkNote: e.detail.value });
  },

  uploadHomework: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      success: res => {
        const file = res.tempFiles[0];
        this.setData({ homeworkAttachment: file.name });
        wx.showToast({ title: '附件上传成功 (模拟)' });
      }
    });
  },

  submitHomework: function () {
    if (!this.data.homeworkNote) {
      wx.showToast({ title: '请填写作业描述', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    // 模拟提交
    wx.showToast({ title: '作业提交成功' });
    this.setData({ loading: false });
  },

  inputFeedback: function (e) {
    this.setData({ newFeedback: e.detail.value });
  },

  submitFeedback: function () {
    if (!this.data.newFeedback) {
      wx.showToast({ title: '请输入反馈', icon: 'none' });
      return;
    }
    const newFeedback = {
      id: this.data.feedbacks.length + 1,
      author: '我',
      text: this.data.newFeedback,
      time: '现在'
    };
    this.setData({
      feedbacks: this.data.feedbacks.concat(newFeedback),
      newFeedback: ''
    });
    wx.showToast({ title: '反馈发送成功' });
  }
});