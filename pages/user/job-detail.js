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
  
  checkApplied: async function (jobId) {
    try {
      const res = await wx.cloud.callFunction({
        name: 'checkApplied',
        data: { jobId }
      });
      if (res.result.success) {
        this.setData({ applied: res.result.applied });
      }
    } catch (err) {
      console.error('检查投递状态失败:', err);
    }
  },

  applyJob: async function () {
    if (this.data.applied) {
      wx.showToast({ title: '已投递', icon: 'none' });
      return;
    }

    wx.showLoading({ title: '投递中' });

    try {
      // 检查是否有简历
      const resumeRes = await wx.cloud.callFunction({ name: 'getResume' });
      const resume = resumeRes.result;
      if (!resume || (!resume.resumeFile && !resume.education && !resume.workExperience && !resume.certificates && !resume.skills)) {
        wx.showModal({
          title: '提示',
          content: '请先完善简历信息',
          success: (res) => {
            if (res.confirm) {
              wx.navigateTo({ url: '/pages/user/resume-manage' });
            }
          }
        });
        return;
      }

      // 投递
      const applyRes = await wx.cloud.callFunction({
        name: 'applyJob',
        data: { jobId: this.data.job._id }
      });

      if (applyRes.result.success) {
        wx.showToast({ title: '投递成功' });
        this.setData({ applied: true });
      } else {
        wx.showToast({ title: applyRes.result.message || '投递失败', icon: 'none' });
      }
    } catch (err) {
      console.error('投递失败:', err);
      wx.showToast({ title: '网络错误，请重试', icon: 'none' });
    } finally {
      wx.hideLoading();
    }
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
