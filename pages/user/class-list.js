// pages/user/class-list.js
Page({
  data: {
    searchKeyword: '',
    professionalOptions: ['全部', '计算机', '会计', '工商管理', '电子工程'],
    professionalIndex: 0,
    schoolOptions: ['全部', 'XX大专学院', 'YY职业学校', 'ZZ技术学院'],
    schoolIndex: 0,
    classes: [],
    recommendedClasses: [],
    page: 1,
    loadingMore: false
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

  changeProfessional: function (e) {
    this.setData({ professionalIndex: e.detail.value });
  },

  changeSchool: function (e) {
    this.setData({ schoolIndex: e.detail.value });
  },

  applyFilter: function () {
    this.setData({ page: 1, classes: [] });
    this.loadClasses();
  },

  loadClasses: function () {
    this.setData({ loadingMore: true });
    
    // 直接使用模拟数据，不调用API
    let mockClasses = [
      { id: 1, name: '计算机订单班', enterprise: '腾讯合作', professional: '计算机', school: 'XX大专学院', members: 30, preview: '学习前端开发，实习机会', joined: false },
      { id: 2, name: '会计订单班', enterprise: '阿里合作', professional: '会计', school: 'YY职业学校', members: 25, preview: '财务实践，证书考取', joined: false }
    ];
    
    // 过滤逻辑
    if (this.data.searchKeyword) {
      mockClasses = mockClasses.filter(c => c.name.includes(this.data.searchKeyword) || c.enterprise.includes(this.data.searchKeyword));
    }
    if (this.data.professionalIndex !== 0) {
      mockClasses = mockClasses.filter(c => c.professional === this.data.professionalOptions[this.data.professionalIndex]);
    }
    if (this.data.schoolIndex !== 0) {
      mockClasses = mockClasses.filter(c => c.school === this.data.schoolOptions[this.data.schoolIndex]);
    }
    
    // 模拟推荐
    const recommended = mockClasses.slice(0, 2);
    
    // 设置数据
    this.setData({
      classes: mockClasses,
      recommendedClasses: recommended,
      loadingMore: false
    });
    
    console.log('模拟班级数据加载成功:', mockClasses);
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadClasses();
    }
  },

  toClassDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/class-detail?id=' + id });
  },

  joinClass: function (e) {
    const id = e.currentTarget.dataset.id;
    // 模拟报名
    let classes = this.data.classes;
    const index = classes.findIndex(c => c.id === id);
    if (index !== -1) {
      classes[index].joined = true;
      classes[index].members += 1;
      this.setData({ classes });
      // 存储我的班级
      let myClasses = wx.getStorageSync('myClasses') || [];
      if (!myClasses.includes(id)) {
        myClasses.push(id);
        wx.setStorageSync('myClasses', myClasses);
      }
      wx.showToast({ title: '报名成功' });
    }
  }
});