// pages/user/job-detail.js
Page({
  data: {
    job: {},
    collected: false,
    applied: false,
    loading: true
  },

  onLoad: function (options) {
    const id = options.id;
    if (id) {
      this.loadJobDetail(id);
      this.checkCollected(id);
      this.checkApplied(id);
    } else {
      wx.showToast({ title: '缺少职位ID', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  loadJobDetail: function (id) {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getJobDetail',
      data: { id },
      success: res => {
        const result = res.result;
        if (result.success) {
          this.setData({ job: result.job });
        } else {
          wx.showToast({ title: result.msg, icon: 'none' });
        }
      },
      fail: err => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      }, 
      complete: () => this.setData({ loading: false })
    });
  },

  checkCollected: function (id) {
    const collectedJobs = wx.getStorageSync('collectedJobs') || [];
    this.setData({ collected: collectedJobs.includes(id) });
  },

  checkApplied: function (id) {
    const appliedJobs = wx.getStorageSync('appliedJobs') || [];
    this.setData({ applied: appliedJobs.includes(id) });
  },

  toggleCollect: function () {
    const id = this.data.job.id;
    let collectedJobs = wx.getStorageSync('collectedJobs') || [];
    if (this.data.collected) {
      collectedJobs = collectedJobs.filter(j => j !== id);
    } else {
      collectedJobs.push(id);
    }
    wx.setStorageSync('collectedJobs', collectedJobs);
    this.setData({ collected: !this.data.collected });
    wx.showToast({ title: this.data.collected ? '收藏成功' : '取消收藏' });
  },

  applyJob: function () {
    if (this.data.applied) return;
    const id = this.data.job.id;
    wx.showToast({ title: '投递成功 (模拟)' });
    let appliedJobs = wx.getStorageSync('appliedJobs') || [];
    appliedJobs.push(id);
    wx.setStorageSync('appliedJobs', appliedJobs);
    this.setData({ applied: true });
  },

  startChat: function () {
    const id = this.data.job.id;
    wx.showToast({ title: '发起聊天 (模拟)' });
    wx.navigateTo({ url: '/pages/user/chat?jobId=' + id });
  },

  onShareAppMessage: function () {
    return {
      title: this.data.job.title,
      path: '/pages/user/job-detail?id=' + this.data.job.id
    };
  }
});