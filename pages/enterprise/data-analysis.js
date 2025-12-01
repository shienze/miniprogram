// pages/enterprise/data-analysis.js
Page({
  data: {
    overview: { applyCount: 0, viewRate: 0 },
    jobStats: [],
    schoolDist: []
  },

  onLoad: function () {
    this.loadData();
  },

  loadData: function () {
    // 模拟聚合storage jobs数据
    const storedJobs = wx.getStorageSync('enterpriseJobs') || [];
    let applyCount = 0;
    let viewCount = 0;
    const schoolMap = {};

    const jobStats = storedJobs.map(job => {
      const applies = job.applies || 0;
      const views = job.views || 0;
      applyCount += applies;
      viewCount += views;
      // 模拟学校分布（假设每个职位有投递学校数据）
      const schools = ['清华大学', '北京大学', '复旦大学']; // 模拟
      schools.forEach(s => {
        schoolMap[s] = (schoolMap[s] || 0) + Math.floor(Math.random() * 5);
      });
      return { id: job.id, title: job.title, applies, views: (views / (applies + views) * 100).toFixed(2) };
    });

    const viewRate = applyCount > 0 ? ((viewCount / applyCount) * 100).toFixed(2) : 0;
    const schoolDist = Object.keys(schoolMap).map(school => ({ school, count: schoolMap[school] }));

    this.setData({ overview: { applyCount, viewRate }, jobStats, schoolDist });
  }
});