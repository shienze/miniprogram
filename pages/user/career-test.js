// pages/user/career-test.js
Page({
  data: {
    personalityOptions: ['外向型', '内向型', '平衡型'],
    personalityIndex: 0,
    skillsOptions: ['技术技能强', '管理技能强', '创意技能强'],
    skillsIndex: 0,
    interestOptions: ['IT', '财务', '设计', '其他'],
    interestIndex: 0,
    report: '',
    recommendations: { certificates: [], courses: [] }
  },

  changePersonality: function (e) {
    this.setData({ personalityIndex: e.detail.value });
  },

  changeSkills: function (e) {
    this.setData({ skillsIndex: e.detail.value });
  },

  changeInterest: function (e) {
    this.setData({ interestIndex: e.detail.value });
  },

  submitTest: function () {
    // 简单算法生成报告
    const personality = this.data.personalityOptions[this.data.personalityIndex];
    const skills = this.data.skillsOptions[this.data.skillsIndex];
    const interest = this.data.interestOptions[this.data.interestIndex];
    const report = '<p>您的个性: ' + personality + '，技能: ' + skills + '，兴趣: ' + interest + '。<br>报告: 适合' + interest + '相关职位。作为大专生，建议加强实践经验，考取相关证书提升竞争力。</p>';
    const certificates = interest === 'IT' ? ['计算机二级', '英语四级'] : ['会计从业资格', '普通话等级'];
    const courses = interest === 'IT' ? ['Python入门', '前端开发'] : ['财务报表', '管理基础'];
    this.setData({ report, recommendations: { certificates, courses } });
    wx.showToast({ title: '报告生成成功' });
  },

  copyWechat: function () {
    wx.setClipboardData({
      data: 'wxid_example',
      success: () => {
        wx.showToast({ title: '微信复制成功' });
      }
    });
  }
});