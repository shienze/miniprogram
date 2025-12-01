// pages/user/community.js
Page({
  data: {
    searchKeyword: '',
    posts: [],
    page: 1,
    loadingMore: false,
    hasMore: true
  },

  onLoad: function () {
    console.log('社区页面加载');
    this.loadPosts();
  },

  onPullDownRefresh: function () {
    console.log('下拉刷新');
    this.setData({ 
      page: 1, 
      posts: [], 
      hasMore: true 
    });
    this.loadPosts().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  inputSearch: function (e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  doSearch: function () {
    console.log('搜索关键词:', this.data.searchKeyword);
    this.setData({ 
      page: 1, 
      posts: [], 
      hasMore: true 
    });
    this.loadPosts();
  },

  loadPosts: function () {
    if (this.data.loadingMore) return;
    
    this.setData({ loadingMore: true });
    console.log('加载帖子，页码:', this.data.page, '关键词:', this.data.searchKeyword);
    
    wx.cloud.callFunction({
      name: 'getPosts',
      data: { 
        page: this.data.page, 
        keyword: this.data.searchKeyword 
      },
      success: res => {
        console.log('云函数调用成功:', res);
        const result = res.result;
        if (result.success) {
          console.log('=== 社区页面获取的帖子数据 ===');
          result.posts.forEach((post, index) => {
            console.log(`帖子${index + 1}:`, {
              title: post.title,
              _id: post._id,
              id: post.id,
              has_id: !!post._id,
              has_id_field: '_id' in post
            });
          });
          
          this.setData({
            posts: this.data.page === 1 ? result.posts : this.data.posts.concat(result.posts),
            page: this.data.page + 1,
            hasMore: result.posts.length >= 10 // 假设每页10条
          });
          
          if (result.posts.length === 0 && this.data.page > 1) {
            wx.showToast({ title: '没有更多数据了', icon: 'none' });
          }
        } else {
          console.error('云函数返回失败:', result.msg);
          wx.showToast({ title: result.msg || '加载失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('云函数调用失败:', err);
        wx.showToast({ title: '加载失败: ' + err.errMsg, icon: 'none' });
      },
      complete: () => {
        this.setData({ loadingMore: false });
      }
    });
  },

  loadMore: function () {
    if (!this.data.loadingMore && this.data.hasMore) {
      this.loadPosts();
    }
  },

  toPostDetail: function (e) {
    console.log('=== 点击帖子调试信息 ===');
    console.log('点击事件数据:', e.currentTarget.dataset);
    
    const postIndex = e.currentTarget.dataset.index;
    const post = this.data.posts[postIndex];
    
    console.log('完整的帖子数据:', post);
    
    // 重要：使用帖子的 _id，不是 postId
    const id = post._id;
    
    console.log('最终使用的ID (_id):', id);
    
    if (!id) {
      wx.showToast({ title: '帖子ID不存在', icon: 'none' });
      return;
    }
    
    wx.navigateTo({ 
      url: '/pages/user/post-detail?id=' + id 
    });
  },

  toCreatePost: function () {
    console.log('跳转到发帖页面');
    wx.navigateTo({ 
      url: '/pages/user/post-create' 
    });
  }
});