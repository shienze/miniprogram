// pages/user/job-detail.js
Page({
  data: {
    job: {}, // 职位详情
    collected: false,
    applied: false,
    loading: true
  },

  onLoad: function (options) {
    const id = options.id;
    if (id) {
      this.loadJobDetail(id);
    }
  },

  loadJobDetail: function (id) {
    console.log('开始加载职位详情，ID:', id);
    
    // 设置超时机制，防止一直等待
    const timeoutTimer = setTimeout(() => {
      console.log('请求超时，使用模拟数据');
      this.useMockData(id);
    }, 3000);
    
    wx.request({
      url: 'https://yourserver.com/jobs/detail',
      data: { id },
      success: res => {
        clearTimeout(timeoutTimer);
        console.log('请求成功:', res);
        if (res.data && res.data.success) {
          this.setData({ job: res.data.job, loading: false });
          this.checkApplied();
        } else {
          this.useMockData(id);
        }
      },
      fail: (err) => {
        clearTimeout(timeoutTimer);
        console.log('请求失败:', err);
        this.useMockData(id);
      }
    });
  },
  
  // 提取模拟数据到单独函数
  useMockData: function(id) {
    const mockJobs = {
      1: {
        id: 1,
        title: '前端开发工程师',
        company: '腾讯',
        salary: '15-20k',
        location: '深圳',
        tags: ['React', 'JavaScript'],
        description: '<p>负责web前端开发，使用React框架。</p>',
        requirements: '<p>本科以上，2年经验，熟练JS。</p>',
        benefits: '<p>五险一金，年终奖，弹性工作。</p>'
      },
      2: {
        id: 2,
        title: '产品经理',
        company: '阿里',
        salary: '20-25k',
        location: '杭州',
        tags: ['产品设计', '用户体验'],
        description: '<p>产品规划和需求分析。</p>',
        requirements: '<p>3年经验，熟悉敏捷开发。</p>',
        benefits: '<p>股票期权，免费午餐。</p>'
      }
    };
    
    const job = mockJobs[id] || mockJobs[1];
    this.setData({ 
      job: job, 
      loading: false 
    });
    this.checkApplied();
  },

  checkApplied: function () {
    // 模拟检查投递状态
    const appliedJobs = wx.getStorageSync('appliedJobs') || [];
    this.setData({ applied: appliedJobs.includes(this.data.job.id) });
  },

  toggleCollect: function () {
    this.setData({ collected: !this.data.collected });
    wx.showToast({ title: this.data.collected ? '收藏成功' : '取消收藏' });
    // 实际API保存
  },

  applyJob: function () {
    if (this.data.applied) return;
    // 模拟投递
    wx.showToast({ title: '投递成功' });
    this.setData({ applied: true });
    let appliedJobs = wx.getStorageSync('appliedJobs') || [];
    appliedJobs.push(this.data.job.id);
    wx.setStorageSync('appliedJobs', appliedJobs);
    // 跳转进度跟踪或API
    wx.navigateTo({ url: '/pages/user/apply-track' });
  },

  startChat: function () {
    // 模拟发起聊天
    wx.showToast({ title: '发起聊天' });
    wx.navigateTo({ url: '/pages/user/chat?jobId=' + this.data.job.id });
  },

  onShareAppMessage: function () {
    return {
      title: this.data.job.title,
      path: '/pages/user/job-detail?id=' + this.data.job.id
    };
  }
});