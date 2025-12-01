// pages/user/post-detail.js
Page({
  data: {
    post: null,
    comments: [],
    newComment: '',
    liked: false,
    loading: true,
    postId: null,
    submitting: false
  },

  onLoad: function (options) {
    console.log('页面参数 options:', options);
    const id = options.id;
    
    if (!id || id === 'undefined') {
      console.error('无效的帖子ID:', id);
      wx.showToast({ title: '帖子不存在', icon: 'none' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
      return;
    }
  
    console.log('设置帖子ID:', id);
    this.setData({ postId: id });
    this.loadPostDetail(id);
    this.loadComments(id);
  },

  loadPostDetail: function (id) {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getPost',
      data: { id: id },
      success: res => {
        console.log('获取帖子详情完整响应:', res);
        const result = res.result;
        if (result.success && result.post) {
          console.log('帖子数据:', result.post);
          const post = result.post;
          
          // 确保所有必要字段都有值
          const formattedPost = {
            _id: post._id,
            id: post._id,
            author: post.author || '匿名用户',
            authorAvatar: post.authorAvatar || '/images/default-avatar.png',
            time: this.formatTime(post.time),
            title: post.title || '无标题',
            content: post.content || '',
            tags: post.tags || [],
            likes: post.likes || 0,
            comments: post.comments || 0
          };
          
          console.log('格式化后的帖子数据:', formattedPost);
          
          this.setData({ 
            post: formattedPost,
            liked: post.isLiked || false
          });
        } else {
          console.error('获取帖子失败:', result.msg);
          wx.showToast({ title: result.msg || '加载失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('加载帖子失败:', err);
        wx.showToast({ title: '加载失败: ' + err.errMsg, icon: 'none' });
      },
      complete: () => {
        this.setData({ loading: false });
        console.log('加载完成，当前post数据:', this.data.post);
      }
    });
  },

  loadComments: function (id) {
    wx.cloud.callFunction({
      name: 'getComments',
      data: { postId: id },
      success: res => {
        console.log('获取评论:', res);
        const result = res.result;
        if (result.success) {
          const comments = (result.comments || []).map(comment => ({
            id: comment._id,
            author: comment.author || '匿名用户',
            avatar: comment.avatar || '',
            text: comment.text || '',
            time: this.formatTime(comment.time)
          }));
          this.setData({ 
            comments: comments,
            hasMoreComments: result.hasMore || false
          });
        } else {
          wx.showToast({ title: result.msg || '加载评论失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('加载评论失败:', err);
        wx.showToast({ title: '加载评论失败', icon: 'none' });
      }
    });
  },

  toggleLike: function () {
    // 确保使用正确的 postId
    const postId = this.data.postId || (this.data.post && this.data.post._id);
    console.log('点赞操作，postId:', postId);
    
    if (!postId) {
      wx.showToast({ title: '帖子ID不存在', icon: 'none' });
      return;
    }
  
    wx.cloud.callFunction({
      name: 'likePost',
      data: { postId: postId },
      success: res => {
        console.log('点赞结果:', res);
        const result = res.result;
        if (result.success) {
          const newLiked = !this.data.liked;
          const likeChange = newLiked ? 1 : -1;
          
          this.setData({ 
            liked: newLiked,
            'post.likes': Math.max(0, (this.data.post.likes || 0) + likeChange)
          });
          
          wx.showToast({ 
            title: newLiked ? '点赞成功' : '取消点赞', 
            icon: 'success' 
          });
        } else {
          wx.showToast({ title: result.msg || '操作失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('点赞失败:', err);
        wx.showToast({ title: '操作失败', icon: 'none' });
      }
    });
  },
  

  inputComment: function (e) {
    this.setData({ newComment: e.detail.value });
  },

  submitComment: function () {
    const postId = this.data.postId || (this.data.post && this.data.post._id);
    const text = this.data.newComment.trim();
    
    console.log('评论操作，postId:', postId);
    
    if (!postId) {
      wx.showToast({ title: '帖子ID不存在', icon: 'none' });
      return;
    }
    
    if (!text) {
      wx.showToast({ title: '请输入评论内容', icon: 'none' });
      return;
    }
  
    if (this.data.submitting) {
      return;
    }
  
    this.setData({ submitting: true });
    
    wx.cloud.callFunction({
      name: 'addComment',
      data: { 
        postId: postId, 
        text: text 
      },
      success: res => {
        console.log('评论结果:', res);
        const result = res.result;
        if (result.success) {
          this.setData({ 
            newComment: '',
            'post.comments': (this.data.post.comments || 0) + 1
          });
          this.loadComments(postId);
          wx.showToast({ title: '评论成功', icon: 'success' });
        } else {
          wx.showToast({ title: result.msg || '评论失败', icon: 'none' });
        }
      },
      fail: err => {
        console.error('评论失败:', err);
        wx.showToast({ title: '评论失败', icon: 'none' });
      },
      complete: () => {
        this.setData({ submitting: false });
      }
    });
  },

  formatTime: function(date) {
    if (!date) return '未知时间';
    
    if (typeof date === 'string') {
      return date;
    }
    
    const time = new Date(date);
    const now = new Date();
    const diff = now - time;
    
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    if (diff < 2592000000) return Math.floor(diff / 86400000) + '天前';
    
    return time.getFullYear() + '-' + (time.getMonth() + 1) + '-' + time.getDate();
  }
});