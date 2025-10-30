// pages/user/job-search.js
Page({
  data: {
    searchKeyword: '',
    jobs: [], // 初始为空
    page: 1,
    loadingMore: false,
    showFilter: false,
    sortOptions: ['热度', '时间'],
    sortIndex: 0,
    schoolOptions: ['全部', '清华大学', '北京大学', '复旦大学'],
    schoolIndex: 0,
    majorOptions: ['全部', '计算机科学', '工商管理', '电子工程'],
    majorIndex: 0,
    skillOptions: [
      { value: 'JavaScript', name: 'JavaScript', checked: false },
      { value: 'Python', name: 'Python', checked: false },
      { value: 'UI设计', name: 'UI设计', checked: false }
    ],
    locationOptions: ['全部', '北京', '上海', '深圳'],
    locationIndex: 0,
    salaryMin: 10,
    salaryMax: 30
  },

  onLoad: function (options) {
    if (options.keyword) {
      this.setData({ searchKeyword: options.keyword });
    }
    // 优化：直接设置初始模拟数据，便于立即显示（绕过request）
    const initialMockJobs = [
      { id: 1, title: '前端开发工程师', company: '腾讯', salary: '15-20k', location: '深圳', tags: ['React', 'JavaScript'] },
      { id: 2, title: '产品经理', company: '阿里', salary: '20-25k', location: '杭州', tags: ['产品设计', '用户体验'] },
      { id: 3, title: '数据分析师', company: '字节跳动', salary: '18-22k', location: '北京', tags: ['SQL', 'Python'] },
      { id: 4, title: '后端开发', company: '华为', salary: '18-25k', location: '深圳', tags: ['Java', 'Spring'] },
      { id: 5, title: '市场专员', company: '小米', salary: '12-18k', location: '北京', tags: ['营销', '社交媒体'] },
      { id: 6, title: 'UI设计师', company: '网易', salary: '14-20k', location: '广州', tags: ['Photoshop', 'Figma'] },
      { id: 7, title: '数据工程师', company: '腾讯', salary: '20-28k', location: '深圳', tags: ['Big Data', 'Hadoop'] },
      { id: 8, title: 'HR专员', company: '阿里', salary: '10-15k', location: '杭州', tags: ['招聘', '员工关系'] },
      { id: 9, title: '前端实习生', company: '字节跳动', salary: '8-12k', location: '北京', tags: ['Vue', 'HTML5'] },
      { id: 10, title: '运营助理', company: '京东', salary: '9-14k', location: '北京', tags: ['内容运营', '数据分析'] }
    ];
    console.log('初始加载模拟数据:', initialMockJobs); // 调试日志
    this.setData({ jobs: initialMockJobs });
    // 仍调用searchJobs追加更多（模拟分页）
    this.searchJobs();
  },

  onPullDownRefresh: function () {
    this.setData({ page: 1, jobs: [] });
    this.searchJobs();
    wx.stopPullDownRefresh();
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    this.setData({ page: 1, jobs: [] });
    this.searchJobs();
  },

  searchJobs: function () {
    this.setData({ loadingMore: true });
    const params = { /* 同上 */ };
    wx.request({
      url: 'https://yourserver.com/jobs/search',
      data: params,
      success: res => { /* 同上 */ },
      fail: () => {
        // 优化：移除关键词过滤，确保总是显示数据；扩展到更多条目
        let mockJobs = [
          { id: 11, title: '测试工程师', company: '百度', salary: '15-22k', location: '北京', tags: ['自动化测试', 'Selenium'] },
          { id: 12, title: '产品助理', company: '美团', salary: '12-18k', location: '北京', tags: ['需求分析', '原型设计'] },
          { id: 13, title: '算法工程师', company: '华为', salary: '25-35k', location: '深圳', tags: ['机器学习', 'TensorFlow'] },
          { id: 14, title: '运维工程师', company: '腾讯', salary: '16-24k', location: '深圳', tags: ['Linux', 'Docker'] },
          { id: 15, title: '销售经理', company: '阿里', salary: '20-30k', location: '杭州', tags: ['销售策略', '客户管理'] },
          { id: 16, title: '内容创作者', company: '字节跳动', salary: '10-16k', location: '北京', tags: ['视频编辑', '文案写作'] },
          { id: 17, title: '财务分析师', company: '京东', salary: '14-20k', location: '北京', tags: ['Excel', '财务建模'] },
          { id: 18, title: '项目经理', company: '小米', salary: '18-25k', location: '北京', tags: ['PMP', '团队管理'] },
          { id: 19, title: '安卓开发', company: '网易', salary: '15-22k', location: '广州', tags: ['Kotlin', 'Android Studio'] },
          { id: 20, title: 'iOS开发', company: '美团', salary: '16-23k', location: '北京', tags: ['Swift', 'Xcode'] }
        ];
        console.log('加载分页模拟数据 (page ' + this.data.page + '):', mockJobs); // 调试日志
        this.setData({
          jobs: this.data.jobs.concat(mockJobs),
          page: this.data.page + 1
        });
      },
      complete: () => this.setData({ loadingMore: false })
    });
  },

  /* 其余函数如loadMore、changeSort等保持不变 */
});