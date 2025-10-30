// pages/user/apply-track.js
Page({
  data: {
    applies: [] // 投递列表
  },

  onLoad: function () {
    this.loadApplies();
  },

  loadApplies: function () {
    // 模拟数据：从storage获取appliedJobs，匹配mock职位
    const appliedJobs = wx.getStorageSync('appliedJobs') || [];
    const mockJobs = { // 模拟职位库
      1: { title: '前端开发工程师', company: '腾讯' },
      2: { title: '产品经理', company: '阿里' },
      // 添加更多，从之前mock
    };
    const applies = appliedJobs.map(id => {
      const job = mockJobs[id] || { title: '未知职位', company: '未知公司' };
      const statuses = ['已投递', '查看中', '面试邀请', '拒绝'];
      const status = statuses[Math.floor(Math.random() * 4)];
      return {
        jobId: id,
        ...job,
        applyTime: '2023-10-01',
        status,
        statusClass: status === '已投递' ? 'pending' : status === '查看中' ? 'viewed' : status === '面试邀请' ? 'interview' : 'rejected'
      };
    });
    this.setData({ applies });
  },

  toDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/job-detail?id=' + id });
  },

  startChat: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/chat?jobId=' + id });
  }
});