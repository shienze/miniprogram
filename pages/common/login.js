// pages/common/login.js
Page({
  data: {
    role: 'user', // 默认角色
    phone: '',
    code: '',
    countdown: 0, // 验证码倒计时
    loading: false
  },

  onLoad: function () {
    // 可添加动画或初始化
  },

  handleRoleChange: function (e) {
    this.setData({ role: e.detail.value });
  },

  wxLogin: function (e) {
    if (e.detail.errMsg !== 'getUserInfo:ok') return;
    
    this.setData({ loading: true });
    wx.login({
      success: res => {
        if (res.code) {
          // 直接模拟成功（测试用，无需真实API）
          wx.setStorageSync('token', 'fake_token');
          wx.setStorageSync('role', this.data.role);
          wx.showToast({ title: '登录成功（模拟）' });
          this.redirectToHome();
        }
      },
      complete: () => this.setData({ loading: false })
    });
  },

  inputPhone: function (e) {
    this.setData({ phone: e.detail.value });
  },

  inputCode: function (e) {
    this.setData({ code: e.detail.value });
  },

  sendCode: function () {
    if (!this.data.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    // 模拟发送验证码
    wx.showToast({ title: '验证码已发送（模拟）' });
    this.startCountdown();
  },

  startCountdown: function () {
    let countdown = 60;
    this.setData({ countdown });
    const timer = setInterval(() => {
      countdown--;
      this.setData({ countdown });
      if (countdown <= 0) clearInterval(timer);
    }, 1000);
  },

  phoneLogin: function () {
    if (!this.data.phone || !this.data.code) {
      wx.showToast({ title: '请填写完整', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    // 直接模拟成功（任意code通过）
    wx.setStorageSync('token', 'fake_token');
    wx.setStorageSync('role', this.data.role);
    wx.showToast({ title: '登录成功（模拟）' });
    this.redirectToHome();
    this.setData({ loading: false });
  },

  redirectToHome: function () {
    const role = this.data.role;
    if (role === 'user') {
      wx.switchTab({ url: '/pages/user/index' });
    } else if (role === 'enterprise') {
      wx.switchTab({ url: '/pages/enterprise/index' });
    }
  },

  toRegister: function () {
    wx.navigateTo({ url: '/pages/common/register' });
  }
});