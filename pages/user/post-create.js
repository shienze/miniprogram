// pages/user/post-create.js
Page({
  data: {
    title: '',
    content: '',
    tags: [],
    tagInput: '',
    attachmentPath: '',
    attachmentName: '',
    loading: false
  },

  inputTitle: function (e) {
    this.setData({ title: e.detail.value });
  },

  inputContent: function (e) {
    this.setData({ content: e.detail.value });
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

  submitPost: function () {
    const { title, content, tags, attachmentName } = this.data;
    if (!title || !content) {
      wx.showToast({ title: '请填写标题和内容', icon: 'none' });
      return;
    }
    this.setData({ loading: true });
    
    wx.cloud.callFunction({
      name: 'createPosts',  // 修改为createPosts
      data: { title, content, tags, attachment: attachmentName },
      success: res => {
        const result = res.result;
        if (result.success) {
          wx.showToast({ title: '发布成功' });
          wx.navigateBack();
        } else {
          wx.showToast({ title: result.msg, icon: 'none' });
        }
      },
      fail: err => {
        wx.showToast({ title: '发布失败: ' + err.errMsg, icon: 'none' });
      },
      complete: () => this.setData({ loading: false })
    });
  }
});