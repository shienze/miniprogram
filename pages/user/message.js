// pages/user/message.js
Page({
  data: {
    chats: []
  },

  onLoad: function () {
    this.initMockChats();
    this.loadChats();
  },

  onShow: function () {
    // 刷新（从聊天页返回）
    this.loadChats();
  },

  onPullDownRefresh: function () {
    this.loadChats();
    wx.stopPullDownRefresh();
  },

  initMockChats: function () {
    const storedChats = wx.getStorageSync('chats') || [];
    if (storedChats.length === 0) {
      const initialMock = [
        { id: 1, avatar: '', name: 'XXHR', lastMessage: '您好，您的简历已收到。', time: '10:30', unread: 2 },
        // ...其他
      ];
      wx.setStorageSync('chats', initialMock);
    }
  },

  loadChats: function () {
    let chats = wx.getStorageSync('chats') || [];
    // 更新未读（从每个chatMessages计算）
    chats = chats.map(chat => {
      const messages = wx.getStorageSync('chatMessages_' + chat.id) || [];
      const unread = messages.filter(msg => !msg.read && !msg.isMe).length; // 模拟未读
      return { ...chat, unread };
    });
    this.setData({ chats });
  },

  toChat: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/user/chat?id=' + id });
  }
});