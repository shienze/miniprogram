// pages/user/intern-match.js
Page({
  data: {
    banners: [
      { url: '/images/intern-banner1.jpg' },
      { url: '/images/intern-banner2.jpg' }
    ],
    searchKeyword: '',
    durationOptions: ['全部', '1-3个月', '3-6个月', '6个月以上'],
    durationIndex: 0,
    locationOptions: ['全部', '北京', '上海', '深圳', '杭州'],
    locationIndex: 0,
    professionalOptions: ['全部', '计算机', '会计', '工商管理', '电子工程'],
    professionalIndex: 0,
    interns: [],
    page: 1,
    loadingMore: false
  },

  onLoad: function () {
    this.loadInterns();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, interns: [] });
    this.loadInterns();
    wx.stopPullDownRefresh();
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    this.setData({ page: 1, interns: [] });
    this.loadInterns();
  },

  changeDuration: function (e) {
    this.setData({ durationIndex: e.detail.value });
  },

  changeLocation: function (e) {
    this.setData({ locationIndex: e.detail.value });
  },

  changeProfessional: function (e) {
    this.setData({ professionalIndex: e.detail.value });
  },

  applyFilter: function () {
    this.setData({ page: 1, interns: [] });
    this.loadInterns();
  },

  loadInterns: function () {
    this.setData({ loadingMore: true });
    
    // 直接使用模拟数据和本地存储，不调用API
    // 首先尝试从本地存储获取数据
    let storedInterns = wx.getStorageSync('interns') || [];
    
    // 如果本地存储没有数据，使用初始模拟数据
    if (storedInterns.length === 0) {
      storedInterns = [
        { id: 1, title: '前端开发实习', company: '腾讯', duration: '3-6个月', location: '深圳', tags: ['React', 'JavaScript'], professional: '计算机', salary: '3000-5000', description: '负责前端开发工作', requirements: '熟悉React框架' },
        { id: 2, title: '会计实习', company: '阿里', duration: '1-3个月', location: '杭州', tags: ['财务', 'Excel'], professional: '会计', salary: '2500-4000', description: '协助财务部门日常工作', requirements: '会计专业优先' },
        { id: 3, title: 'Java开发实习', company: '百度', duration: '3-6个月', location: '北京', tags: ['Java', 'Spring'], professional: '计算机', salary: '3500-5500', description: '后端开发实习岗位', requirements: 'Java基础扎实' },
        { id: 4, title: '市场营销实习', company: '字节跳动', duration: '2-4个月', location: '上海', tags: ['策划', '推广'], professional: '市场营销', salary: '2800-4500', description: '市场推广活动策划', requirements: '沟通能力强' }
      ];
      wx.setStorageSync('interns', storedInterns);
    }
    
    let mockInterns = storedInterns;
    
    // 搜索过滤
    if (this.data.searchKeyword) {
      mockInterns = mockInterns.filter(i => 
        i.title.includes(this.data.searchKeyword) || 
        i.company.includes(this.data.searchKeyword)
      );
    }
    
    // 时长过滤
    if (this.data.durationIndex !== 0) {
      mockInterns = mockInterns.filter(i => i.duration === this.data.durationOptions[this.data.durationIndex]);
    }
    
    // 地点过滤
    if (this.data.locationIndex !== 0) {
      mockInterns = mockInterns.filter(i => i.location === this.data.locationOptions[this.data.locationIndex]);
    }
    
    // 专业过滤
    if (this.data.professionalIndex !== 0) {
      const professional = this.data.professionalOptions[this.data.professionalIndex];
      mockInterns = mockInterns.filter(i => i.professional === professional);
    }
    
    // 设置数据
    this.setData({
      interns: mockInterns,
      loadingMore: false
    });
    
    console.log('实习岗位数据加载成功:', mockInterns);
  },
  
  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadInterns();
    }
  },

  toInternDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/intern-detail?id=' + id }); // 新建详情页，类似职位详情
  },

  applyIntern: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '投递成功 (模拟)' });
    // 实际API
  }
});