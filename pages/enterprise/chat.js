// pages/enterprise/chat.js
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
    // 模拟实时
    this.timer = setInterval(() => {
      this.simulateNewMessage();
    }, 5000);
  },

  onUnload: function () {
    clearInterval(this.timer);
  },

  loadMessages: function () {
    // 模拟（企业视角）
    const mockMessages = [
      { id: 1, avatar: '', text: '您好，我对职位感兴趣。', time: '10:30', isMe: false },
      { id: 2, avatar: '', text: '欢迎，面试时间如何？', time: '10:31', isMe: true }
    ];
    this.setData({ messages: mockMessages });
    this.scrollToBottom();
  },

  simulateNewMessage: function () {
    const newMsg = {
      id: this.data.messages.length + 1,
      avatar: '',
      text: '模拟求职者消息: 简历已更新。',
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
    this.setData({ scrollTop: 99999 });
  }
});