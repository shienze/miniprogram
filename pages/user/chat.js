// pages/user/chat.js
Page({
  data: {
    messages: [],
    newMessage: '',
    scrollTop: 0,
    chatId: null
  },

  onLoad: function (options) {
    this.data.chatId = options.id;
    this.loadMessages();
    this.markAsRead(); // 进入标记已读
    this.timer = setInterval(() => this.simulateNewMessage(), 5000);
  },

  onUnload: function () {
    clearInterval(this.timer);
  },

  loadMessages: function () {
    // 调用API（示例）
    wx.request({
      url: 'https://yourserver.com/chat/messages',
      data: { id: this.data.chatId },
      success: res => {
        if (res.data.success) {
          this.setData({ messages: res.data.messages });
          this.scrollToBottom();
        }
      },
      fail: () => {
        // 模拟数据
        const mockMessages = [
          { id: 1, avatar: '', text: '您好，有兴趣聊聊职位吗？', time: '10:30', isMe: false },
          { id: 2, avatar: '', text: '是的，请介绍详情。', time: '10:31', isMe: true }
          // 添加更多
        ];
        this.setData({ messages: mockMessages });
        this.scrollToBottom();
      }
    });
  },

  simulateNewMessage: function () {
    // 模拟收到新消息
    const newMsg = {
      id: this.data.messages.length + 1,
      avatar: '',
      text: '模拟新消息：面试时间确认？',
      time: '现在',
      isMe: false
    };
    this.setData({ messages: this.data.messages.concat(newMsg) });
    this.scrollToBottom();
  },

  inputMessage: function (e) {
    this.setData({ newMessage: e.detail.value });
  },

  sendMessage: function () {
    if (!this.data.newMessage) return;
    const newMsg = {
      id: this.data.messages.length + 1,
      avatar: '',
      text: this.data.newMessage,
      time: '现在',
      isMe: true
    };
    this.setData({
      messages: this.data.messages.concat(newMsg),
      newMessage: ''
    });
    this.scrollToBottom();
    // 实际socket发送
  },

  sendAttachment: function () {
    wx.chooseMessageFile({
      count: 1,
      type: 'all',
      success: res => {
        const file = res.tempFiles[0];
        const newMsg = {
          id: this.data.messages.length + 1,
          avatar: '',
          text: '[附件] ' + file.name,
          time: '现在',
          isMe: true
        };
        this.setData({ messages: this.data.messages.concat(newMsg) });
        this.scrollToBottom();
        wx.showToast({ title: '附件发送成功（模拟）' });
      }
    });
  },

  scrollToBottom: function () {
    this.setData({ scrollTop: 99999 }); // 滚动到底
  },

  loadMessages: function () {
    const key = 'chatMessages_' + this.data.chatId;
    const messages = wx.getStorageSync(key) || [];
    this.setData({ messages });
    this.scrollToBottom();
  },

  sendMessage: function () {
    if (!this.data.newMessage) return;
    const key = 'chatMessages_' + this.data.chatId;
    let messages = wx.getStorageSync(key) || [];
    const newMsg = {
      id: messages.length + 1,
      avatar: '',
      text: this.data.newMessage,
      time: '现在',
      isMe: true,
      read: true
    };
    messages.push(newMsg);
    wx.setStorageSync(key, messages);
    this.setData({ messages, newMessage: '' });
    this.scrollToBottom();
    this.updateChatList(); // 更新消息页列表
  },

  sendAttachment: function () {
    // ...原有
    // 类似sendMessage，添加newMsg.text = '[附件] ' + file.name
    messages.push(newMsg);
    wx.setStorageSync(key, messages);
    this.setData({ messages });
    this.scrollToBottom();
    this.updateChatList();
  },

  simulateNewMessage: function () {
    const key = 'chatMessages_' + this.data.chatId;
    let messages = wx.getStorageSync(key) || [];
    const newMsg = {
      id: messages.length + 1,
      avatar: '',
      text: '模拟新消息：面试时间确认？',
      time: '现在',
      isMe: false,
      read: false // 未读
    };
    messages.push(newMsg);
    wx.setStorageSync(key, messages);
    this.setData({ messages });
    this.scrollToBottom();
    this.updateChatList(); // 更新未读
  },

  markAsRead: function () {
    const key = 'chatMessages_' + this.data.chatId;
    let messages = wx.getStorageSync(key) || [];
    messages = messages.map(msg => ({ ...msg, read: true }));
    wx.setStorageSync(key, messages);
    this.setData({ messages });
    this.updateChatList();
  },

  updateChatList: function () {
    let chats = wx.getStorageSync('chats') || [];
    chats = chats.map(chat => {
      if (chat.id === this.data.chatId) {
        const messages = wx.getStorageSync('chatMessages_' + chat.id) || [];
        const lastMsg = messages[messages.length - 1];
        return {
          ...chat,
          lastMessage: lastMsg ? lastMsg.text : chat.lastMessage,
          time: lastMsg ? lastMsg.time : chat.time
        };
      }
      return chat;
    });
    wx.setStorageSync('chats', chats);
  }
});