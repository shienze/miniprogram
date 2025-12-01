// pages/common/switch-role.js
Page({
  data: {
    role: '', // 当前选择角色
    currentRole: '', // 原角色
    loading: false
  },

  onLoad: function () {
    const token = wx.getStorageSync('token');
    if (!token) {
      wx.showToast({ title: '请先登录', icon: 'none' });
      wx.navigateTo({ url: '/pages/common/login' });
      return;
    }
    
    const currentRole = wx.getStorageSync('role') || 'user';
    this.setData({
      currentRole,
      role: currentRole // 默认选中当前角色
    });
  },

  handleRoleChange: function (e) {
    this.setData({ role: e.detail.value });
  },

  switchRole: function () {
    if (this.data.role === this.data.currentRole) {
      wx.showToast({ title: '已是当前角色', icon: 'none' });
      return;
    }
    
    this.setData({ loading: true });
    
    // 如果切换到企业，可添加认证逻辑（示例：调用API重新认证）
    if (this.data.role === 'enterprise') {
      // 模拟认证（实际可跳转到认证页或调用API）
      wx.showModal({
        title: '企业认证',
        content: '切换到企业角色需重新认证，是否继续？',
        success: res => {
          if (res.confirm) {
            // 这里可跳转到注册页的企业部分，或调用API
            this.doSwitch();
          } else {
            this.setData({ loading: false });
          }
        }
      });
    } else {
      this.doSwitch();
    }
  },

  doSwitch: function () {
    // 更新存储
    wx.setStorageSync('role', this.data.role);
    
    // 刷新token或调用API更新（示例）
    wx.request({
      url: 'https://yourserver.com/update_role', // 替换为真实API
      method: 'POST',
      data: { role: this.data.role },
      header: { 'Authorization': wx.getStorageSync('token') },
      success: () => {
        wx.showToast({ title: '切换成功' });
        this.redirectToHome();
      },
      fail: () => {
        wx.showToast({ title: '切换失败', icon: 'none' });
        // 模拟成功
        this.redirectToHome();
      },
      complete: () => this.setData({ loading: false })
    });
  },

  redirectToHome: function () {
    const role = this.data.role;
    if (role === 'user') {
      wx.switchTab({ url: '/pages/user/index' });
    } else if (role === 'enterprise') {
      wx.reLaunch({ url: '/pages/enterprise/index' });
    }
  },

  goBack: function () {
    wx.navigateBack();
  }
});