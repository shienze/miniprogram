// pages/enterprise/profile-edit.js
Page({
  data: {
    company: {
      name: '',
      intro: '',
      contact: '',
      phone: '',
      licensePath: '',
      licenseName: ''
    },
    loading: false
  },

  onLoad: function () {
    // 加载现有信息（模拟）
    const storedCompany = wx.getStorageSync('enterpriseUser') || {};
    this.setData({ company: storedCompany });
  },

  uploadLicense: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0];
        const fileName = filePath.split('/').pop();
        this.setData({
          'company.licensePath': filePath,
          'company.licenseName': fileName
        });
        wx.showToast({ title: '上传成功（模拟）' });
      }
    });
  },

  saveProfile: function (e) {
    const formData = e.detail.value;
    if (!formData.company || !formData.contact) {
      wx.showToast({ title: '请填写公司名称和联系人', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    const updatedCompany = {
      ...this.data.company,
      name: formData.company,
      intro: formData.intro,
      contact: formData.contact,
      phone: formData.phone
    };
    wx.setStorageSync('enterpriseUser', updatedCompany);
    wx.showToast({ title: '保存成功' });
    wx.navigateBack();
    this.setData({ loading: false });
  }
});