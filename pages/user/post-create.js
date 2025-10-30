// pages/user/post-create.js
Page({
  data: {
    title: '',
    content: '',
    tags: [],
    tagInput: '', // 临时输入
    attachmentPath: '',
    attachmentName: '',
    loading: false
  },

  onLoad: function () {
    // 可初始化
  },

  addTag: function (e) {
    const tag = e.detail.value.trim();
    if (tag && !this.data.tags.includes(tag)) {
      this.setData({ tags: this.data.tags.concat(tag), tagInput: '' });
    }
  },

  removeTag: function (e) {
    const index = e.currentTarget.dataset.index;
    let tags = this.data.tags;
    tags.splice(index, 1);
    this.setData({ tags });
  },

  uploadAttachment: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: res => {
        const file = res.tempFiles[0];
        this.setData({
          attachmentPath: file.path,
          attachmentName: file.name
        });
        wx.showToast({ title: '附件选择成功' });
      }
    });
  },

  submitPost: function (e) {
    const formData = e.detail.value;
    if (!formData.title || !formData.content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    // 生成新帖
    const storedPosts = wx.getStorageSync('posts') || [];
    const newPost = {
      id: storedPosts.length + 1,
      author: '当前用户', // 模拟
      authorAvatar: '',
      time: '刚刚',
      title: formData.title,
      preview: formData.content.substring(0, 50) + '...',
      content: formData.content, // 详情用
      tags: this.data.tags,
      likes: 0,
      comments: 0
    };
    storedPosts.unshift(newPost); // 加到顶部
    wx.setStorageSync('posts', storedPosts);
    
    wx.showToast({ title: '发布成功' });
    wx.navigateBack(); // 返回社区刷新
    this.setData({ loading: false });
  }
});