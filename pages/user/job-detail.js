// pages/user/job-detail.js
Page({
  data: {
    job: {},
    applied: false,
    loading: true
  },

  onLoad: function (options) {
    console.log('JobDetail onLoad options:', options);
    const id = options.id;
    if (id) {
      this.loadJobDetail(id);
    } else {
      wx.showToast({ title: '缺少职位ID', icon: 'none' });
      this.setData({ loading: false });
    }
  },

  loadJobDetail: function (id) {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getJobDetail',
      data: { id: id },
      success: res => {
        const result = res.result;
        if (result.success) {
          let job = result.job;

          job.certificates = job.certificates || [];
          job.majorRequirements = job.majorRequirements || { category: '', name: '' };
          job.location = job.location || { province: '', city: '', district: '' };
          job.enterpriseInfo = job.enterpriseInfo || {
            company: '',
            contact: '',
            avatar: '',
            email: '',
            nickname: ''
          };

          this.setData({ job: job });
        } else {
          wx.showToast({ title: result.msg || '加载职位失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('getJobDetail 调用失败', err);
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
      }
    });
  },

  startChat: function () {
    const id = this.data.job._id;
    wx.cloud.callFunction({
      name: 'initChat',
      data: { jobId: id },
      success: res => {
        if (res.result.success) {
          wx.navigateTo({ url: '/pages/user/chat?chatId=' + res.result.chatId });
        } else {
          wx.showToast({ title: res.result.msg || '聊天发起失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('initChat 调用失败', err);
        wx.showToast({ title: '发起聊天失败', icon: 'none' });
      }
    });
  },

  onShareAppMessage: function () {
    return {
      title: this.data.job.title || '职位详情',
      path: '/pages/user/job-detail?id=' + this.data.job._id
    };
  }
});
