
Page({
  data: {
    course: {},
    notes: ''
  },

  onLoad: function (options) {
    const id = options.id;
    this.loadCourse(id);
  },

  loadCourse: function (id) {
    // 模拟
    const mockCourses = {
      1: { title: '大专生Python入门', duration: '10小时', progress: 0, videoUrl: 'http://example.com/video.mp4' }, // 替换实际url
      // ...其他
    };
    this.setData({ course: mockCourses[id] || {} });
    // 加载笔记
    this.setData({ notes: wx.getStorageSync('notes_' + id) || '' });
  },

  inputNotes: function (e) {
    this.setData({ notes: e.detail.value });
  },

  saveNotes: function () {
    wx.setStorageSync('notes_' + this.data.course.id, this.data.notes);
    wx.showToast({ title: '笔记保存成功' });
  }
});