// pages/user/post-detail.js
Page({
  data: {
    post: {},
    comments: [],
    newComment: '',
    liked: false,
    loading: true
  },

  onLoad: function (options) {
    const id = options.id;
    if (id) {
      this.loadPostDetail(id);
      this.loadComments(id);
    }
  },

  loadPostDetail: function (id) {
    // 调用API（示例）
    wx.request({
      url: 'https://yourserver.com/community/post',
      data: { id },
      success: res => {
        if (res.data.success) {
          this.setData({ post: res.data.post, loading: false });
        }
      },
      fail: () => {
        // 模拟数据，根据id匹配
        const mockPosts = {
          1: {
            author: '李四',
            authorAvatar: '',
            time: '1小时前',
            title: '求职经验分享',
            content: '<p>分享我的秋招经历，从简历到面试全过程。建议大家提前准备好项目经验，并练习常见问题。</p>',
            tags: ['求职', '经验'],
            likes: 12,
            comments: 5
          },
          2: {
            author: '王五',
            authorAvatar: '',
            time: '2小时前',
            title: '前端面试题汇总',
            content: '<p>整理了React、Vue常见问题，包括状态管理、生命周期等。欢迎补充！</p>',
            tags: ['前端', '面试'],
            likes: 8,
            comments: 3
          }
          // 添加更多模拟帖子
        };
        const post = mockPosts[id] || {};
        this.setData({ post, loading: false });
      }
    });
  },

  loadComments: function (id) {
    // 模拟评论
    const mockComments = [
      { id: 1, author: '用户A', avatar: '', text: '谢谢分享，很实用！', time: '10分钟前' },
      { id: 2, author: '用户B', avatar: '', text: '同意，项目经验很重要。', time: '5分钟前' }
    ];
    this.setData({ comments: mockComments });
    // 实际：wx.request获取评论
  },

  toggleLike: function () {
    this.setData({ liked: !this.data.liked });
    let likes = this.data.post.likes;
    likes += this.data.liked ? 1 : -1;
    this.setData({ 'post.likes': likes });
    wx.showToast({ title: this.data.liked ? '点赞成功' : '取消点赞' });
    // 实际API
  },

  inputComment: function (e) {
    this.setData({ newComment: e.detail.value });
  },

  submitComment: function () {
    if (!this.data.newComment) {
      wx.showToast({ title: '请输入评论', icon: 'none' });
      return;
    }
    // 模拟添加评论
    const newComment = {
      id: this.data.comments.length + 1,
      author: '当前用户',
      avatar: '',
      text: this.data.newComment,
      time: '刚刚'
    };
    this.setData({
      comments: this.data.comments.concat(newComment),
      newComment: '',
      'post.comments': this.data.post.comments + 1
    });
    wx.showToast({ title: '评论成功' });
    // 实际API保存
  }
});