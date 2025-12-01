// pages/enterprise/class-manage.js
Page({
  data: {
    searchKeyword: '',
    classes: [],
    page: 1,
    loadingMore: false,
    showCreateModal: false,
    professionalOptions: ['计算机', '会计', '工商管理', '电子工程'],
    professionalIndex: 0,
    schoolOptions: ['XX大专学院', 'YY职业学校', 'ZZ技术学院'],
    schoolIndex: 0,
    newClass: {
      name: '',
      professional: '',
      school: '',
      preview: ''
    },
    loading: false
  },

  onLoad: function () {
    this.loadClasses();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, classes: [] });
    this.loadClasses();
    wx.stopPullDownRefresh();
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    this.setData({ page: 1, classes: [] });
    this.loadClasses();
  },

  loadClasses: function () {
    this.setData({ loadingMore: true });
    
    // 直接使用模拟数据，不调用API
    // 首先尝试从本地存储获取数据
    let storedClasses = wx.getStorageSync('enterpriseClasses') || [];
    
    // 如果本地存储没有数据，使用初始模拟数据
    if (storedClasses.length === 0) {
      storedClasses = [
        { id: 1, name: '计算机订单班', professional: '计算机', school: 'XX大专学院', members: 30, preview: '前端开发培训', status: '活跃' },
        { id: 2, name: '会计订单班', professional: '会计', school: 'YY职业学校', members: 25, preview: '财务实践', status: '活跃' }
      ];
      wx.setStorageSync('enterpriseClasses', storedClasses);
    }
    
    let mockClasses = storedClasses;
    
    // 搜索过滤
    if (this.data.searchKeyword) {
      mockClasses = mockClasses.filter(c => 
        c.name.includes(this.data.searchKeyword) || 
        c.professional.includes(this.data.searchKeyword)
      );
    }
    
    // 设置数据
    this.setData({
      classes: mockClasses,
      loadingMore: false
    });
    
    console.log('企业端班级数据加载成功:', mockClasses);
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadClasses();
    }
  },

  showCreateModal: function () {
    this.setData({ showCreateModal: true });
  },

  closeCreateModal: function () {
    this.setData({ showCreateModal: false });
  },

  inputName: function (e) {
    this.setData({ 'newClass.name': e.detail.value });
  },

  changeProfessional: function (e) {
    this.setData({ professionalIndex: e.detail.value, 'newClass.professional': this.data.professionalOptions[e.detail.value] });
  },

  changeSchool: function (e) {
    this.setData({ schoolIndex: e.detail.value, 'newClass.school': this.data.schoolOptions[e.detail.value] });
  },

  inputPreview: function (e) {
    this.setData({ 'newClass.preview': e.detail.value });
  },

  createClass: function () {
    if (!this.data.newClass.name || !this.data.newClass.professional) {
      wx.showToast({ title: '请填写班级名称和专业', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    // 直接创建到本地存储
    let storedClasses = wx.getStorageSync('enterpriseClasses') || [];
    const newId = storedClasses.length > 0 ? Math.max(...storedClasses.map(c => c.id)) + 1 : 1;
    const newClass = {
      id: newId,
      ...this.data.newClass,
      members: 0,
      status: '活跃',
      createTime: new Date().toISOString().split('T')[0]
    };
    storedClasses.push(newClass);
    wx.setStorageSync('enterpriseClasses', storedClasses);
    
    this.setData({ 
      showCreateModal: false, 
      newClass: { name: '', professional: '', school: '', preview: '' },
      loading: false 
    });
    
    this.loadClasses(); // 刷新列表
    wx.showToast({ title: '创建成功' });
  },

  toClassDetailManage: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/class-detail-manage?id=' + id });
  },

  editClass: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '编辑功能开发中' });
    // wx.navigateTo({ url: '/pages/enterprise/class-edit?id=' + id });
  },

  deleteClass: function (e) {
    const id = e.currentTarget.dataset.id;
    this.setData({ loading: true });
    wx.showModal({
      title: '删除班级',
      content: '确认删除？',
      success: res => {
        if (res.confirm) {
          let storedClasses = wx.getStorageSync('enterpriseClasses') || [];
          storedClasses = storedClasses.filter(c => c.id !== id);
          wx.setStorageSync('enterpriseClasses', storedClasses);
          this.loadClasses();
          wx.showToast({ title: '删除成功' });
        }
      }
    });
    this.setData({ loading: false });
  }
});