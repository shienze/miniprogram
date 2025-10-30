// pages/user/community.js
Page({
  data: {
    searchKeyword: '',
    posts: [],
    page: 1,
    loadingMore: false
  },

  onLoad: function () {
    this.initMockPosts(); // 初始存储mock
    this.loadPosts();
  },

  onShow: function () {
    this.loadPosts(); // 返回刷新
  },


  onPullDownRefresh: function () {
    this.setData({ page: 1, posts: [] });
    this.loadPosts();
    wx.stopPullDownRefresh();
  },


  initMockPosts: function () {
    const storedPosts = wx.getStorageSync('posts') || [];
    if (storedPosts.length === 0) {
      const initialMock = [
        // 原有mockPosts
        { id: 1, author: '李四', authorAvatar: '', time: '1小时前', title: '求职经验分享', preview: '分享我的秋招经历...', tags: ['求职', '经验'], likes: 12, comments: 5 },
        // ...其他
      ];
      wx.setStorageSync('posts', initialMock);
    }
  },

  loadPosts: function () {
    this.setData({ loadingMore: true });
    // 模拟从storage加载
    let posts = wx.getStorageSync('posts') || [];
    // 关键词过滤
    if (this.data.searchKeyword) {
      posts = posts.filter(post => post.title.includes(this.data.searchKeyword) || post.preview.includes(this.data.searchKeyword));
    }
    // 分页模拟（实际storage全载，生产用API分页）
    const pagePosts = posts.slice((this.data.page - 1) * 5, this.data.page * 5);
    this.setData({
      posts: this.data.posts.concat(pagePosts),
      page: this.data.page + 1,
      loadingMore: false
    });
  },


  loadMore: function () {
    if (!this.data.loadingMore) {
      this.loadPosts();
    }
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    this.setData({ page: 1, posts: [] });
    this.loadPosts();
  },

  toPostDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/post-detail?id=' + id });
  },

  toCreatePost: function () {
    wx.navigateTo({ url: '/pages/user/create-post' });
  }
});