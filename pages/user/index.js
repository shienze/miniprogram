Page({
  data: {
    searchKeyword: '',
    jobs: [],
    page: 1,
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
    wx.cloud.callFunction({
      name: 'recommendJobs',
      data: { page: this.data.page },
      success: res => {
        const result = res.result;
        if (result.success) {
          this.setData({
            jobs: this.data.jobs.concat(result.jobs),
            page: this.data.page + 1
          });
        } else {
          wx.showToast({ title: result.msg, icon: 'none' });
        }
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => this.setData({ loadingMore: false })
    });
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

  toInternMatch: function () {
    wx.navigateTo({ 
      url: '/pages/user/intern-match' 
    });
  },

  toJobDetail: function (e) {
    
    const index = e.currentTarget.dataset.index
    const currentJob = this.data.jobs[index]
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ 
      url: '/pages/user/job-detail?id=' + id 
    })
  }
});