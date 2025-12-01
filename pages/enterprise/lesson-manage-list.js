// pages/enterprise/lesson-manage-list.js
Page({
  data: {
    typeOptions: ['全部', '视频', '文档', '作业', '资料'],
    typeIndex: 0,
    lessons: [],
    page: 1,
    loadingMore: false,
    showCreateModal: false,
    lessonTypeIndex: 0,
    newLesson: {
      title: '',
      time: '',
      preview: '',
      certAssoc: '',
      filePath: '',
      fileName: ''
    },
    loading: false,
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
    
    // 直接使用模拟数据和本地存储，不调用API
    // 首先尝试从本地存储获取数据
    let storedLessons = wx.getStorageSync('enterpriseLessons') || [];
    
    // 如果本地存储没有数据，使用初始模拟数据
    if (storedLessons.length === 0) {
      storedLessons = [
        { id: 1, classId: 1, title: 'Python基础', time: '2023-10-01', type: '视频', preview: '变量和循环', certAssoc: '计算机二级', completionRate: 70 },
        { id: 2, classId: 1, title: '财务报表', time: '2023-10-02', type: '文档', preview: '模板示例', certAssoc: '会计从业资格证', completionRate: 90 },
        { id: 3, classId: 2, title: '前端作业', time: '2023-10-03', type: '作业', preview: 'HTML页面制作', certAssoc: '', completionRate: 50 }
      ];
      wx.setStorageSync('enterpriseLessons', storedLessons);
    }
    
    // 根据当前班级ID过滤课程
    let mockLessons = storedLessons.filter(lesson => lesson.classId === this.data.classId);
    
    // 类型过滤
    if (this.data.typeIndex !== 0) {
      const filterType = this.data.typeOptions[this.data.typeIndex];
      mockLessons = mockLessons.filter(l => l.type === filterType);
    }
    
    // 设置数据
    this.setData({
      lessons: mockLessons,
      loadingMore: false
    });
    
    console.log('企业端课程数据加载成功:', mockLessons);
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadLessons();
    }
  },

  showCreateModal: function () {
    this.setData({ showCreateModal: true });
  },

  closeCreateModal: function () {
    this.setData({ showCreateModal: false });
  },

  changeLessonType: function (e) {
    this.setData({ lessonTypeIndex: e.detail.value });
  },

  inputTitle: function (e) {
    this.setData({ 'newLesson.title': e.detail.value });
  },

  inputTime: function (e) {
    this.setData({ 'newLesson.time': e.detail.value });
  },

  inputPreview: function (e) {
    this.setData({ 'newLesson.preview': e.detail.value });
  },

  inputCertAssoc: function (e) {
    this.setData({ 'newLesson.certAssoc': e.detail.value });
  },

  uploadFile: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: res => {
        const file = res.tempFiles[0];
        this.setData({
          'newLesson.filePath': file.path,
          'newLesson.fileName': file.name
        });
        wx.showToast({ title: '文件上传成功 (模拟)' });
      }
    });
  },

  createLesson: function () {
    if (!this.data.newLesson.title || !this.data.newLesson.time) {
      wx.showToast({ title: '请填写标题和时间', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    // 直接创建到本地存储
    let storedLessons = wx.getStorageSync('enterpriseLessons') || [];
    const newId = storedLessons.length > 0 ? Math.max(...storedLessons.map(l => l.id)) + 1 : 1;
    const newLesson = {
      id: newId,
      classId: this.data.classId, // 确保包含班级ID
      title: this.data.newLesson.title,
      time: this.data.newLesson.time,
      type: this.data.typeOptions[this.data.lessonTypeIndex],
      preview: this.data.newLesson.preview,
      certAssoc: this.data.newLesson.certAssoc,
      completionRate: 0,
      createTime: new Date().toISOString().split('T')[0]
    };
    storedLessons.push(newLesson);
    wx.setStorageSync('enterpriseLessons', storedLessons);
    
    this.setData({ 
      showCreateModal: false, 
      newLesson: { title: '', time: '', preview: '', certAssoc: '', filePath: '', fileName: '' },
      loading: false 
    });
    
    this.loadLessons(); // 刷新列表
    wx.showToast({ title: '创建成功' });
  },

  toLessonManageDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/lesson-manage-detail?id=' + id });
  },

  editLesson: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '编辑功能开发中' });
    // 跳转或弹窗编辑
  },

  deleteLesson: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ loading: true });
    wx.showModal({
      title: '删除内容',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          let storedLessons = wx.getStorageSync('enterpriseLessons') || [];
          storedLessons = storedLessons.filter(l => l.id !== id);
          wx.setStorageSync('enterpriseLessons', storedLessons);
          this.loadLessons();
          wx.showToast({ title: '删除成功' });
        }
      }
    });
    this.setData({ loading: false });
  }
});