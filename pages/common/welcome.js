// pages/welcome/welcome.js
Page({
  data: {
    logoAnimationData: {},
    sloganAnimationData: {}
  },

  onLoad: function () {
    // 创建动画实例
    const logoAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out'
    });
    const sloganAnimation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease-in-out',
      delay: 500 // slogan延迟出现
    });

    // logo渐入并轻微放大
    logoAnimation.opacity(1).scale(1.1, 1.1).step();
    // slogan渐入
    sloganAnimation.opacity(1).step();

    this.setData({
      logoAnimationData: logoAnimation.export(),
      sloganAnimationData: sloganAnimation.export()
    });

    // 自动检查登录状态，3秒后跳转（给动画时间）
    setTimeout(() => {
      this.checkLogin();
    }, 3000);
  },

  checkLogin: function () {
    const token = wx.getStorageSync('token');
    const role = wx.getStorageSync('role');
  
    if (token) {
      if (role === 'user') {
        wx.switchTab({ 
          url: '/pages/user/index',
          fail: (err) => {
            console.error('跳转个人首页失败:', err);
            wx.redirectTo({ url: '/pages/common/login' });
          }
        });
      } else if (role === 'enterprise') {
        wx.navigateTo({
          url: '/pages/enterprise/index',
          fail: (err) => {
            console.error('跳转企业首页失败:', err);
            wx.redirectTo({ url: '/pages/common/login' });
          }
        });
      } else {
        wx.redirectTo({ url: '/pages/common/login' });
      }
    } else {
      wx.redirectTo({ url: '/pages/common/login' });
    }
  },

  startApp: function () {
    // 手动点击立即开始，直接检查登录
    this.checkLogin();
  }
});