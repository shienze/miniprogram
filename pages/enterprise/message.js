// pages/enterprise/message.js
Page({
  data: {
    chats: []
  },

  onLoad: function () {
    this.loadChats();
  },

  onShow: function () {
    this.loadChats(); // 刷新
  },

  onPullDownRefresh: function () {
    this.loadChats();
    wx.stopPullDownRefresh();
  },

  loadChats: function () {
    // 调用API（示例）
    wx.request({
      url: 'https://yourserver.com/enterprise/message/list',
      success: res => {
        if (res.data.success) {
          this.setData({ chats: res.data.chats });
        }
      },
      fail: () => {
        // 模拟数据（企业视角，求职者消息）
        const mockChats = [
          { id: 1, avatar: '', name: '求职者张三', lastMessage: '您好，我对职位感兴趣。', time: '10:30', unread: 2 },
          { id: 2, avatar: '', name: '求职者李四', lastMessage: '面试时间确认？', time: '昨天', unread: 0 },
          { id: 3, avatar: '', name: '系统通知', lastMessage: '新投递更新', time: '前天', unread: 1 }
        ];
        this.setData({ chats: mockChats });
      }
    });
  },

  toChat: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/chat?id=' + id });
  }
});