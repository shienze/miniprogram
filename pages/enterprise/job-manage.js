// pages/enterprise/job-manage.js
Page({
  data: {
    jobs: []
  },

  onLoad: function () {
    this.loadJobs();
  },

  onShow: function () {
    this.loadJobs(); // 返回刷新
  },

  loadJobs: function () {
    // 模拟从storage加载
    const storedJobs = wx.getStorageSync('enterpriseJobs') || [];
    this.setData({ jobs: storedJobs });
  },

  toEdit: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/job-edit?id=' + id });
  },

  takeDown: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '下架职位',
      content: '确认下架？',
      success: res => {
        if (res.confirm) {
          let jobs = this.data.jobs;
          const index = jobs.findIndex(j => j.id === id);
          if (index !== -1) {
            jobs[index].status = '下架中';
            wx.setStorageSync('enterpriseJobs', jobs);
            this.setData({ jobs });
            wx.showToast({ title: '下架成功' });
          }
        }
      }
    });
  }
});