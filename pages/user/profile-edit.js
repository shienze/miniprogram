// pages/user/profile-edit.js
Page({
  data: {
    user: {
      name: '',
      school: '',
      major: '',
      grade: '',
      avatar: ''
    },
    loading: false
  },

  onLoad: function () {
    // 加载现有用户信息（模拟）
    const storedUser = wx.getStorageSync('user') || {};
    this.setData({ user: storedUser });
  },

  uploadAvatar: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0];
        // 模拟上传（实际wx.uploadFile到服务器）
        this.setData({
          'user.avatar': filePath
        });
        wx.showToast({ title: '头像上传成功（模拟）' });
      }
    });
  },

  saveProfile: function (e) {
    const formData = e.detail.value;
    if (!formData.name || !formData.school) {
      wx.showToast({ title: '请填写姓名和学校', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    // 保存到storage（模拟）
    const updatedUser = {
      ...this.data.user,
      name: formData.name,
      school: formData.school,
      major: formData.major,
      grade: formData.grade
    };
    wx.setStorageSync('user', updatedUser);
    
    wx.showToast({ title: '保存成功' });
    wx.navigateBack(); // 返回“我的”页
    this.setData({ loading: false });
  }
});