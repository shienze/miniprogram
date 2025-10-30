// pages/user/index.js
Page({
  data: {
    banners: [ // 模拟banner
      { url: '/images/banner1.png' },
      { url: '/images/banner2.png' },
      { url: '/images/banner3.png' }
    ],
    searchKeyword: '',
    jobs: [], // 职位列表
    page: 1, // 分页
    loadingMore: false
  },

  onLoad: function () {
    this.loadJobs();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, jobs: [] });
    this.loadJobs();
    wx.stopPullDownRefresh();
  },

  loadJobs: function () {
    this.setData({ loadingMore: true });
    
    // 直接使用模拟数据，不进行网络请求
    setTimeout(() => {
      const mockJobs = [
        { id: 1, title: '前端开发工程师', company: '腾讯', salary: '15-20k', location: '深圳', tags: ['React', 'JavaScript'] },
        { id: 2, title: '产品经理', company: '阿里', salary: '20-25k', location: '杭州', tags: ['产品设计', '用户体验'] },
        { id: 3, title: '数据分析师', company: '字节跳动', salary: '18-22k', location: '北京', tags: ['SQL', 'Python'] }
        // 可以添加更多模拟数据
      ];
      
      this.setData({
        jobs: this.data.page === 1 ? mockJobs : this.data.jobs.concat(mockJobs),
        page: this.data.page + 1,
        loadingMore: false
      });
    }, 20); // 模拟网络延迟
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadJobs();
    }
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    if (!this.data.searchKeyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }
    wx.navigateTo({ url: '/pages/user/job-search?keyword=' + this.data.searchKeyword });
  },

  toJobDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/job-detail?id=' + id });
  }
});