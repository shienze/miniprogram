// pages/enterprise/job-edit.js
Page({
  data: {
    job: {
      id: null,
      title: '',
      description: '',
      requirements: '',
      salary: '',
      location: '',
      skills: [],
      status: '已发布'
    },
    loading: false
  },

  onLoad: function (options) {
    const id = parseInt(options.id);
    if (id) {
      this.loadJob(id);
    }
  },

  loadJob: function (id) {
    const storedJobs = wx.getStorageSync('enterpriseJobs') || [];
    const job = storedJobs.find(j => j.id === id);
    if (job) {
      this.setData({ job });
    } else {
      wx.showToast({ title: '职位不存在', icon: 'none' });
    }
  },

  addSkill: function (e) {
    const skill = e.detail.value.trim();
    if (skill && !this.data.job.skills.includes(skill)) {
      this.setData({ 'job.skills': this.data.job.skills.concat(skill) });
    }
  },

  removeSkill: function (e) {
    const index = e.currentTarget.dataset.index;
    let skills = this.data.job.skills;
    skills.splice(index, 1);
    this.setData({ 'job.skills': skills });
  },

  saveJob: function (e) {
    const formData = e.detail.value;
    if (!formData.title || !formData.description) {
      wx.showToast({ title: '请填写标题和描述', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    let storedJobs = wx.getStorageSync('enterpriseJobs') || [];
    const index = storedJobs.findIndex(j => j.id === this.data.job.id);
    if (index !== -1) {
      storedJobs[index] = {
        ...storedJobs[index],
        ...formData,
        skills: this.data.job.skills
      };
      wx.setStorageSync('enterpriseJobs', storedJobs);
      wx.showToast({ title: '保存成功' });
      wx.navigateBack();
    }
    this.setData({ loading: false });
  },

  takeDown: function () {
    this.setData({ loading: true });
    let storedJobs = wx.getStorageSync('enterpriseJobs') || [];
    const index = storedJobs.findIndex(j => j.id === this.data.job.id);
    if (index !== -1) {
      storedJobs[index].status = '下架中';
      wx.setStorageSync('enterpriseJobs', storedJobs);
      wx.showToast({ title: '下架成功' });
      wx.navigateBack();
    }
    this.setData({ loading: false });
  }
});