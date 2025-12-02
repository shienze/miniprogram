Page({
  data: {
    jobs: [],
    loading: false
  },

  onLoad: function () {
    this.loadJobs();
  },

  onShow: function () {
    this.loadJobs(); 
  },

  loadJobs: function () {
    this.setData({ loading: true });
    wx.cloud.callFunction({
      name: 'getEnterpriseJobs',
      success: res => {
        console.log('云函数返回数据:', res);
        const result = res.result;
        console.log('result对象:', result);
        console.log('jobs数组:', result.jobs);
        console.log('success:', result.success);
        
        if (result.success) {
          console.log('数据条数:', result.jobs.length);
          this.setData({ 
            jobs: result.jobs 
          });
        } else {
          wx.showToast({
            title: result.msg || '获取数据失败',
            icon: 'none'
          });
        }
      },
      fail: err => {
        console.error('云函数调用失败:', err);
        wx.showToast({
          title: '加载失败: ' + err.errMsg,
          icon: 'none'
        });
      },
      complete: () => {
        console.log('当前jobs数据:', this.data.jobs);
        this.setData({ loading: false });
      }
    });
  },

  toEdit: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: '/pages/enterprise/job-edit?id=' + id });
  },

  takeDown: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '下架职位',
      content: '确认下架？',
      success: res => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'takeDownJob',
            data: { id },
            success: res => {
              if (res.result.success) {
                wx.showToast({ title: '下架成功' });
                this.loadJobs();
              } else {
                wx.showToast({ title: res.result.msg, icon: 'none' });
              }
            },
            fail: err => {
              wx.showToast({ title: '下架失败', icon: 'none' });
            }
          });
        }
      }
    });
  }
});