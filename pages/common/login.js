// pages/common/login.js
Page({
  data: {
    role: 'user',
    loading: false
  },

  onLoad: function (options) {
    console.log('登录页面加载完成')
    // 从注册页面跳转过来
    if (options.fromRegister) {
      wx.showToast({
        title: '注册成功，请登录',
        icon: 'none'
      })
    }
    this.checkLoginStatus()
  },

  onShow: function () {
    this.checkLoginStatus()
  },

  handleRoleChange: function (e) {
    this.setData({ role: e.detail.value })
    console.log('切换角色为:', e.detail.value)
  },

  // 处理登录点击
  handleLogin: function () {
    console.log('点击登录按钮')
    this.getUserProfile()
  },

  // 获取用户信息
  getUserProfile: function() {
    console.log('开始获取用户信息')
    
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户信息的用途
      success: (res) => {
        console.log('获取用户信息成功:', res)
        this.processLogin(res.userInfo)
      },
      fail: (err) => {
        console.error('获取用户信息失败:', err)
        if (err.errMsg === 'getUserProfile:fail auth deny') {
          wx.showToast({
            title: '需要授权才能登录',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '授权失败，请重试',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  // 处理登录流程
  processLogin: function(userInfo) {
    this.setData({ loading: true })
    wx.showLoading({
      title: '登录中...',
      mask: true
    })

    console.log('获取到的用户信息:', userInfo)

    // 获取微信登录code
    wx.login({
      success: (loginRes) => {
        if (loginRes.code) {
          console.log('获取到登录code:', loginRes.code)
          this.callLoginFunction(loginRes.code, userInfo)
        } else {
          console.error('获取code失败')
          this.loginFail('获取登录凭证失败')
        }
      },
      fail: (err) => {
        console.error('wx.login失败:', err)
        this.loginFail('登录失败，请重试')
      }
    })
  },

  // 调用登录云函数
  callLoginFunction: function(code, userInfo) {
    console.log('调用登录云函数，角色:', this.data.role)
    
    wx.cloud.callFunction({
      name: 'login',
      data: {
        code: code,
        role: this.data.role,
        userInfo: userInfo
      },
      success: (res) => {
        console.log('云函数返回:', res)
        if (res.result && res.result.success) {
          this.loginSuccess(res.result)
        } else {
          this.handleLoginError(res.result)
        }
      },
      fail: (err) => {
        console.error('云函数调用失败:', err)
        this.loginFail('网络错误: ' + err.errMsg)
      }
    })
  },

  // 登录成功处理
  loginSuccess: function(result) {
    console.log('登录成功:', result)
    wx.hideLoading()
    
    // 保存登录状态
    wx.setStorageSync('token', result.token)
    wx.setStorageSync('role', this.data.role)
    wx.setStorageSync('userInfo', result.userInfo)
    
    wx.showToast({
      title: '登录成功',
      icon: 'success',
      duration: 1500,
      success: () => {
        setTimeout(() => {
          this.redirectToHome(this.data.role)
        }, 1500)
      }
    })
    this.setData({ loading: false })
  },

handleLoginError: function(result) {
  console.log('登录业务错误:', result)
  wx.hideLoading()
  
  if (result && result.code === 'USER_NOT_REGISTERED') {
    wx.showModal({
      title: '提示',
      content: result.msg,
      confirmText: '去注册',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/common/register?role=' + this.data.role
          })
        }
      }
    })
  } else {
    wx.showToast({
      title: result ? result.msg : '登录失败',
      icon: 'none',
      duration: 3000
    })
  }
  
  this.setData({ loading: false })
},

  loginFail: function(msg) {
    wx.hideLoading()
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 3000
    })
    this.setData({ loading: false })
  },

  // 检查登录状态
  checkLoginStatus: function() {
    const token = wx.getStorageSync('token')
    const role = wx.getStorageSync('role')
    if (token && role) {
      console.log('检测到已登录，自动跳转')
      this.redirectToHome(role)
    }
  },

  // 跳转到首页
  redirectToHome: function(role) {
    console.log('跳转到首页，角色:', role)
    
    if (role === 'user') {
      wx.switchTab({ 
        url: '/pages/user/index',
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.redirectTo({ url: '/pages/user/index' })
        }
      })
    } else if (role === 'enterprise') {
      wx.navigateTo({ 
        url: '/pages/enterprise/index',
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.redirectTo({ url: '/pages/enterprise/index' })
        }
      })
    } else {
      console.error('未知角色:', role)
      wx.showToast({ 
        title: '角色配置错误', 
        icon: 'none' 
      })
    }
  },

  toRegister: function() {
    console.log('跳转到注册页面')
    wx.navigateTo({ 
      url: '/pages/common/register?role=' + this.data.role
    })
  }
})