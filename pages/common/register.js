// pages/common/register.js
Page({
  data: {
    role: 'user', // 默认角色
    phone: '',
    code: '',
    countdown: 0,
    loading: false,
    // 学生字段
    name: '',
    school: '',
    major: '',
    grade: '',
    // 企业字段
    company: '',
    contact: '',
    licensePath: '', // 临时路径
    licenseName: '' // 文件名
  },

  onLoad: function () {
    // 初始化
  },

  handleRoleChange: function (e) {
    this.setData({ role: e.detail.value });
  },

  inputPhone: function (e) {
    this.setData({ phone: e.detail.value });
  },

  inputCode: function (e) {
    this.setData({ code: e.detail.value });
  },

  inputName: function (e) {
    this.setData({ name: e.detail.value });
  },

  inputSchool: function (e) {
    this.setData({ school: e.detail.value });
  },

  inputMajor: function (e) {
    this.setData({ major: e.detail.value });
  },

  inputGrade: function (e) {
    this.setData({ grade: e.detail.value });
  },

  inputCompany: function (e) {
    this.setData({ company: e.detail.value });
  },

  inputContact: function (e) {
    this.setData({ contact: e.detail.value });
  },

  sendCode: function () {
    if (!this.data.phone) {
      wx.showToast({ title: '请输入手机号', icon: 'none' });
      return;
    }
    // 发送验证码（示例）
    wx.request({
      url: 'https://yourserver.com/send_code',
      data: { phone: this.data.phone },
      success: () => {
        wx.showToast({ title: '验证码已发送' });
        this.startCountdown();
      },
      fail: () => wx.showToast({ title: '发送失败', icon: 'none' })
    });
  },

  startCountdown: function () {
    let countdown = 60;
    this.setData({ countdown });
    const timer = setInterval(() => {
      countdown--;
      this.setData({ countdown });
      if (countdown <= 0) clearInterval(timer);
    }, 1000);
  },

  uploadLicense: function () {
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        const filePath = res.tempFilePaths[0];
        const fileName = filePath.split('/').pop();
        this.setData({
          licensePath: filePath,
          licenseName: fileName
        });
      }
    });
  },

  submitRegister: function () {
    // 基本验证
    if (!this.data.phone || !this.data.code) {
      wx.showToast({ title: '请填写手机号和验证码', icon: 'none' });
      return;
    }

    let data = {
      phone: this.data.phone,
      code: this.data.code,
      role: this.data.role
    };

    if (this.data.role === 'user') {
      if (!this.data.name || !this.data.school || !this.data.major) {
        wx.showToast({ title: '请填写完整信息', icon: 'none' });
        return;
      }
      data = { ...data, name: this.data.name, school: this.data.school, major: this.data.major, grade: this.data.grade };
    } else if (this.data.role === 'enterprise') {
      if (!this.data.company || !this.data.contact || !this.data.licensePath) {
        wx.showToast({ title: '请填写完整信息并上传执照', icon: 'none' });
        return;
      }
      data = { ...data, company: this.data.company, contact: this.data.contact };
    }

    this.setData({ loading: true });

    // 如果企业，上传文件
    if (this.data.role === 'enterprise') {
      wx.uploadFile({
        url: 'https://yourserver.com/upload_license', // 替换为真实上传API
        filePath: this.data.licensePath,
        name: 'license',
        formData: { phone: this.data.phone }, // 附加数据
        success: uploadRes => {
          if (uploadRes.statusCode === 200) {
            const uploadData = JSON.parse(uploadRes.data);
            data.licenseUrl = uploadData.url; // 假设返回上传URL
            this.doRegister(data);
          } else {
            wx.showToast({ title: '上传失败', icon: 'none' });
            this.setData({ loading: false });
          }
        },
        fail: () => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          this.setData({ loading: false });
        }
      });
    } else {
      this.doRegister(data);
    }
  },

  doRegister: function (data) {
    wx.request({
      url: 'https://yourserver.com/register',
      method: 'POST',
      data: data,
      success: response => {
        if (response.data.success) {
          wx.showToast({ title: '注册成功' });
          wx.navigateTo({ url: '/pages/common/login' });
        } else {
          wx.showToast({ title: '注册失败：' + response.data.msg, icon: 'none' });
        }
      },
      fail: () => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        // 模拟成功
        wx.showToast({ title: '注册成功（模拟）' });
        wx.navigateTo({ url: '/pages/common/login' });
      },
      complete: () => this.setData({ loading: false })
    });
  },

  toLogin: function () {
    wx.navigateTo({ url: '/pages/common/login' });
  }
});