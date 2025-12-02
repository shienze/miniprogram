// pages/user/profile.js

Page({
  data: {
    user: {
      avatar: '/images/default-avatar.png', // 默认本地头像（需准备图片）
      name: '',
      school: '',
      major: '',
      // 其他字段...
    },
  },

  onLoad: function () {
    this.loadUserInfo();
  },

  onShow: function () {
    this.loadUserInfo(); // 刷新数据
  },

  loadUserInfo: async function () {
    try {
      const res = await wx.cloud.callFunction({ name: 'getUserProfile' });
      let userData = res.result;
      // 如果avatar为空，用默认
      if (!userData.avatar || userData.avatar === '') {
        userData.avatar = '/images/default-avatar.png';
      }
      this.setData({ user: userData });
    } catch (err) {
      console.error('加载用户数据失败:', err);
      wx.showToast({ title: '加载失败', icon: 'none' });
    }
  },

  // 处理头像点击：只预览图片
  handleAvatarClick: function () {
    const { avatar } = this.data.user;
    wx.previewImage({
      current: avatar,
      urls: [avatar]
    });
  },

  // 处理选择头像（按钮触发）
  onChooseAvatar: async function (e) {
    const avatarUrl = e.detail.avatarUrl;
    if (avatarUrl) {
      // 先更新页面
      this.setData({ 'user.avatar': avatarUrl });
      
      // 调用云函数更新数据库
      try {
        const res = await wx.cloud.callFunction({
          name: 'updateAvatar',
          data: { avatarUrl }
        });
        if (res.result.success) {
          wx.showToast({ title: '头像更新成功' });
          // 刷新数据确保一致
          this.loadUserInfo();
        } else {
          console.error('更新失败:', res.result.message);
          wx.showToast({ title: res.result.message, icon: 'none' });
          // 回滚页面
          this.setData({ 'user.avatar': '/images/default-avatar.png' });
        }
      } catch (err) {
        console.error('调用云函数失败:', err);
        wx.showToast({ title: '更新失败', icon: 'none' });
        this.setData({ 'user.avatar': '/images/default-avatar.png' });
      }
    } else {
      wx.showToast({ title: '未选择头像', icon: 'none' });
    }
  },
  toResumeManage: function () {
    wx.navigateTo({ url: '/pages/user/resume-manage' });
  },

  toApplyTrack: function () {
    wx.navigateTo({ url: '/pages/user/apply-track' });
  },

  toSkillGrowth: function () {
    wx.navigateTo({ url: '/pages/user/skill-growth' });
  },

  toProfileEdit: function () {
    wx.navigateTo({ url: '/pages/user/profile-edit' }); 
  },

  toClasses: function () {
    wx.navigateTo({ url: '/pages/user/class-list' }); 
  },

  toSwitchRole: function () {
    wx.navigateTo({ url: '/pages/common/switch-role' });
  },

  toSettings: function () {
    wx.navigateTo({ url: '/pages/user/settings' }); 
  },

  toCareerTest: function () {
    wx.navigateTo({ url: '/pages/user/career-test' }); 
  },

  logout: function () {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('role');
          wx.removeStorageSync('resume');
          wx.removeStorageSync('appliedJobs');
          wx.showToast({ title: '已退出' });
          wx.reLaunch({ url: '/pages/common/welcome' });
        }
      }
    });
  }
});