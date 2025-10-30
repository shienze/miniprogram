// pages/enterprise/index.js
Page({
  data: {
    stats: { applyCount: 0, viewCount: '0%' },
    jobs: [],
    page: 1,
    loadingMore: false
  },

  onLoad: function () {
    this.loadOverview();
    this.loadJobs();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, jobs: [] });
    this.loadJobs();
    wx.stopPullDownRefresh();
  },

  loadOverview: function () {
    // 模拟统计
    this.setData({ stats: { applyCount: 45, viewCount: '65%' } });
    // 实际API
  },

  loadJobs: function () {
    this.setData({ loadingMore: true });
    // 调用API
    wx.request({
      url: 'https://yourserver.com/enterprise/jobs',
      data: { page: this.data.page },
      success: res => {
        if (res.data.success) {
          this.setData({
            jobs: this.data.jobs.concat(res.data.jobs),
            page: this.data.page + 1
          });
        }
      },
      fail: () => {
        // 模拟
        const mockJobs = [
          { id: 1, title: '前端工程师', status: '已发布', applies: 20, views: 100 },
          { id: 2, title: '产品经理', status: '下架中', applies: 15, views: 80 }
          // 添加更多
        ];
        this.setData({
          jobs: this.data.jobs.concat(mockJobs),
          page: this.data.page + 1
        });
      },
      complete: () => this.setData({ loadingMore: false })
    });
  },

  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadJobs();
    }
  },

  toJobEdit: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/job-edit?id=' + id });
  },

  toPublishJob: function () {
    wx.navigateTo({ url: '/pages/enterprise/job-publish' });
  }
});