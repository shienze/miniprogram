// pages/user/skill-growth.js
Page({
  data: {
    majorOptions: ['计算机', '会计', '工商管理', '电子工程', '其他'],
    majorIndex: 0,
    interestOptions: ['技术开发', '财务管理', '市场营销', '设计创意', '其他'],
    interestIndex: 0,
    experienceOptions: ['无经验', '实习经验', '1年以下', '1-3年', '3年以上'],
    experienceIndex: 0,
    planningSuggestion: '',
    courses: [],
    certificates: []
  },

  onLoad: function () {
    this.loadCourses();
    this.loadCertificates();
  },

  changeMajor: function (e) {
    this.setData({ majorIndex: e.detail.value });
  },

  changeInterest: function (e) {
    this.setData({ interestIndex: e.detail.value });
  },

  changeExperience: function (e) {
    this.setData({ experienceIndex: e.detail.value });
  },

  submitQuestionnaire: function (e) {
    const formData = e.detail.value;
    let suggestion = '基于您的选择（专业: ' + this.data.majorOptions[formData.major] + '，兴趣: ' + this.data.interestOptions[formData.interest] + '，经验: ' + this.data.experienceOptions[formData.experience] + '），推荐规划路径：';
    if (formData.major === 0) { 
      suggestion += '先考计算机二级证书，提升编程技能；参加在线Python课程；目标职位: 初中级开发工程师。';
    } else if (formData.major === 1) { 
      suggestion += '考取会计从业资格证；学习Excel高级课程；目标职位: 财务助理。';
    } // ...其他逻辑
    this.setData({ planningSuggestion: suggestion });
    wx.showToast({ title: '规划生成成功' });
    // 实际AI API
  },

  loadCourses: function () {
    // 模拟API
    const mockCourses = [
      { id: 1, title: '大专生Python入门', duration: '10小时', progress: 0 },
      { id: 2, title: '会计证书备考指南', duration: '15小时', progress: 0 },
      { id: 3, title: '计算机等级考试教程', duration: '8小时', progress: 0 }
    ];
    this.setData({ courses: mockCourses });
  },

  loadCertificates: function () {
    const mockCertificates = [
      { id: 1, title: '计算机等级考试（二级）', requirements: '大专以上学历，基础计算机知识', guide: '报名官网:教育部考试中心，每年4次考试' },
      { id: 2, title: '会计从业资格证', requirements: '大专会计相关专业，基础财务知识', guide: '财政部官网报名，每年多次' },
      { id: 3, title: '英语四级（CET-4）', requirements: '大专生可考，英语基础', guide: '教育部考试中心，每年6/12月' },
      { id: 4, title: '教师资格证', requirements: '大专师范类，教育知识', guide: '教育部官网，每年2次' },
      { id: 5, title: '普通话等级证', requirements: '大专生通用，口语测试', guide: '语言文字网，每年多次' }
    ];
    this.setData({ certificates: mockCertificates });
  },

  toCourseDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/course-detail?id=' + id });
  },

  toCertDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '查看证书指南: ID ' + id }); // 模拟跳转，新建certificate-detail
    // wx.navigateTo({ url: '/pages/user/certificate-detail?id=' + id });
  }
});